"use client";

import { useCallback, useRef, useState } from "react";
import { joinEvent, uploadPhoto } from "@/lib/eventClient";

export type EventInfo = {
  id: string;
  slug: string;
  name: string;
  guest_limit: number;
  photo_limit_per_guest: number;
};

/**
 * useEventStore — the real guest flow backing store. Captures show instantly
 * (local data URL) while the upload + add_photo RPC run in the background; a
 * failed upload rolls the photo back so the count stays truthful.
 */
export function useEventStore(event: EventInfo) {
  const [guestName, setGuestName] = useState("");
  const [guestId, setGuestId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const limit = event.photo_limit_per_guest;

  // Ref mirror so the capture cap is enforced against the latest count even
  // under rapid taps (state updates are async).
  const countRef = useRef(0);

  const join = useCallback(
    async (name: string) => {
      setJoining(true);
      setError("");
      try {
        const id = await joinEvent(event.id, name);
        setGuestId(id);
        setGuestName(name);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal bergabung");
        return false;
      } finally {
        setJoining(false);
      }
    },
    [event.id],
  );

  const addPhoto = useCallback(
    (dataUrl: string) => {
      if (!guestId || countRef.current >= limit) return false;
      countRef.current += 1;
      setPhotos((p) => [...p, dataUrl]);

      // Background upload; roll back on failure.
      uploadPhoto(event.id, guestId, dataUrl).catch((e) => {
        countRef.current = Math.max(0, countRef.current - 1);
        setPhotos((p) => p.filter((u) => u !== dataUrl));
        setError(e instanceof Error ? e.message : "Gagal mengunggah foto");
      });
      return true;
    },
    [event.id, guestId, limit],
  );

  return {
    guestName,
    guestId,
    joined: !!guestId,
    joining,
    photos,
    limit,
    atLimit: photos.length >= limit,
    error,
    join,
    addPhoto,
  };
}
