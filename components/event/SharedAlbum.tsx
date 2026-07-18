"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Download, ArrowRight, ImageOff } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { createClient } from "@/lib/supabase/client";
import { albumTopic, thumbPath } from "@/lib/eventClient";
import { savePhotos } from "@/lib/save";
import { Logo } from "../ds/Logo";

type Photo = { id: string; url: string; thumb: string; guest: string };

const tabPill = (active: boolean) =>
  `whitespace-nowrap rounded-full px-3 py-1.5 font-body text-[11.5px] font-medium transition-colors ${
    active ? "bg-ink text-base" : "bg-surface text-muted"
  }`;

/**
 * SharedAlbum — the revealed album: every guest's photos in one grid, filterable
 * by contributor, with a live Realtime subscription so late arrivals pop in.
 */
export function SharedAlbum({ eventId, eventName }: { eventId: string; eventName: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [viewer, setViewer] = useState(-1);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.rpc("get_event_photos", { p_event_id: eventId });
    const bucket = supabase.storage.from("event-photos");
    const rows: Photo[] = (data ?? []).map(
      (r: { id: string; storage_path: string; guest_name: string | null }) => ({
        id: r.id,
        url: bucket.getPublicUrl(r.storage_path).data.publicUrl,
        thumb: bucket.getPublicUrl(thumbPath(r.storage_path)).data.publicUrl,
        guest: r.guest_name || "Tamu",
      }),
    );
    setPhotos(rows);
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    load();
    // Live: guests broadcast on upload; re-pull the album. Broadcast (not
    // postgres_changes) so anonymous viewers, who lack a photos SELECT policy,
    // still receive the ping.
    const supabase = createClient();
    const channel = supabase
      .channel(albumTopic(eventId))
      .on("broadcast", { event: "new-photo" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, load]);

  const contributors = useMemo(
    () => Array.from(new Set(photos.map((p) => p.guest))),
    [photos],
  );
  const visible = filter === "all" ? photos : photos.filter((p) => p.guest === filter);

  async function save(urls: string[]) {
    if (saving || urls.length === 0) return;
    setSaving(true);
    try {
      await savePhotos(urls);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-base">
      <div className="px-5 pt-[max(44px,env(safe-area-inset-top))] pb-3">
        <div className="flex items-baseline justify-between">
          <h1 className="m-0 font-display text-[22px] font-semibold tracking-[-0.01em] text-ink">
            {eventName}
          </h1>
          <span className="font-mono text-[11px] text-muted">{photos.length} FOTO</span>
        </div>
        <p className="mt-1 font-body text-[13px] text-ink-soft">Album bersama — dari semua tamu.</p>
        {contributors.length > 1 && (
          <div className="mt-3 flex gap-[7px] overflow-x-auto pb-1">
            <button type="button" onClick={() => setFilter("all")} className={tabPill(filter === "all")}>
              Semua
            </button>
            {contributors.map((c) => (
              <button key={c} type="button" onClick={() => setFilter(c)} className={tabPill(filter === c)}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <span className="font-body text-[14px] text-muted">Memuat album…</span>
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-10 text-center">
          <ImageOff size={26} strokeWidth={1.5} className="text-muted" />
          <p className="font-body text-[14px] leading-[1.5] text-muted">Belum ada foto di album ini.</p>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-3 content-start gap-1.5 overflow-y-auto px-5 pb-2">
          {visible.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setViewer(i)}
              className="reveal-pop relative aspect-square overflow-hidden rounded-[10px] border border-border transition-transform duration-100 active:scale-[0.97]"
              style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}
            >
              {/* Grid loads the small thumb; falls back to full-res if a thumb
                  is missing (e.g. photos from before thumbnails existed). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.thumb}
                alt=""
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src !== p.url) e.currentTarget.src = p.url;
                }}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
        {photos.length > 0 && (
          <button
            type="button"
            onClick={() => save(visible.map((p) => p.url))}
            disabled={saving}
            className="mb-2 flex h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-surface font-body text-[14px] font-medium text-ink transition-colors hover:bg-base-sunken disabled:opacity-50"
          >
            <Download size={16} strokeWidth={1.8} />
            {saving ? "Menyimpan…" : "Simpan ke galeri"}
          </button>
        )}
        <Link
          href="/?ref=album"
          className="group mt-1 flex items-center justify-center gap-2 py-1 font-body text-[12px] text-muted transition-colors hover:text-ink"
        >
          <Logo size={13} className="opacity-60 transition-opacity group-hover:opacity-90" />
          <span aria-hidden className="text-border">·</span>
          <span>Buat acaramu sendiri</span>
          <ArrowRight size={13} strokeWidth={1.8} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <Lightbox
        open={viewer >= 0}
        index={Math.max(viewer, 0)}
        close={() => setViewer(-1)}
        on={{ view: ({ index }) => setViewer(index) }}
        slides={visible.map((p) => ({ src: p.url }))}
        plugins={[Thumbnails]}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        thumbnails={{ width: 56, height: 56, border: 0, gap: 8, padding: 0 }}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.94)" } }}
        toolbar={{
          buttons: [
            <button
              key="save"
              type="button"
              className="yarl__button"
              disabled={saving}
              aria-label="Simpan foto ini"
              onClick={() => {
                const p = visible[viewer];
                if (p) save([p.url]);
              }}
            >
              <Download size={22} strokeWidth={1.8} />
            </button>,
            "close",
          ],
        }}
      />
    </div>
  );
}
