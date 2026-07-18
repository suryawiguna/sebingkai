"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2, Loader2, ImageOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { thumbPath } from "@/lib/eventClient";

type HostPhoto = { id: string; url: string; guest: string };

/**
 * EventPhotos — host moderation grid. Shows every photo in the event (regardless
 * of reveal state, via get_host_event_photos) and lets the host delete any one
 * (delete_event_photo removes the row + full & thumb objects, freeing the
 * guest's slot). Grid loads thumbnails to keep it light.
 */
export function EventPhotos({ eventId }: { eventId: string }) {
  const [photos, setPhotos] = useState<HostPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.rpc("get_host_event_photos", { p_event_id: eventId });
    const bucket = supabase.storage.from("event-photos");
    setPhotos(
      (data ?? []).map(
        (r: { id: string; storage_path: string; guest_name: string | null }) => ({
          id: r.id,
          url: bucket.getPublicUrl(thumbPath(r.storage_path)).data.publicUrl,
          guest: r.guest_name || "Tamu",
        }),
      ),
    );
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Hapus foto ini dari album? Tindakan ini tidak bisa dibatalkan.")) return;
    setDeleting(id);
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_event_photo", { p_photo_id: id });
    if (!error) setPhotos((p) => p.filter((x) => x.id !== id));
    setDeleting(null);
  }

  return (
    <div className="rounded-md border border-border bg-surface p-5">
      <div className="mb-3.5 flex items-baseline justify-between">
        <p className="font-display text-[17px] font-semibold text-ink">Foto masuk</p>
        <span className="font-mono text-[11px] text-muted">{photos.length} FOTO</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={18} className="animate-spin text-muted" />
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <ImageOff size={22} strokeWidth={1.5} className="text-muted" />
          <p className="font-body text-[13.5px] text-muted">Belum ada foto dari tamu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
          {photos.map((p) => (
            <div
              key={p.id}
              className="group relative aspect-square overflow-hidden rounded-[10px] border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1 pt-3 font-body text-[10px] text-white">
                {p.guest}
              </span>
              <button
                type="button"
                onClick={() => remove(p.id)}
                disabled={deleting === p.id}
                aria-label={`Hapus foto dari ${p.guest}`}
                className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-accent disabled:opacity-60"
              >
                {deleting === p.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
