// Saving demo captures to the phone. The Web Share API surfaces the native
// share sheet (which includes "Save Image" / "Save to Photos" on iOS & Android);
// where it's unavailable we fall back to plain file downloads.

/** Synchronous data-URL → Blob so we can build Files without an async gap
 *  (awaiting fetch() before navigator.share() drops Safari's user gesture). */
function dataUrlToBlob(dataUrl: string): Blob {
  const [header, b64] = dataUrl.split(",");
  const mime = /:(.*?);/.exec(header)?.[1] ?? "image/jpeg";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function downloadFile(file: File) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Saves one or more photos to the device. Tries the native share sheet first
 * (so the user can "Save to Photos"), otherwise downloads each file.
 * Returns true if the share/download was initiated (false only on hard failure).
 */
export async function savePhotos(dataUrls: string[], prefix = "sebingkai"): Promise<boolean> {
  if (dataUrls.length === 0) return false;

  const files = dataUrls.map(
    (u, i) => new File([dataUrlToBlob(u)], `${prefix}-${i + 1}.jpg`, { type: "image/jpeg" }),
  );

  // No await before navigator.share() — keep the click's transient activation.
  if (typeof navigator !== "undefined" && navigator.canShare?.({ files })) {
    try {
      await navigator.share({ files });
      return true;
    } catch (err) {
      // User dismissed the sheet — nothing more to do.
      if (err instanceof DOMException && err.name === "AbortError") return true;
      // Anything else: fall through to the download fallback.
    }
  }

  files.forEach(downloadFile);
  return true;
}
