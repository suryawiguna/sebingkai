"use client";

import { useEffect, useRef, useState } from "react";
import { Images } from "lucide-react";
import { ClockText } from "../ClockText";
import { captureFilmFrame, fileToImage } from "@/lib/film";

type DemoCameraProps = {
  count: number;
  limit: number;
  /** Most recent capture, shown as the stacked preview by the shutter. */
  lastPhoto?: string;
  /** Returns false if the capture was rejected (e.g. limit reached). */
  onCapture: (dataUrl: string) => boolean;
  onDone: () => void;
};

const CORNERS: React.CSSProperties[] = [
  { top: -1, left: -1, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 8 },
  { top: -1, right: -1, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 8 },
  { bottom: -1, left: -1, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 8 },
  { bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 8 },
];

/**
 * DemoCamera — live film viewfinder via getUserMedia, with an automatic
 * fallback to the native camera picker (<input capture>) when the browser
 * has no camera access. Captures get the shared film treatment.
 */
export function DemoCamera({ count, limit, lastPhoto, onCapture, onDone }: DemoCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"loading" | "live" | "fallback">("loading");
  const [flash, setFlash] = useState(false);
  const atLimit = count >= limit;

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setMode("fallback");
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setMode("live");
      } catch {
        setMode("fallback");
      }
    }

    start();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function commit(dataUrl: string | null) {
    if (!dataUrl) return;
    const ok = onCapture(dataUrl);
    if (ok) {
      setFlash(true);
      setTimeout(() => setFlash(false), 160);
    }
  }

  function shoot() {
    if (atLimit) return;
    if (mode === "live" && videoRef.current) {
      commit(captureFilmFrame(videoRef.current));
    } else {
      fileRef.current?.click();
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const img = await fileToImage(file);
      commit(captureFilmFrame(img));
    } catch {
      /* ignore unreadable file */
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-phone">
      {flash && <div className="pointer-events-none fixed inset-0 z-50 bg-white/80" />}

      <div className="flex items-center justify-between px-5 pt-[max(44px,env(safe-area-inset-top))] pb-3">
        <span className="font-mono text-[11px] tracking-[0.04em] text-white/[0.72]">DEMO SEBINGKAI</span>
        <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1">
          <span className="size-1.5 rounded-full bg-accent" />
          <ClockText
            start={5 * 3600 + 12 * 60 + 8}
            className="font-mono text-[11px] font-medium tabular-nums text-white"
          />
        </span>
      </div>

      <div className="relative mx-4 flex-1 overflow-hidden rounded-[16px] bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`film h-full w-full object-cover ${mode === "live" ? "opacity-100" : "opacity-0"}`}
        />
        {mode === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[12px] text-white/60">Menyalakan kamera…</span>
          </div>
        )}
        {mode === "fallback" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
            <Images size={26} strokeWidth={1.6} className="text-white/70" />
            <span className="font-body text-[13.5px] leading-[1.5] text-white/75">
              Ketuk tombol rana untuk membuka kamera ponselmu dan ambil foto.
            </span>
          </div>
        )}
        <div className="absolute inset-3 rounded-[8px] border-[1.5px] border-white/50">
          {CORNERS.map((c, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                width: 16,
                height: 16,
                borderColor: "rgba(255,255,255,0.85)",
                borderStyle: "solid",
                borderWidth: 0,
                ...c,
              }}
            />
          ))}
        </div>
        <span className="absolute bottom-[18px] left-[18px] font-mono text-[10px] tracking-[0.08em] text-white/[0.88]">
          KODAK · 1/125
        </span>
      </div>

      <div className="relative flex items-center justify-center pt-5 pb-[max(28px,env(safe-area-inset-bottom))]">
        <span className="absolute left-7 font-mono text-[12px] tabular-nums text-white/[0.72]">
          {count} / {limit}
        </span>
        <button
          type="button"
          onClick={shoot}
          disabled={atLimit}
          aria-label="Ambil foto"
          className="flex size-[64px] items-center justify-center rounded-full border-[3px] border-white/85 transition-transform duration-100 active:scale-95 disabled:opacity-40"
        >
          <span className="size-12 rounded-full bg-white" />
        </button>
        <div className="absolute right-7">
          {count > 0 && lastPhoto ? (
            <button
              type="button"
              onClick={onDone}
              aria-label="Lihat album"
              className="relative block size-12 transition-transform duration-100 active:scale-95"
            >
              {/* stacked layers behind the latest shot imply the growing roll */}
              <span className="absolute inset-0 -rotate-6 rounded-[9px] border border-white/30 bg-white/10" />
              <span className="absolute inset-0 rotate-3 rounded-[9px] border border-white/30 bg-white/10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lastPhoto}
                alt=""
                className="relative size-12 rounded-[9px] border border-white/80 object-cover"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={onDone}
              className="font-body text-[13px] font-medium text-white/85"
            >
              Lewati
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFile}
        className="hidden"
      />
    </div>
  );
}
