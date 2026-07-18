"use client";

import { useState, useTransition } from "react";
import { Images } from "lucide-react";
import { Button } from "@/components/ds/Button";
import { setPhotoLimit } from "@/app/dashboard/actions";

export function PhotoLimitControl({ eventId, value }: { eventId: string; value: number }) {
  const [limit, setLimit] = useState(value);
  const [pending, start] = useTransition();

  return (
    <div className="rounded-md border border-border bg-surface p-5">
      <div className="flex items-center gap-1.5">
        <Images size={15} className="text-muted" />
        <p className="font-display text-[17px] font-semibold text-ink">Foto per tamu</p>
      </div>
      <p className="mt-1.5 mb-3.5 font-body text-[13.5px] leading-[1.5] text-muted">
        Batas jumlah foto yang bisa diambil setiap tamu. Berlaku langsung.
      </p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={50}
          value={limit}
          onChange={(e) => setLimit(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
          className="h-[44px] w-[88px] rounded-sm border border-border bg-base px-3 font-body text-[15px] text-ink outline-none focus:border-accent"
        />
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => start(() => setPhotoLimit(eventId, limit))}
          disabled={pending || limit === value}
        >
          {pending ? "Menyimpan…" : "Simpan"}
        </Button>
      </div>
    </div>
  );
}
