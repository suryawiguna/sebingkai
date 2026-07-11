// Client helpers for the guest event flow: a stable per-device guest token,
// the storage upload, and the RPC calls that enforce capacity/reveal rules.

import { createClient } from "@/lib/supabase/client";

const BUCKET = "event-photos";
const TOKEN_KEY = "sbk_guest_token";

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

  const { error: rpcErr } = await supabase.rpc("add_photo", {
    p_event_id: eventId,
    p_guest_id: guestId,
    p_token: getGuestToken(),
    p_storage_path: path,
  });
  if (rpcErr) throw new Error(rpcErr.message);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
