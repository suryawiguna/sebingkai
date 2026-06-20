"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sebingkai.demo.v1";
/** Each demo visitor gets a short single-use roll. */
export const PHOTO_LIMIT = 6;

export type DemoData = {
  guestName: string;
  /** Captured photos as JPEG data URLs. */
  photos: string[];
};

const EMPTY: DemoData = { guestName: "", photos: [] };

function read(): DemoData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DemoData>;
    return {
      guestName: typeof parsed.guestName === "string" ? parsed.guestName : "",
      photos: Array.isArray(parsed.photos) ? parsed.photos.filter((p) => typeof p === "string") : [],
    };
  } catch {
    return EMPTY;
  }
}

/**
 * useDemoStore — localStorage-backed demo state (name + captured photos).
 * Self-contained, single-device; no backend.
 */
export function useDemoStore() {
  const [data, setData] = useState<DemoData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(read());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: DemoData) => {
    setData(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota or private-mode — keep working from in-memory state */
    }
  }, []);

  const setName = useCallback(
    (guestName: string) => persist({ ...read(), guestName }),
    [persist],
  );

  const addPhoto = useCallback(
    (dataUrl: string) => {
      const current = read();
      if (current.photos.length >= PHOTO_LIMIT) return false;
      persist({ ...current, photos: [...current.photos, dataUrl] });
      return true;
    },
    [persist],
  );

  const reset = useCallback(() => persist(EMPTY), [persist]);

  return {
    hydrated,
    guestName: data.guestName,
    photos: data.photos,
    atLimit: data.photos.length >= PHOTO_LIMIT,
    limit: PHOTO_LIMIT,
    setName,
    addPhoto,
    reset,
  };
}
