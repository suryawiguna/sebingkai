import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/ds/Logo";
import { Button } from "@/components/ds/Button";
import { CreateEventForm } from "@/components/host/CreateEventForm";
import { signOut } from "./actions";

export const metadata = { title: "Dashboard", robots: { index: false } };

const TIER_LABEL: Record<string, string> = {
  coba: "Coba",
  kecil: "Kecil",
  standar: "Standar",
  besar: "Besar",
};

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: events } = await supabase
    .from("events")
    .select("id, name, slug, tier, guest_limit, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-dvh bg-base px-6 py-10">
      <div className="mx-auto w-full max-w-[720px]">
        <header className="flex items-center justify-between">
          <Logo />
          <form action={signOut}>
            <Button type="submit" variant="ghost" size="sm">
              Keluar
            </Button>
          </form>
        </header>

        <p className="mt-8 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
          {user.email}
        </p>
        <h1 className="mt-2 font-display text-[30px] font-semibold tracking-[-0.025em] text-ink">
          Acaramu
        </h1>

        {/* Create event */}
        <div className="mt-6">
          <CreateEventForm />
        </div>

        {/* Event list */}
        <div className="mt-6 flex flex-col gap-2.5">
          {events && events.length > 0 ? (
            events.map((ev) => (
              <Link
                key={ev.id}
                href={`/dashboard/events/${ev.id}`}
                className="flex items-center gap-3 rounded-md border border-border bg-surface px-[18px] py-4 transition-colors hover:border-ink-soft"
              >
                <span className="flex-1">
                  <span className="block font-display text-[17px] font-semibold text-ink">
                    {ev.name}
                  </span>
                  <span className="mt-0.5 block font-body text-[13px] text-muted">
                    {TIER_LABEL[ev.tier] ?? ev.tier} · hingga {ev.guest_limit} tamu · /e/{ev.slug}
                  </span>
                </span>
                <ChevronRight size={18} className="shrink-0 text-muted" />
              </Link>
            ))
          ) : (
            <p className="rounded-md border border-dashed border-border px-[18px] py-8 text-center font-body text-[14px] text-muted">
              Belum ada acara. Buat yang pertama di atas.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
