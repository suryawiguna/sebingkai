import { Logo } from "@/components/ds/Logo";

export const metadata = { robots: { index: false } };

/**
 * Guest join landing (Phase A stub). The real join → camera → album flow lands
 * in Phase B; for now this resolves the QR/link to a friendly placeholder
 * instead of a 404. It intentionally does not query the DB yet.
 */
export default async function JoinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-base px-6 py-16 text-center">
      <Logo size={32} />
      <h1 className="mt-8 font-display text-[26px] font-semibold tracking-[-0.02em] text-ink">
        Kamu diundang!
      </h1>
      <p className="mt-3 max-w-[340px] font-body text-[15px] leading-[1.55] text-ink-soft">
        Kamera tamu untuk acara ini sedang disiapkan. Sebentar lagi kamu bisa
        memotret dan mengisi album bersama di sini.
      </p>
      <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
        Acara · {slug}
      </p>
    </main>
  );
}
