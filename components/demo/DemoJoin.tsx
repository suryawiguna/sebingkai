"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PHOTO_LIMIT } from "./useDemoStore";

type DemoJoinProps = {
  initialName: string;
  onJoin: (name: string) => void;
};

/**
 * DemoJoin — the guest welcome screen. Interactive version of ScreenJoin:
 * the visitor enters a name before picking up their camera.
 */
export function DemoJoin({ initialName, onJoin }: DemoJoinProps) {
  const [name, setName] = useState(initialName);
  const trimmed = name.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (trimmed) onJoin(trimmed);
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
          Demo Sebingkai
        </span>
        <div className="mt-auto">
          <h1 className="m-0 font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            Pesta Demo Sebingkai
          </h1>
          <div className="mt-2.5 mb-5 flex items-center gap-2 font-mono text-[12px] text-white/[0.78]">
            <span className="inline-flex items-center gap-[5px]">
              <span className="size-1.5 rounded-full bg-accent" />6J TERSISA
            </span>
            <span>·</span>
            <span>{PHOTO_LIMIT} FOTO</span>
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
            disabled={!trimmed}
            className="flex h-[54px] w-full items-center justify-center gap-2 rounded-md bg-accent font-body text-[15px] font-medium text-white transition-[background-color,transform] duration-150 active:scale-[0.98] enabled:hover:bg-accent-hover disabled:opacity-45"
          >
            Ambil kameramu
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </form>
  );
}
