"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ds/Button";
import { Logo } from "@/components/ds/Logo";

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

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
        <form onSubmit={send} className="mt-7 flex flex-col gap-3">
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
