"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type PhotoViewerProps = {
  photos: string[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/**
 * PhotoViewer — full-screen photo view with a thumbnail strip to jump
 * between shots. Shown when a gallery tile is tapped.
 */
export function PhotoViewer({ photos, index, onIndexChange, onClose }: PhotoViewerProps) {
  const activeThumb = useRef<HTMLButtonElement>(null);

  // Keep the selected thumbnail in view as you navigate.
  useEffect(() => {
    activeThumb.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  // Close on Escape, arrow keys to navigate.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange(Math.min(index + 1, photos.length - 1));
      if (e.key === "ArrowLeft") onIndexChange(Math.max(index - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length, onClose, onIndexChange]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex items-center justify-between px-5 pt-[max(44px,env(safe-area-inset-top))] pb-2">
        <span className="font-mono text-[12px] tabular-nums text-white/70">
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X size={18} strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[index]}
          alt=""
          className="max-h-full max-w-full rounded-[12px] object-contain"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
        {photos.map((src, i) => (
          <button
            key={i}
            ref={i === index ? activeThumb : undefined}
            type="button"
            onClick={() => onIndexChange(i)}
            aria-label={`Foto ${i + 1}`}
            className={`relative size-14 shrink-0 overflow-hidden rounded-[8px] border transition-[border-color,opacity] ${
              i === index ? "border-white opacity-100" : "border-white/20 opacity-55"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
