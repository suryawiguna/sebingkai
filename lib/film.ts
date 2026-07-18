// Shared film treatment for captured photos. Mirrors the `.film` CSS filter
// in app/globals.css so demo captures match the look of the marketing screens.

/** Canvas-compatible filter string equivalent to the `.film` CSS class. */
export const FILM_FILTER = "contrast(1.08) saturate(0.85) brightness(0.98)";

/** Longest edge (px) for stored captures — keeps localStorage small. */
export const CAPTURE_MAX_EDGE = 900;

type FrameSource = HTMLVideoElement | HTMLImageElement;

function sourceSize(src: FrameSource): { w: number; h: number } {
  if (src instanceof HTMLVideoElement) {
    return { w: src.videoWidth, h: src.videoHeight };
  }
  return { w: src.naturalWidth, h: src.naturalHeight };
}

/**
 * Draws `src` to a canvas with the film filter applied, downscaled so the
 * longest edge is at most `maxEdge`, and returns a JPEG data URL.
 * Returns null if the source has no intrinsic dimensions yet.
 */
export function captureFilmFrame(
  src: FrameSource,
  maxEdge: number = CAPTURE_MAX_EDGE,
): string | null {
  const { w, h } = sourceSize(src);
  if (!w || !h) return null;

  const scale = Math.min(1, maxEdge / Math.max(w, h));
  const dw = Math.round(w * scale);
  const dh = Math.round(h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.filter = FILM_FILTER;
  ctx.drawImage(src, 0, 0, dw, dh);
  return canvas.toDataURL("image/jpeg", 0.82);
}

/** Longest edge (px) for album-grid thumbnails — a fraction of the egress. */
export const THUMB_MAX_EDGE = 320;

/** Loads a data URL into an HTMLImageElement. */
export function dataUrlToImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Downscales an already-filmed capture (JPEG data URL) to a small thumbnail.
 * No film filter is applied — the look is already baked into the source.
 * Returns the original on any failure so callers can stay resilient.
 */
export async function makeThumb(
  dataUrl: string,
  maxEdge: number = THUMB_MAX_EDGE,
): Promise<string> {
  try {
    const img = await dataUrlToImage(dataUrl);
    const { naturalWidth: w, naturalHeight: h } = img;
    if (!w || !h) return dataUrl;
    const scale = Math.min(1, maxEdge / Math.max(w, h));
    const dw = Math.round(w * scale);
    const dh = Math.round(h * scale);
    const canvas = document.createElement("canvas");
    canvas.width = dw;
    canvas.height = dh;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, dw, dh);
    return canvas.toDataURL("image/jpeg", 0.7);
  } catch {
    return dataUrl;
  }
}

/** Loads a File (e.g. from the native camera picker) into an HTMLImageElement. */
export function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}
