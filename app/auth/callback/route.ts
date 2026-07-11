import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Magic-link landing. Supabase redirects here with a `code` after the user
 * clicks the email link; we exchange it for a session cookie, then forward to
 * the host dashboard (or the original `next` target).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
