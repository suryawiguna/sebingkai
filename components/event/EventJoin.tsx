"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

type EventJoinProps = {
  eventName: string;
  photoLimit: number;
  joining: boolean;
  error: string;
  onJoin: (name: string) => void;
};

/**
 * EventJoin — the real guest welcome screen (event-specific version of
 * DemoJoin). Enters a name, then joins the event before picking up the camera.
 */
export function EventJoin({ eventName, photoLimit, joining, error, onJoin }: EventJoinProps) {
  const [name, setName] = useState("");
  const trimmed = name.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (trimmed && !joining) onJoin(trimmed);
      }}
      className="relative flex h-dvh flex-col bg-phone"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=720&q=75&auto=format&fit=crop"
        alt=""
        className="film absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.1)_36%,rgba(0,0,0,0.92)_100%)]" />
      <div className="relative flex h-full flex-col px-6 pt-[max(48px,env(safe-area-inset-top))] pb-[max(28px,env(safe-area-inset-bottom))]">
        <span className="self-start rounded-full bg-white/[0.14] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white backdrop-blur-[4px]">
          Kamera Tamu
        </span>
        <div className="mt-auto">
          <h1 className="m-0 font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            {eventName}
          </h1>
          <div className="mt-2.5 mb-5 flex items-center gap-2 font-mono text-[12px] text-white/[0.78]">
            <span className="inline-flex items-center gap-[5px]">
              <span className="size-1.5 rounded-full bg-accent" />
              {photoLimit} FOTO UNTUKMU
            </span>
            <span>·</span>
            <span>TERUNGKAP SETELAH ACARA</span>
          </div>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan namamu…"
            maxLength={32}
            className="mb-3 h-[52px] w-full rounded-md border border-white/[0.22] bg-white/[0.12] px-4 font-body text-[15px] text-white placeholder:text-white/[0.55] outline-none focus:border-white/50 backdrop-blur-[4px]"
          />
          <button
            type="submit"
            disabled={!trimmed || joining}
            className="flex h-[54px] w-full items-center justify-center gap-2 rounded-md bg-accent font-body text-[15px] font-medium text-white transition-[background-color,transform] duration-150 active:scale-[0.98] enabled:hover:bg-accent-hover disabled:opacity-45"
          >
            {joining ? "Bergabung…" : "Ambil kameramu"}
            {!joining && <ArrowRight size={17} />}
          </button>
          {error && <p className="mt-3 font-body text-[13px] text-white/90">{error}</p>}
        </div>
      </div>
    </form>
  );
}
