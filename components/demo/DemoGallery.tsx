"use client";

import { Camera, RotateCcw } from "lucide-react";

type DemoGalleryProps = {
  guestName: string;
  photos: string[];
  limit: number;
  onOpenCamera: () => void;
  onReset: () => void;
};

/**
 * DemoGallery — the revealed album. Interactive version of ScreenAlbum,
 * rendering the visitor's own captured photos in a 2-column grid.
 */
export function DemoGallery({ guestName, photos, limit, onOpenCamera, onReset }: DemoGalleryProps) {
  const who = guestName || "Kamu";
  return (
    <div className="flex h-dvh flex-col bg-base">
      <div className="px-5 pt-[max(44px,env(safe-area-inset-top))] pb-3">
        <div className="flex items-baseline justify-between">
          <h1 className="m-0 font-display text-[20px] font-semibold tracking-[-0.01em] text-ink">
            Pesta Demo Sebingkai
          </h1>
          <span className="font-mono text-[11px] text-muted">
            {photos.length} / {limit} FOTO
          </span>
        </div>
        <div className="mt-3 flex gap-[7px]">
          <span className="whitespace-nowrap rounded-full bg-ink px-3 py-1.5 font-body text-[11.5px] font-medium text-base">
            Semua
          </span>
          <span className="whitespace-nowrap rounded-full bg-surface-2 px-3 py-1.5 font-body text-[11.5px] font-medium text-muted">
            {who}
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
        <div className="grid flex-1 grid-cols-2 content-start gap-2 overflow-y-auto px-5 pb-2">
          {photos.map((src, i) => (
            <div
              key={i}
              className="reveal-pop relative aspect-[1/1.2] overflow-hidden rounded-[12px] border border-border"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/55 px-[7px] py-0.5 font-body text-[10px] font-medium text-white backdrop-blur-[2px]">
                {who}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onOpenCamera}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-accent font-body text-[14px] font-medium text-white transition-[background-color,transform] duration-150 active:scale-[0.98] hover:bg-accent-hover"
        >
          <Camera size={16} strokeWidth={1.8} />
          Buka kamera
        </button>
        <button
          type="button"
          onClick={onReset}
          aria-label="Mulai ulang"
          className="flex size-12 items-center justify-center rounded-md border border-border bg-surface text-ink-soft transition-colors hover:bg-base-sunken"
        >
          <RotateCcw size={16} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
