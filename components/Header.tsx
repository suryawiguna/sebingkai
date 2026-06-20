"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./ds/Logo";
import { Button } from "./ds/Button";
import { Shell } from "./ui";

const links = [
  { label: "Cara kerja", href: "#cara-kerja" },
  { label: "Untuk acara", href: "#contoh" },
  { label: "Harga", href: "#harga" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-base/[0.72] backdrop-blur-[12px]">
      <Shell className="relative flex h-[60px] items-center justify-between desk:h-[70px]">
        <a href="#top" className="inline-flex no-underline">
          <span className="desk:hidden">
            <Logo size={21} />
          </span>
          <span className="hidden desk:inline-flex">
            <Logo size={24} />
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-8 desk:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-body text-[14.5px] text-ink-soft no-underline hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3.5 desk:flex">
          <Button variant="primary" size="sm">
            Buat album
          </Button>
        </div>

        {/* Mobile cluster */}
        <div className="flex items-center gap-2.5 desk:hidden">
          <Button variant="primary" size="sm">
            Mulai
          </Button>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="flex size-[38px] items-center justify-center rounded-[10px] border border-border bg-transparent"
          >
            {open ? <X size={18} className="text-ink" /> : <Menu size={18} className="text-ink" />}
          </button>
        </div>
      </Shell>

      {/* Slide-down menu (mobile only) */}
      <div
        className="overflow-hidden bg-base transition-[max-height] duration-[280ms] ease-in-out desk:hidden"
        style={{
          maxHeight: open ? 300 : 0,
          borderTop: open ? "1px solid var(--color-border)" : "1px solid transparent",
        }}
      >
        <Shell style={{ padding: open ? "10px 22px 18px" : "0 22px" }}>
          <nav className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-border px-0.5 py-[13px] font-body text-[16px] text-ink-soft no-underline"
              >
                {l.label}
              </a>
            ))}
            <a href="#" className="px-0.5 py-[13px] font-body text-[15px] text-muted no-underline">
              Masuk
            </a>
          </nav>
        </Shell>
      </div>
    </header>
  );
}
