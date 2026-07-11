import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EventShare } from "@/components/host/EventShare";

export const metadata = { title: "Acara", robots: { index: false } };

const TIER_LABEL: Record<string, string> = {
  coba: "Coba",
  kecil: "Kecil",
  standar: "Standar",
  besar: "Besar",
};

export default async function EventDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: event } = await supabase
    .from("events")
    .select("id, name, slug, tier, guest_limit, photo_limit_per_guest, status")
    .eq("id", id)
    .single();

  if (!event) notFound();

  return (
    <main className="min-h-dvh bg-base px-6 py-10">
      <div className="mx-auto w-full max-w-[560px]">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 font-body text-[14px] text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} /> Semua acara
        </Link>

        <h1 className="mt-6 font-display text-[30px] font-semibold tracking-[-0.025em] text-ink">
          {event.name}
        </h1>
        <p className="mt-2 font-body text-[14px] text-muted">
          {TIER_LABEL[event.tier] ?? event.tier} · hingga {event.guest_limit} tamu ·{" "}
          {event.photo_limit_per_guest} foto/tamu · status {event.status}
        </p>

        <div className="mt-7">
          <EventShare slug={event.slug} />
        </div>

        <p className="mt-5 text-center font-body text-[13px] leading-[1.5] text-muted">
          Alur kamera & album tamu menyusul (Phase B). Untuk sekarang, tautan &
          QR sudah aktif dan siap dibagikan.
        </p>
      </div>
    </main>
  );
}
