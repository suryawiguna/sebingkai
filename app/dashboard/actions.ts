"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Tier → capacity. Mirrors the marketing Pricing tiers. */
const TIERS: Record<string, { guest_limit: number; photo_limit_per_guest: number }> = {
  coba: { guest_limit: 5, photo_limit_per_guest: 6 },
  kecil: { guest_limit: 30, photo_limit_per_guest: 6 },
  standar: { guest_limit: 100, photo_limit_per_guest: 8 },
  besar: { guest_limit: 100_000, photo_limit_per_guest: 10 }, // "unlimited"
};

/** Short, url-safe, ambiguity-free join code (no 0/1/o/l). */
function makeSlug(len = 7) {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const tier = String(formData.get("tier") ?? "coba");
  if (!name) redirect("/dashboard?error=name");

  const t = TIERS[tier] ?? TIERS.coba;

  const { data, error } = await supabase
    .from("events")
    .insert({
      host_id: user.id,
      name,
      slug: makeSlug(),
      tier,
      guest_limit: t.guest_limit,
      photo_limit_per_guest: t.photo_limit_per_guest,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  redirect(`/dashboard/events/${data.id}`);
}

/** Reveal the album now (host override). RLS scopes the update to the owner. */
export async function revealEvent(eventId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .update({ status: "revealed" })
    .eq("id", eventId);
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/events/${eventId}`);
}

/** Schedule (or clear) the automatic reveal time. `iso` is a UTC ISO string. */
export async function setRevealAt(eventId: string, iso: string | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .update({ reveal_at: iso })
    .eq("id", eventId);
  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/events/${eventId}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
