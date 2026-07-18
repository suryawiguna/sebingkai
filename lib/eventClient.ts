// Client helpers for the guest event flow: a stable per-device guest token,
// the storage upload, and the RPC calls that enforce capacity/reveal rules.

import { createClient } from "@/lib/supabase/client";
import { makeThumb } from "@/lib/film";

const BUCKET = "event-photos";
const TOKEN_KEY = "sbk_guest_token";

/** Derives the thumbnail object path from a full-photo path. */
export const thumbPath = (fullPath: string) => fullPath.replace(/\.jpg$/, "_thumb.jpg");

/** A stable anonymous identity for this device, persisted in localStorage. */
export function getGuestToken(): string {
  if (typeof window === "undefined") return "";
  let t = localStorage.getItem(TOKEN_KEY);
  if (!t) {
    t = crypto.randomUUID();
    localStorage.setItem(TOKEN_KEY, t);
  }
  return t;
}

/** Remembered guest id for a specific event (so a reload keeps the identity). */
export function getStoredGuestId(eventId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`sbk_guest_${eventId}`);
}
function storeGuestId(eventId: string, guestId: string) {
  localStorage.setItem(`sbk_guest_${eventId}`, guestId);
}

/** Join an event (idempotent per device token). Returns the guest id. */
export async function joinEvent(eventId: string, name: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("join_event", {
    p_event_id: eventId,
    p_name: name,
    p_token: getGuestToken(),
  });
  if (error) throw new Error(error.message);
  const guestId = data as string;
  storeGuestId(eventId, guestId);
  return guestId;
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, b64] = dataUrl.split(",");
  const mime = /:(.*?);/.exec(header)?.[1] ?? "image/jpeg";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/**
 * Uploads one capture to the public bucket and records it via add_photo (which
 * re-checks the per-guest limit + reveal state server-side). Returns the photo's
 * public URL. Throws on failure so the caller can roll back the optimistic add.
 */
export async function uploadPhoto(
  eventId: string,
  guestId: string,
  dataUrl: string,
): Promise<string> {
  const supabase = createClient();
  const path = `${eventId}/${guestId}/${crypto.randomUUID()}.jpg`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, dataUrlToBlob(dataUrl), { contentType: "image/jpeg" });
  if (upErr) throw new Error(upErr.message);

  // Best-effort thumbnail (the album grid loads these to slash egress). A thumb
  // failure is non-fatal — the grid falls back to the full image.
  try {
    const thumb = dataUrlToBlob(await makeThumb(dataUrl));
    await supabase.storage
      .from(BUCKET)
      .upload(thumbPath(path), thumb, { contentType: "image/jpeg" });
  } catch {
    /* ignore — grid falls back to full-res */
  }

  const { error: rpcErr } = await supabase.rpc("add_photo", {
    p_event_id: eventId,
    p_guest_id: guestId,
    p_token: getGuestToken(),
    p_storage_path: path,
  });
  if (rpcErr) {
    // NOTE: the object was already written to the (public) bucket. anon has no
    // storage DELETE policy, so we can't clean it up here — the orphan lingers.
    // Deferred: a SECURITY DEFINER cleanup RPC (or lifecycle rule) should sweep
    // objects with no matching photos row. Tracked in PHASE-B.md.
    throw new Error(rpcErr.message);
  }

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// ── Realtime signals ────────────────────────────────────────────────────────
// Guests are anonymous and have no SELECT policy on events/photos, so Supabase
// `postgres_changes` (which is RLS-gated per subscriber) would deliver nothing
// to them. We use public Broadcast channels instead: not RLS-gated, so the
// reveal flip and new-photo pings actually reach guest devices.

export const eventTopic = (eventId: string) => `event-${eventId}`;
export const albumTopic = (eventId: string) => `album-${eventId}`;

/** Fire-and-forget: open a channel, send one broadcast on subscribe, tear down. */
async function signal(topic: string, event: string): Promise<void> {
  const supabase = createClient();
  const channel = supabase.channel(topic);
  await new Promise<void>((resolve) => {
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.send({ type: "broadcast", event, payload: {} });
        resolve();
      }
    });
  });
  // Give the frame a moment to flush before removing the channel.
  setTimeout(() => supabase.removeChannel(channel), 1500);
}

/** Guest → album viewers: a new photo landed, re-pull. */
export function signalNewPhoto(eventId: string): Promise<void> {
  return signal(albumTopic(eventId), "new-photo");
}

/** Host → open guests: the album is now revealed. */
export function signalReveal(eventId: string): Promise<void> {
  return signal(eventTopic(eventId), "reveal");
}
