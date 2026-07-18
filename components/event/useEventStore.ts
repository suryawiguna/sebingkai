"use client";

import { useCallback, useRef, useState } from "react";
import { joinEvent, uploadPhoto, signalNewPhoto } from "@/lib/eventClient";

export type EventInfo = {
  id: string;
  slug: string;
  name: string;
  guest_limit: number;
  photo_limit_per_guest: number;
};

export type UploadStatus = "uploading" | "saved";
export type PhotoUpload = { id: string; dataUrl: string; status: UploadStatus };

/**
 * useEventStore — the real guest flow backing store. Captures show instantly
 * (local data URL) and upload in the background; each carries a status
 * (uploading → saved) so the UI can confirm it reached the event. A failed
 * upload rolls the photo back so the count stays truthful.
 */
export function useEventStore(event: EventInfo) {
  const [guestName, setGuestName] = useState("");
  const [guestId, setGuestId] = useState<string | null>(null);
  const [uploads, setUploads] = useState<PhotoUpload[]>([]);
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
      setError("");
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${countRef.current}`;
      setUploads((u) => [...u, { id, dataUrl, status: "uploading" }]);

      // Background upload; mark saved on success, roll back on failure.
      uploadPhoto(event.id, guestId, dataUrl)
        .then(() => {
          setUploads((u) =>
            u.map((p) => (p.id === id ? { ...p, status: "saved" } : p)),
          );
          void signalNewPhoto(event.id);
        })
        .catch((e) => {
          countRef.current = Math.max(0, countRef.current - 1);
          setUploads((u) => u.filter((p) => p.id !== id));
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
    uploads,
    /** dataURLs only — for the camera preview, lightbox, and save-to-device. */
    photos: uploads.map((u) => u.dataUrl),
    count: uploads.length,
    savingCount: uploads.filter((u) => u.status === "uploading").length,
    limit,
    atLimit: uploads.length >= limit,
    error,
    join,
    addPhoto,
  };
}
