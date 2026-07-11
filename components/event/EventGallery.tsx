"use client";

import { useState } from "react";
import { Camera, Download, Lock } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { savePhotos } from "@/lib/save";

type EventGalleryProps = {
  eventName: string;
  photos: string[];
  limit: number;
  revealAt: string | null;
  onOpenCamera: () => void;
};

function revealHint(revealAt: string | null): string {
  if (!revealAt) return "Album lengkap terungkap saat tuan rumah membukanya.";
  const d = new Date(revealAt);
  if (d.getTime() <= Date.now()) return "Album sedang dibuka…";
  return `Album lengkap terungkap ${d.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  })}.`;
}

/**
 * EventGallery — the guest's own roll during the event. The shared album stays
 * sealed until reveal (handled by the parent flow, which swaps in SharedAlbum);
 * here we show a "sealed" hint plus save-to-device.
 */
export function EventGallery({
  eventName,
  photos,
  limit,
  revealAt,
  onOpenCamera,
}: EventGalleryProps) {
  const [viewer, setViewer] = useState(-1);
  const [saving, setSaving] = useState(false);

  async function save(urls: string[]) {
    if (saving || urls.length === 0) return;
    setSaving(true);
    try {
      await savePhotos(urls);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-base">
      <div className="px-5 pt-[max(44px,env(safe-area-inset-top))] pb-3">
        <div className="flex items-baseline justify-between">
          <h1 className="m-0 font-display text-[20px] font-semibold tracking-[-0.01em] text-ink">
            {eventName}
          </h1>
          <span className="font-mono text-[11px] text-muted">
            {photos.length} / {limit} FOTO
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2">
          <Lock size={13} strokeWidth={1.8} className="shrink-0 text-muted" />
          <span className="font-body text-[12.5px] leading-[1.4] text-ink-soft">
            {revealHint(revealAt)}
          </span>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-10 text-center">
          <Camera size={26} strokeWidth={1.5} className="text-muted" />
          <p className="font-body text-[14px] leading-[1.5] text-muted">
            Belum ada foto. Buka kamera dan ambil momen pertamamu.
          </p>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-3 content-start gap-1.5 overflow-y-auto px-5 pb-2">
          {photos.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setViewer(i)}
              className="reveal-pop relative aspect-square overflow-hidden rounded-[10px] border border-border transition-transform duration-100 active:scale-[0.97]"
              style={{ animationDelay: `${i * 45}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
        {photos.length > 0 && (
          <button
            type="button"
            onClick={() => save(photos)}
            disabled={saving}
            className="mb-2 flex h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface font-body text-[14px] font-medium text-ink transition-colors hover:bg-base-sunken disabled:opacity-50"
          >
            <Download size={16} strokeWidth={1.8} />
            {saving ? "Menyimpan…" : "Simpan fotoku ke galeri"}
          </button>
        )}
        <button
          type="button"
          onClick={onOpenCamera}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-accent font-body text-[14px] font-medium text-white transition-[background-color,transform] duration-150 active:scale-[0.98] hover:bg-accent-hover"
        >
          <Camera size={16} strokeWidth={1.8} />
          Buka kamera
        </button>
      </div>

      <Lightbox
        open={viewer >= 0}
        index={Math.max(viewer, 0)}
        close={() => setViewer(-1)}
        on={{ view: ({ index }) => setViewer(index) }}
        slides={photos.map((src) => ({ src }))}
        plugins={[Thumbnails]}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        thumbnails={{ width: 56, height: 56, border: 0, gap: 8, padding: 0 }}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.94)" } }}
        toolbar={{
          buttons: [
            <button
              key="save"
              type="button"
              className="yarl__button"
              disabled={saving}
              aria-label="Simpan foto ini"
              onClick={() => {
                const src = photos[viewer];
                if (src) save([src]);
              }}
            >
              <Download size={22} strokeWidth={1.8} />
            </button>,
            "close",
          ],
        }}
      />
    </div>
  );
}
