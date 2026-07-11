"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ds/Button";
import { Logo } from "@/components/ds/Logo";

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.92v2.34A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.92a9 9 0 0 0 0 8.12l3.06-2.34Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .92 4.94l3.06 2.34C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function signInWithGoogle() {
    const supabase = createClient();
    const next = params.get("next") || "/dashboard";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    // On success the browser is redirected to Google; we only get here on error.
    if (error) {
      setError(error.message);
      setStatus("error");
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const supabase = createClient();
    const next = params.get("next") || "/dashboard";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="w-full max-w-[400px]">
      <Logo />
      <h1 className="mt-8 font-display text-[28px] font-semibold tracking-[-0.02em] text-ink">
        Masuk sebagai penyelenggara
      </h1>
      <p className="mt-2 font-body text-[15px] leading-[1.55] text-ink-soft">
        Kami kirim tautan masuk ke emailmu — tanpa kata sandi.
      </p>

      {status === "sent" ? (
        <div className="mt-7 rounded-md border border-border bg-surface px-5 py-6 text-center">
          <p className="font-display text-[18px] font-semibold text-ink">Cek emailmu</p>
          <p className="mt-2 font-body text-[14px] leading-[1.5] text-ink-soft">
            Tautan masuk sudah dikirim ke <span className="text-ink">{email}</span>. Buka
            di perangkat ini untuk melanjutkan.
          </p>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="mt-7 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-sm border border-border bg-surface font-body text-[16px] font-medium text-ink transition-colors hover:bg-base-sunken"
          >
            <GoogleG />
            Lanjut dengan Google
          </button>

          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              atau
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={send} className="flex flex-col gap-3">
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kamu@email.com"
            className="h-[52px] rounded-sm border border-border bg-surface px-4 font-body text-[16px] text-ink outline-none placeholder:text-muted focus:border-accent"
          />
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={status === "sending"}>
            {status === "sending" ? "Mengirim…" : "Kirim tautan masuk"}
          </Button>
            {status === "error" && (
              <p className="font-body text-[13px] text-accent">{error}</p>
            )}
          </form>
        </>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-base px-6 py-16">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
