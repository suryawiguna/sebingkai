"use client";

import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";
import { QrCode } from "../QrCode";

/**
 * DesktopGate — shown when the demo is opened on anything that isn't a
 * portrait phone. Invites the visitor to scan the QR and continue on mobile.
 */
export function DesktopGate() {
  const [demoUrl, setDemoUrl] = useState("");

  useEffect(() => {
    setDemoUrl(`${window.location.origin}/demo`);
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-base px-6 py-16">
      <div className="w-full max-w-[420px] rounded-lg border border-border bg-surface p-8 text-center shadow-card">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent-soft text-on-soft">
          <Smartphone size={22} strokeWidth={1.7} />
        </span>
        <h1 className="mt-5 font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink">
          Buka di ponselmu
        </h1>
        <p className="mx-auto mt-3 max-w-[320px] font-body text-[14.5px] leading-[1.55] text-ink-soft">
          Demo ini dibuat untuk layar ponsel — sama seperti yang dialami tamu acaramu.
          Pindai kode di bawah untuk mencobanya.
        </p>
        <div className="mt-6 flex justify-center">
          <div className="rounded-md bg-white p-3">
            {demoUrl && <QrCode value={demoUrl} size={168} />}
          </div>
        </div>
        <p className="mt-5 font-mono text-[12px] text-muted">Pindai untuk coba demo</p>
      </div>
    </div>
  );
}
