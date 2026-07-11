import { Logo } from "@/components/ds/Logo";
import { createClient } from "@/lib/supabase/server";
import { EventFlow, type EventForFlow } from "@/components/event/EventFlow";

export const metadata = { robots: { index: false } };

type EventRow = {
  id: string;
  slug: string;
  name: string;
  tier: string;
  guest_limit: number;
  photo_limit_per_guest: number;
  status: string;
  reveal_at: string | null;
  revealed: boolean;
};

/**
 * Guest join landing. Fetches the event by slug (public RPC) and hands off to
 * the client flow: join → camera → own roll, swapping to the shared album at
 * reveal. Unknown slugs get a friendly not-found instead of a hard 404.
 */
export default async function JoinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_event_by_slug", { p_slug: slug });
  const event = (data?.[0] ?? null) as EventRow | null;

  if (!event) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-base px-6 py-16 text-center">
        <Logo size={32} />
        <h1 className="mt-8 font-display text-[24px] font-semibold tracking-[-0.02em] text-ink">
          Acara tidak ditemukan
        </h1>
        <p className="mt-3 max-w-[320px] font-body text-[15px] leading-[1.55] text-ink-soft">
          Tautan atau kode QR ini tidak cocok dengan acara mana pun. Coba minta
          tautan terbaru dari penyelenggara.
        </p>
      </main>
    );
  }

  const forFlow: EventForFlow = {
    id: event.id,
    slug: event.slug,
    name: event.name,
    guest_limit: event.guest_limit,
    photo_limit_per_guest: event.photo_limit_per_guest,
    status: event.status,
    reveal_at: event.reveal_at,
    revealed: event.revealed,
  };

  return <EventFlow event={forFlow} />;
}
