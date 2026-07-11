"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, CalendarClock, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ds/Button";
import { revealEvent, setRevealAt } from "@/app/dashboard/actions";

type Props = {
  eventId: string;
  slug: string;
  status: string;
  revealAt: string | null;
};

/** Formats an ISO instant for a `datetime-local` input in the host's timezone. */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

export function RevealControls({ eventId, slug, status, revealAt }: Props) {
  const [when, setWhen] = useState(toLocalInput(revealAt));
  const [pending, start] = useTransition();
  const revealed = status === "revealed";

  function schedule() {
    if (!when) return;
    // datetime-local is in the host's local time → convert to a UTC instant.
    const iso = new Date(when).toISOString();
    start(() => setRevealAt(eventId, iso));
  }
  function clearSchedule() {
    setWhen("");
    start(() => setRevealAt(eventId, null));
  }
  function revealNow() {
    if (confirm("Ungkap album sekarang untuk semua tamu? Tindakan ini menghentikan pengambilan foto."))
      start(() => revealEvent(eventId));
  }

  return (
    <div className="rounded-md border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-[17px] font-semibold text-ink">Ungkap album</p>
        <span
          className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] ${
            revealed ? "bg-accent-soft text-on-soft" : "bg-base-sunken text-muted"
          }`}
        >
          {revealed ? "Terungkap" : "Tersegel"}
        </span>
      </div>

      {revealed ? (
        <p className="mt-3 font-body text-[14px] leading-[1.5] text-ink-soft">
          Album sudah terungkap — semua tamu bisa melihat foto bersama.
        </p>
      ) : (
        <>
          <p className="mt-2 mb-4 font-body text-[13.5px] leading-[1.5] text-muted">
            Jadwalkan waktu ungkap otomatis, atau ungkap manual kapan saja.
          </p>

          <label className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            <CalendarClock size={13} /> Jadwal ungkap
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="h-[44px] flex-1 rounded-sm border border-border bg-base px-3 font-body text-[14px] text-ink outline-none focus:border-accent"
            />
            <Button type="button" variant="secondary" size="md" onClick={schedule} disabled={pending || !when}>
              Jadwalkan
            </Button>
            {revealAt && (
              <button
                type="button"
                onClick={clearSchedule}
                disabled={pending}
                aria-label="Batalkan jadwal"
                className="flex size-[44px] shrink-0 items-center justify-center rounded-sm border border-border bg-base text-muted transition-colors hover:text-ink"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {revealAt && (
            <p className="mt-2 font-body text-[12.5px] text-muted">
              Terjadwal: {new Date(revealAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          )}

          <div className="my-4 h-px bg-border" />

          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            onClick={revealNow}
            disabled={pending}
            iconLeft={<Eye size={16} />}
          >
            Ungkap sekarang
          </Button>
        </>
      )}

      <Link
        href={`/e/${slug}`}
        target="_blank"
        className="mt-3 flex items-center justify-center gap-1.5 py-1 font-body text-[13px] text-muted transition-colors hover:text-ink"
      >
        {revealed ? "Lihat album" : "Pratinjau halaman tamu"}
        <ExternalLink size={13} />
      </Link>
    </div>
  );
}
