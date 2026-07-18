# Sebingkai — Product Readiness & Feature Roadmap

> Living document. Track what exists today, and plan what's next.
> Last reviewed: **2026-07-11** (branch `feat/film-presets`)

---

## TL;DR — Are we ready to go live for mass users?

**No — not as a real product yet.** What exists today is an excellent, polished
**marketing landing page** plus a **client-only tech demo**. There is **no
backend of any kind**: no login, no database, no photo uploads to a server, and
no working payment. Every "product" action (buy a plan, create an event, share
an album across guests) is either a visual placeholder or runs entirely in the
visitor's browser and disappears on reload.

We can absolutely launch the **marketing site** to mass traffic today (it's
static, fast, SEO-ready). But the **actual product** — the shared-album event
service the site advertises — does not exist as a live service.

| Capability | Status | Notes |
|---|---|---|
| Marketing landing page | ✅ Ready | Fast, responsive, SEO + OG, Indonesian |
| SEO landing pages / FAQ / sitemap | ✅ Ready | `lib/landings.ts`, `/faq`, `sitemap.ts`, `robots.ts` |
| Product demo (`/demo`) | ✅ Works, client-only | In-memory, single device, wiped on reload |
| User login / accounts | ✅ Shipped (Phase A) | Host magic-link + Google (Supabase Auth) |
| Saving user data | ✅ Shipped (Phase A) | Supabase Postgres: events/guests/photos/orders |
| Photo upload / shared album | ✅ Shipped (Phase B) | Supabase Storage + shared album + reveal |
| Cross-guest album (the core promise) | ✅ Shipped (Phase B) | Real join → upload → reveal; see `PHASE-B.md` |
| Payment flow | ❌ Missing (Phase C) | Pricing visual; Midtrans checkout not built |
| Private photo storage (PII) | ⚠️ Public bucket | #1 pre-launch hardening — see `PHASE-B.md` |
| Supabase plan for launch | ⚠️ Free OK for now | Pro (~$25/mo) at launch — see "Supabase plan" below |

> **Status (2026-07-11):** Phase A (auth + host events) merged to `main`. Phase B
> (guest capture → shared album + reveal) built; see `PHASE-B.md`. The
> "Complete user workflow" section below is the **original pre-Phase-A
> assessment**, kept for history — the four "No" answers are now "Yes" per the
> table above.

---

## Complete user workflow — technical readiness

> ⚠️ **Historical (pre-Phase-A).** Superseded by the table above and `PHASE-B.md`.
> Kept to show the starting point. Below describes the app *before* the backend.

### 1. Can a user log in?
**No.** There is no authentication anywhere — no login page, no session, no
auth provider, no `route.ts`, no `process.env` secrets beyond a public site URL.
Marketing CTAs ("Mulai gratis") are intentional non-functional placeholders
(per `AGENTS.md`). The host of an event cannot create or own anything.

### 2. Do we save the user's data?
**No.** There is no database, ORM, or API layer.
- `components/demo/useDemoStore.ts` holds `{ guestName, photos[] }` in React
  `useState` — **in-memory only, intentionally not persisted**. Reloading the
  page clears everything.
- No events table, no guest records, no host accounts, no email capture.
- The `?ref=gallery` referral param is emitted by the demo CTA but **captured
  nowhere** (see deferred Task 5 in project history).

### 3. How do we save photos uploaded by the user?
**We don't upload them at all.** The flow is fully local:
- `components/demo/DemoCamera.tsx` captures via `getUserMedia` (live viewfinder)
  or the native `<input capture>` picker as a fallback.
- `lib/film.ts` bakes the film look into the frame → a JPEG **data URL**.
- The data URL is stored in memory (`useDemoStore`, capped at `PHOTO_LIMIT = 6`).
- `lib/save.ts#savePhotos()` lets the user push photos to their **own device**
  via the Web Share API (or a direct download fallback).

There is **no object storage** (S3/R2/Cloudinary), no server upload, no
processing pipeline, and — critically — **no shared album**: two guests scanning
the same QR each get an isolated, private in-browser roll. The product's central
promise ("all photos reveal together as one shared album") is **not implemented**.

### 4. How does the payment flow work?
**It doesn't.** `components/Pricing.tsx` renders four selectable tiers (Coba
Rp0, Kecil Rp49rb, Standar Rp149rb, Besar Rp599rb) with discount badges, but the
"Pilih paket" button has **no click handler and no payment integration** — no
Midtrans/Xendit/Stripe, no checkout, no order record, no receipt. It's a visual
mockup of pricing only.

---

## Features we already have (shipped)

### Marketing site
- **Landing page** (`app/page.tsx`) — Header → Hero → StatRow → KameraTamu →
  CaraKerja → Showcase → Pricing → FAQ → Closing CTA.
- **"Dark Film" design system** (`components/ds/`) — Logo, Avatar, Button,
  PhoneFrame; tokens via Tailwind v4 `@theme`.
- **Real scannable QR codes** in the hero and demo gate (`qrcode`).
- **Phone-screen mockups** (`components/screens.tsx`) — Album, Join, Camera,
  Naming, QR, Reveal.
- **Interactive pricing** with selectable tiers + discount badges (visual only).
- **Tabbed showcase**, editorial stats band, animated scroll reveals.

### SEO / content
- **Metadata + OpenGraph** — dynamic 1200×630 branded OG card (`next/og`).
- **Keyword landing pages** — SSG, one per target keyword (`lib/landings.ts`).
- **Standalone FAQ page** (`/faq`) with `FAQPage` JSON-LD.
- **`sitemap.ts` + `robots.ts`** — indexes marketing pages, excludes `/demo`.

### Product demo (`/demo`) — client-only, works end to end on one device
- **Device gate** — phone-portrait detection; desktop sees a "open on your
  phone" QR screen (`DesktopGate` + `useDeviceGate`).
- **Join** → name entry (`DemoJoin`).
- **Film camera** — live `getUserMedia` viewfinder with native-picker fallback,
  in-viewfinder film-preset picker (`DemoCamera` + `lib/film.ts`).
- **Selectable film presets** (latest feature, branch `feat/film-presets`).
- **Gallery** — filterable 3-col grid → swipeable lightbox; watermark + a
  "make your own event" CTA (`DemoGallery`).
- **Save to device** — Web Share API with download fallback (`lib/save.ts`).
- Roll cap of 6 photos per session.

---

## What's missing to become a real, mass-ready product

These are the load-bearing gaps between the demo and the advertised product.

### Must-have (the product literally doesn't work without these)
- [ ] **Backend + database** — events, hosts, guests, photos, orders
      (e.g. Neon/Postgres + an ORM, or Supabase).
- [ ] **Auth** — at minimum host accounts (create/own an event); guests can stay
      anonymous-with-a-name.
- [ ] **Real event creation** — a host makes an event → gets a unique QR/link.
- [ ] **Photo upload + object storage** — guests' captures go to S3/R2/Cloudinary,
      keyed by event.
- [ ] **The shared album** — all guests of one event write to one roll; a
      timed/host-triggered "reveal" shows everyone's photos together. *This is
      the core value prop and is entirely absent today.*
- [ ] **Payment integration** — Indonesian gateway (Midtrans/Xendit), checkout,
      order/receipt records, plan → capacity enforcement (guest limits per tier).

### Should-have (needed for real launch quality)
- [ ] Email (Resend) — host confirmations, "album is ready" notifications.
- [ ] Capture `?ref=gallery` referral → `referred_by_event_id`.
- [ ] Rate limiting / abuse protection on uploads.
- [ ] Content moderation path for public/shared galleries.
- [ ] Privacy policy, terms, data-retention & deletion (photos of people = PII).
- [ ] Analytics + error monitoring (e.g. Sentry).
- [ ] Album expiry / storage lifecycle (cost control).

### Nice-to-have (future)
- [ ] Host dashboard (manage events, download full album as ZIP).
- [ ] More film presets / custom presets per event.
- [ ] Video / boomerang capture.
- [ ] Guest reactions / comments on the shared album.
- [ ] Native app wrappers.

---

## Future feature plan — write new ideas below

> Add proposals here. Suggested format per item:
> **Feature** — problem it solves · rough scope · priority (P0/P1/P2) · status.

| Feature | Problem it solves | Scope | Priority | Status |
|---|---|---|---|---|
| _(example)_ Host dashboard | Hosts can't manage events | Auth + events UI | P1 | Idea |
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

### Open questions / decisions to make
- ~~Which stack for the backend?~~ → **Decided: Supabase** (see below).
- ~~Which payment gateway?~~ → **Decided: Midtrans (Snap)** (see below).
- Where do photos live, and for how long? (storage cost vs. album longevity)
- Guest identity: fully anonymous, or lightweight verification to curb abuse?

---

## Recommended architecture (decided 2026-07-11)

### Stack: **Supabase** (DB + Auth + Storage + Realtime, one platform)
Chosen because it collapses everything a solo dev needs into one service:
- **Postgres** — event/guest/photo/order data is relational; SQL fits (Firebase's
  NoSQL would fight this, especially payment records).
- **Auth** — host accounts (Google OAuth / email OTP); guests stay anonymous.
- **Storage** — S3-compatible object storage for uploaded photos; signed-URL
  direct-from-browser uploads + image transforms.
- **Realtime** — powers the core "reveal together / live album" promise with
  almost no custom infra. *This is the deciding factor.*

_Alternative considered:_ Neon + Drizzle + Auth.js + R2 + custom realtime — more
control/portability but 4+ services to assemble and operate. Overkill for the MVP.
Supabase is standard Postgres, so migrating off later stays possible.

### Payment: **Midtrans (Snap)**
- Indonesian buyers at Rp49rb–Rp599rb pay via **QRIS / GoPay / ShopeePay / bank
  VA**, not cards → **Stripe is the wrong tool** for this market.
- **Snap** = hosted checkout popup → minimal PCI burden, fastest integration,
  most consumer-recognized brand.
- _Alternative:_ Xendit (better raw DX) — equally valid.
- ⚠️ **Prerequisite:** production access needs a registered Indonesian business
  entity (PT/verification). Build & test everything in **Midtrans Sandbox** first;
  going live is gated on this — start the paperwork early.

### Target workflow
```
HOST:  sign up (Supabase Auth) → create event → [pay via Midtrans Snap if paid]
       → webhook confirms → event activated with tier limits → get QR + link
GUEST: scan QR → /e/[id] join → enter name (anonymous guest token)
       → film camera → capture → upload JPEG to Supabase Storage → insert photo row
       → photos hidden until REVEAL (host-triggered or scheduled)
       → gallery shows everyone's photos; Realtime pushes live updates
```

### Data model (with Row Level Security)
- `events` — id, host_id, name, tier, guest_limit, photo_limit_per_guest,
  status, reveal_at, referred_by_event_id, created_at
- `guests` — id, event_id, name, token, created_at
- `photos` — id, event_id, guest_id, storage_path, created_at
- `orders` — id, event_id, host_id, midtrans_order_id, amount, status, paid_at

RLS: guests write photos only to their own event; album not readable before reveal.

### Implementation phases (MVP-first)
- **Phase A — Foundation:** Supabase project, schema + RLS, host auth, host
  creates a *free* event and gets a real QR/link. (No payment yet.)
- **Phase B — Core loop:** guest join page; re-point the existing `/demo` camera
  + film pipeline at Supabase Storage; shared album + reveal + Realtime.
  *This is where the demo becomes a real product.*
- **Phase C — Payments:** Midtrans Snap checkout → webhook activates event →
  enforce tier capacity (5 / 30 / 100 / unlimited guests, matching Pricing).
- **Phase D — Launch-ready:** Resend emails, capture `?ref=gallery` referral,
  upload rate-limits + size caps, privacy policy + data retention (photos of
  people = PII), Sentry monitoring.

> Reuse note: `/demo` already has the camera, film pipeline (`lib/film.ts`),
> gallery, and lightbox. Phase B is largely re-pointing that in-memory flow at
> Supabase — not rebuilding UI.

---

## Supabase plan for launch

**Free is fine for building/testing now; move to Pro (~$25/mo) at launch.**

Binding free-tier limits for this app, in order:
1. **Egress 5 GB/mo** — album *views* download photos; one event viewed by ~100
   guests can exceed this. **Mitigated** by thumbnails in the grid (Phase B) —
   full-res only in the lightbox — cutting view egress ~5–10×.
2. **Auto-pause after 7 days inactivity** — disqualifies Free for a live product.
3. **Storage 1 GB** — ~5–10 real events; photos never expire (add retention).

Not a concern: Auth MAU (only hosts log in; guests are anonymous), DB size
(metadata only). **Pro** gives 100 GB storage, 250 GB egress, no auto-pause,
daily backups. Storage vendor stays Supabase (it's S3 + CDN under the hood) —
no reason to move to raw AWS S3 at this scale.
