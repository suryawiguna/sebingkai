"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "./ds/Button";
import { PhoneFrame } from "./ds/PhoneFrame";
import { Eyebrow } from "./ui";
import { Reveal } from "./Reveal";
import { ScreenAlbum } from "./screens";

type Tier = {
  id: string;
  name: string;
  price: string;
  was?: string;
  unit: string;
  guests: string;
  popular?: boolean;
};

const tiers: Tier[] = [
  { id: "coba", name: "Coba", price: "Rp0", unit: "selamanya", guests: "Hingga 5 tamu" },
  { id: "kecil", name: "Kecil", price: "Rp49rb", unit: "sekali bayar", guests: "Hingga 30 tamu" },
  {
    id: "standar",
    name: "Standar",
    price: "Rp149rb",
    was: "Rp199rb",
    unit: "sekali bayar",
    guests: "Hingga 100 tamu",
    popular: true,
  },
  {
    id: "besar",
    name: "Besar",
    price: "Rp599rb",
    was: "Rp799rb",
    unit: "sekali bayar",
    guests: "Tamu tak terbatas",
  },
];

// "Rp199rb" -> 199; used to derive the discount percentage.
const priceValue = (s: string) => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0;
const discountPct = (was: string, price: string) =>
  Math.round((1 - priceValue(price) / priceValue(was)) * 100);

const features = [
  "Preset film custom",
  "Batas foto per tamu",
  "Pilih filter & efek",
  "Lihat siapa pemotretnya",
  "Privat & aman",
  "Undang lewat QR atau tautan",
];

export function Pricing() {
  const [sel, setSel] = useState("standar");
  const chosen = tiers.find((t) => t.id === sel)!;

  return (
    <section id="harga" className="border-t border-border bg-base-sunken py-14 desk:py-[84px]">
      <div className="mx-auto box-border w-full max-w-[660px] px-[clamp(20px,5vw,40px)] desk:max-w-[1040px]">
        <div className="grid grid-cols-1 items-start gap-0 desk:grid-cols-[0.82fr_1.18fr] desk:gap-14">
          {/* Desktop left rail: the payoff — a finished album on a phone */}
          <Reveal className="sticky top-[100px] hidden desk:block">
            <div className="flex justify-center">
              <PhoneFrame className="[--pw:266px]">
                <ScreenAlbum />
              </PhoneFrame>
            </div>
            <p className="mx-auto mt-7 max-w-[300px] text-center font-display text-[19px] font-semibold italic leading-[1.4] tracking-[-0.01em] text-ink">
              Inilah yang kamu dapat: satu album yang diisi semua tamu.
            </p>
          </Reveal>

          <div>
            <Reveal className="mb-7 text-center desk:text-left">
              <Eyebrow>Harga</Eyebrow>
              <h2 className="mt-3 mb-3.5 font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.025em] text-ink desk:text-[40px]">
                Simpel, sekali bayar per acara.
              </h2>
              <p className="mx-auto max-w-[460px] font-body text-[15.5px] leading-[1.55] text-ink-soft desk:mx-0 desk:text-[17px]">
                Tanpa langganan. Pilih paket sesuai jumlah tamu — bayar satu kali, album jadi
                milikmu.
              </p>
            </Reveal>

            {/* Selectable tier rows */}
            <div className="flex flex-col gap-2.5">
              {tiers.map((t, i) => {
                const isActive = t.id === sel;
                return (
                  <Reveal key={t.id} delay={i * 50}>
                    <button
                      onClick={() => setSel(t.id)}
                      className={`flex w-full items-center gap-3.5 rounded-md bg-surface px-[18px] py-4 text-left transition-[border-color] duration-150 ${
                        isActive
                          ? "border-[1.5px] border-accent ring-[3px] ring-[rgba(255,45,45,0.09)]"
                          : "border border-border"
                      }`}
                    >
                      <span
                        className={`size-5 shrink-0 rounded-full transition-[border] duration-150 ${
                          isActive ? "border-[6px] border-accent" : "border-[1.5px] border-border"
                        }`}
                      />
                      <span className="flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-display text-[18px] font-semibold tracking-[-0.01em] text-ink">
                            {t.name}
                          </span>
                          {t.popular && (
                            <span className="rounded-full bg-accent-soft px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.06em] text-on-soft">
                              Populer
                            </span>
                          )}
                        </span>
                        <span className="mt-[3px] block font-body text-[13px] text-muted">
                          {t.guests}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        {t.was && (
                          <span className="mb-0.5 flex items-center justify-end gap-1.5">
                            <span className="font-body text-[13px] text-muted line-through">
                              {t.was}
                            </span>
                            <span className="rounded-full bg-accent px-1.5 py-0.5 font-mono text-[10px] font-medium text-white">
                              -{discountPct(t.was, t.price)}%
                            </span>
                          </span>
                        )}
                        <span className="block font-display text-[20px] font-semibold tracking-[-0.02em] text-ink">
                          {t.price}
                        </span>
                        <span className="mt-0.5 block font-body text-[11.5px] text-muted">
                          {t.unit}
                        </span>
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </div>

            {/* Feature checklist */}
            <Reveal delay={80} className="mt-3">
              <div className="rounded-md border border-border bg-surface px-5 pt-5 pb-[22px]">
                <p className="mb-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                  Semua paket termasuk
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {features.map((f) => (
                    <span
                      key={f}
                      className="flex items-start gap-[9px] font-body text-[13.5px] leading-[1.35] text-ink-soft"
                    >
                      <Check size={16} strokeWidth={1.8} className="mt-px shrink-0 text-accent" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="mt-[18px]">
              <Link href="/login" className="block">
                <Button variant="primary" size="lg" fullWidth>
                  {chosen.id === "coba"
                    ? "Mulai gratis"
                    : `Pilih paket ${chosen.name} · ${chosen.price}`}
                </Button>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
