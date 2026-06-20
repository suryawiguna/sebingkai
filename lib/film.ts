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
