"use client";

import { useCallback, useState } from "react";

/** Each demo visitor gets a short single-use roll. */
export const PHOTO_LIMIT = 6;

export type DemoData = {
  guestName: string;
  /** Captured photos as JPEG data URLs. */
  photos: string[];
};

const EMPTY: DemoData = { guestName: "", photos: [] };

/**
 * useDemoStore — in-memory demo state (name + captured photos). Intentionally
 * NOT persisted: every device/visit starts fresh, so the gallery only ever
 * shows photos taken in this session — never another user's or a past cache.
 * Reloading the page clears everything.
 */
export function useDemoStore() {
  const [data, setData] = useState<DemoData>(EMPTY);

  const setName = useCallback(
    (guestName: string) => setData((d) => ({ ...d, guestName })),
    [],
  );

  const addPhoto = useCallback(
    (dataUrl: string) => {
      if (data.photos.length >= PHOTO_LIMIT) return false;
      // Updater still guards the cap as the real enforcement (rapid taps).
      setData((d) =>
        d.photos.length >= PHOTO_LIMIT ? d : { ...d, photos: [...d.photos, dataUrl] },
      );
      return true;
    },
    [data.photos.length],
  );

  const reset = useCallback(() => setData(EMPTY), []);

  return {
    hydrated: true,
    guestName: data.guestName,
    photos: data.photos,
    atLimit: data.photos.length >= PHOTO_LIMIT,
    limit: PHOTO_LIMIT,
    setName,
    addPhoto,
    reset,
  };
}
