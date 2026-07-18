# Phase B — Guest join → camera upload → shared album + reveal

> Turns the client-only demo into the real product. Built 2026-07-11 on
> `feat/phase-b-guest-album`. Decisions: **reveal = scheduled time + host
> "reveal now" override**; **photos in a public bucket** at event-scoped paths.

## What it does (guest flow)

1. Guest scans the QR / opens `/e/[slug]` → event is fetched by slug.
2. **Join** — enters a name → `join_event` RPC creates a `guests` row
   (anonymous device token in `localStorage`), enforcing `guest_limit`.
3. **Camera** — the existing `/demo` film camera, now wired to upload: each
   capture shows instantly (local data URL) and uploads in the background to the
   `event-photos` bucket, recorded via `add_photo` (enforces
   `photo_limit_per_guest`). A failed upload rolls the photo back.
4. **Own roll** — the guest sees only *their* photos, with a "sealed until
   reveal" hint. The shared album stays hidden.
5. **Reveal** — when the host reveals (Realtime) or the scheduled `reveal_at`
   passes (client timer), the flow swaps to the **SharedAlbum** for everyone at
   once: all guests' photos, filterable by contributor, updating live via
   Realtime.

## Host controls (dashboard → event)

- `RevealControls`: schedule an automatic reveal time, or **Ungkap sekarang**
  (reveal now). Shows sealed/revealed status + a preview/album link.
- `PhotoLimitControl` + `CreateEventForm`: the host sets **photos per guest** at
  creation (tier sets the default) and can change it anytime — takes effect
  immediately (`add_photo` reads it live).
- `EventPhotos`: host **moderation grid** — previews every photo regardless of
  reveal state (`get_host_event_photos`) and deletes any (`delete_event_photo`
  removes the row + full & thumb objects, freeing that guest's slot). Works
  before and after reveal.

## Architecture / security

- **Anonymous guests never touch tables directly.** All guest ops go through
  `SECURITY DEFINER` RPCs (`get_event_by_slug`, `join_event`, `add_photo`,
  `get_event_photos`) that enforce capacity + reveal rules atomically. Table RLS
  stays host-only (from Phase A).
- **Photos**: public `event-photos` bucket; upload policy allows anon inserts
  only into an *active, not-yet-revealed* event's folder (`{event_id}/…`).
  Served by public URL (unguessable paths).
- **`get_event_photos` returns nothing until the event is revealed** — the album
  is sealed at the data layer, not just the UI.
- **Realtime uses Broadcast, not `postgres_changes`.** Guests are anonymous and
  have no SELECT policy on `events`/`photos`, and `postgres_changes` is RLS-gated
  per subscriber — so it would deliver nothing to them. Instead: the host's
  "reveal now" broadcasts `reveal` on `event-{id}`, and each guest broadcasts
  `new-photo` on `album-{id}` after a successful upload. Broadcast on public
  channels is not RLS-gated, so it reaches anon devices. Helpers:
  `eventTopic`/`albumTopic` + `signalReveal`/`signalNewPhoto` in `lib/eventClient.ts`.
  (The `alter publication … add table` lines in `0002` are now unused but
  harmless.)
- **Scheduled reveal** is driven by a client timer in `EventFlow`; times more
  than ~24.8 days out (setTimeout's 32-bit limit) are skipped and instead resolve
  on reload / via `get_event_by_slug` computing `revealed` server-side.

## Key files

| Area | File |
|---|---|
| Migration | `supabase/migrations/0002_phase_b.sql` |
| Client helpers | `lib/eventClient.ts` (token, upload, RPCs) |
| Store | `components/event/useEventStore.ts` |
| Flow | `components/event/EventFlow.tsx` (+ `EventJoin`, `EventGallery`, `SharedAlbum`) |
| Guest page | `app/e/[slug]/page.tsx` |
| Host reveal | `components/host/RevealControls.tsx`, `app/dashboard/actions.ts` |

## Required setup (Supabase dashboard — do this before testing)

1. **Run the migrations in order** — in the SQL Editor:
   - `0002_phase_b.sql` — bucket, upload policy, RPCs, Realtime publication.
   - `0003_fix_upload_policy.sql` — fixes guest uploads being denied (the 0002
     upload policy's events subquery ran under anon RLS and always failed; 0003
     wraps it in a SECURITY DEFINER function).
   - `0004_host_moderation.sql` — host photo preview + delete RPCs
     (`get_host_event_photos`, `delete_event_photo`).
2. **Confirm Realtime is enabled** for the project — the guest flow uses public
   **Broadcast** channels for the reveal flip and new-photo pings (no table
   publication or RLS policy needed; the `0002` publication lines are unused).
3. That's it — the bucket is created by the migration (public).

## How to test the full loop

1. As host: `/dashboard` → create an event → open it.
2. Open the guest link `/e/[slug]` on a phone (or a second browser) → join →
   take a few photos. You see only your own roll, marked sealed.
3. Repeat as a different guest (different browser/incognito) to prove the
   per-guest roll + shared album.
4. Back in the dashboard event → **Ungkap sekarang** (or schedule a time a
   minute out). Every open guest view flips to the shared album live, showing
   everyone's photos.

> Note: the dev server can't render in the sandboxed CI here (Google Fonts is
> unreachable), so this flow must be exercised on a real machine. `npm run
> build` passes (type-check + prerender).

## Egress optimization — thumbnails (done)

Each capture now uploads a **~320px thumbnail** (`_thumb.jpg`) alongside the
full image (`makeThumb` in `lib/film.ts`, uploaded best-effort in `uploadPhoto`).
The album **grid** loads thumbnails; the **lightbox** and **save** use full-res.
This cuts album-view egress ~5–10× — the difference between staying on a cheap
Supabase plan and blowing the bandwidth cap on a single event. Grid `<img>` falls
back to full-res if a thumb is missing (older photos). See "Supabase plan" note
in `PRODUCT-READINESS.md`.

## Known limitations / follow-ups (priority order)

1. **[#1 pre-launch] Private bucket + signed URLs (PII).** Today the bucket is
   public: the album is sealed at the data layer (`get_event_photos`), but the
   image *files* are readable by anyone with the (unguessable) URL the moment
   they upload. For photos of real people this is the most important hardening
   before public launch. Contained change — flip the bucket, return signed URLs
   from the read path, adjust `SharedAlbum` + save. **Not yet done: needs real
   runtime testing (signed-URL expiry, fetch/CORS on save) that the CI sandbox
   can't do.**
2. **Orphaned storage objects.** `uploadPhoto` writes the file *before*
   `add_photo`; if the RPC rejects (limit / closed) the object lingers (anon has
   no DELETE policy). Now *two* objects per capture (full + thumb). Needs a
   `SECURITY DEFINER` cleanup RPC or a storage lifecycle rule.
3. **Retention/expiry** — photos never expire → storage + egress grow forever.
   Auto-delete albums after N days.
4. **Upload rate-limiting / moderation** — abuse vectors, unaddressed.

## Deferred to later phases

- **Phase C** — Midtrans checkout for paid tiers (capacity is already modeled).
- Album ZIP download, email "album is ready" (Resend), `?ref=` attribution — see
  `PRODUCT-READINESS.md`.
