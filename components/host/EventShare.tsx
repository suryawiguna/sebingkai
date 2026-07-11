"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { QrCode } from "@/components/QrCode";
import { Button } from "@/components/ds/Button";

/**
 * EventShare — builds the guest join URL from the live origin (so it's correct
 * in both dev and production), renders a scannable QR, and offers a copy button.
 */
export function EventShare({ slug }: { slug: string }) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => setOrigin(window.location.origin), []);

  const joinUrl = origin ? `${origin}/e/${slug}` : "";

  async function copy() {
    if (!joinUrl) return;
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the link is still visible to select manually */
    }
  }

  return (
    <div className="rounded-md border border-border bg-surface p-6">
      <div className="flex flex-col items-center gap-5">
        <div className="rounded-md bg-white p-3">
          {joinUrl ? <QrCode value={joinUrl} size={168} /> : <div className="size-[168px]" />}
        </div>
        <p className="text-center font-body text-[14px] leading-[1.5] text-ink-soft">
          Tamu scan kode ini untuk bergabung — atau bagikan tautannya.
        </p>
        <div className="flex w-full items-center gap-2">
          <code className="flex-1 truncate rounded-sm border border-border bg-base px-3 py-2.5 font-mono text-[13px] text-ink">
            {joinUrl || "…"}
          </code>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={copy}
            iconLeft={copied ? <Check size={16} /> : <Copy size={16} />}
          >
            {copied ? "Tersalin" : "Salin"}
          </Button>
        </div>
      </div>
    </div>
  );
}
