"use client";

import { useEffect, useState } from "react";
import { QrCode } from "./QrCode";

/**
 * HeroQrCard — the "COBA SEKARANG" scan card shown in the hero on desktop.
 * Encodes the live origin so the QR points at this deployment's /demo.
 */
export function HeroQrCard() {
  const [demoUrl, setDemoUrl] = useState("");

  useEffect(() => {
    setDemoUrl(`${window.location.origin}/demo`);
  }, []);

  return (
    <div className="inline-flex items-center gap-4 rounded-lg border border-border bg-surface p-3.5">
      <div className="rounded-md bg-white p-1.5">
        <QrCode value={demoUrl || "https://sebingkai.id/demo"} size={84} />
      </div>
      <div className="pr-2 text-left">
        <p className="m-0 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink">
          Coba sekarang
        </p>
        <p className="m-0 mt-1 font-body text-[12.5px] leading-[1.4] text-muted">
          Pindai untuk coba demo
        </p>
      </div>
    </div>
  );
}
