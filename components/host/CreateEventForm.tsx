"use client";

import { useState } from "react";
import { Button } from "@/components/ds/Button";
import { createEvent } from "@/app/dashboard/actions";

/** Per-guest photo default per tier (mirrors TIERS in actions.ts). */
const TIER_PHOTO_DEFAULT: Record<string, number> = {
  coba: 6,
  kecil: 6,
  standar: 8,
  besar: 10,
};

export function CreateEventForm() {
  const [tier, setTier] = useState("coba");
  const [photoLimit, setPhotoLimit] = useState(TIER_PHOTO_DEFAULT.coba);

  return (
    <form action={createEvent} className="rounded-md border border-border bg-surface p-5">
      <p className="mb-3.5 font-display text-[17px] font-semibold text-ink">Buat acara baru</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="name"
          required
          placeholder="Nama acara — mis. Pernikahan Sarah & Adi"
          className="h-[46px] flex-1 rounded-sm border border-border bg-base px-4 font-body text-[15px] text-ink outline-none placeholder:text-muted focus:border-accent"
        />
        <select
          name="tier"
          value={tier}
          onChange={(e) => {
            setTier(e.target.value);
            setPhotoLimit(TIER_PHOTO_DEFAULT[e.target.value] ?? photoLimit);
          }}
          className="h-[46px] rounded-sm border border-border bg-base px-3 font-body text-[15px] text-ink outline-none focus:border-accent"
        >
          <option value="coba">Coba — 5 tamu</option>
          <option value="kecil">Kecil — 30 tamu</option>
          <option value="standar">Standar — 100 tamu</option>
          <option value="besar">Besar — tak terbatas</option>
        </select>
        <label className="flex h-[46px] items-center gap-2 rounded-sm border border-border bg-base px-3">
          <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
            Foto/tamu
          </span>
          <input
            name="photo_limit"
            type="number"
            min={1}
            max={50}
            value={photoLimit}
            onChange={(e) => setPhotoLimit(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
            aria-label="Foto per tamu"
            className="w-[52px] bg-transparent font-body text-[15px] text-ink outline-none"
          />
        </label>
        <Button type="submit" variant="primary" size="md">
          Buat
        </Button>
      </div>
      <p className="mt-2.5 font-body text-[12.5px] text-muted">
        Batas foto per tamu bisa diubah kapan saja di halaman acara.
      </p>
    </form>
  );
}
