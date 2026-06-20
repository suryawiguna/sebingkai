# AGENTS.md

Guidance for AI agents (and humans) working in this repo.

## What this is

**Sebingkai** — a marketing landing page for a fictional product: a "single-use
film camera" you share at an event via one QR code. Every guest gets a
browser-based film camera; all photos reveal together as one shared album after
the event. The page is in **Indonesian** (`lang="id"`) and uses a **"Dark Film"**
visual theme: pure-dark surfaces, near-white ink, and a single recording-red
accent (`#FF2D2D`) reserved for the shutter and primary CTAs.

This started as a static React + Babel single file and was rebuilt as a Next.js
app. The marketing CTA buttons ("Mulai gratis") are intentionally
non-functional placeholders — **except** the demo entry points, which lead to a
real, working, client-only product demo at **`/demo`** (see "Demo flow" below).
There is still no backend; the demo is entirely client-side.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first config via `@theme` in `app/globals.css` — there is **no `tailwind.config`**)
- **lucide-react** for all icons
- **qrcode** for the real (scannable) QR codes in the hero card and demo gate
- `next/font/google` (Fraunces / Inter / DM Mono) and `next/image` (Unsplash photos)
- No ESLint, no test suite (yet)

## Commands

```bash
npm run dev      # dev server (http://localhost:3000)
npm run build    # production build — MUST pass before committing; it runs tsc
npm run start    # serve the production build
```

There is no lint or test command. **The build (`npm run build`) is the gate** —
it type-checks and statically prerenders the page. Always run it after changes.

## Directory map

```
app/
  layout.tsx        Root layout: loads the 3 Google fonts, sets <html lang="id">, metadata
  page.tsx          Composes the sections in order (server component)
  globals.css       Tailwind import + @theme design tokens + base/reveal CSS
  demo/
    layout.tsx      Demo wrapper: noindex metadata + viewport (viewportFit: cover)
    page.tsx        Renders <DemoFlow/>
components/
  ds/               Design-system primitives (ported from the original Sebingkai DS)
    Logo.tsx        Wordmark + recording-red dot mark
    Avatar.tsx      Round image / initials chip
    Button.tsx      variants: primary | secondary | ghost | soft; sizes: sm | md | lg
    PhoneFrame.tsx  Pure-CSS iPhone mockup (see "Phone scaling" below)
  ui.tsx            Shell (max-width container) + Eyebrow (mono uppercase label)
  FilmImg.tsx       next/image wrapper with the .film filter; fills its parent
  QrCode.tsx        Client: renders a real scannable QR to <canvas> via qrcode
  HeroQrCard.tsx    Client: hero "Coba sekarang" scan card (encodes origin + /demo)
  Reveal.tsx        Client: IntersectionObserver scroll-reveal wrapper
  RollCard.tsx      Floating "album" card with contributor avatars
  ClockText.tsx     Client: live countdown timecode for the camera screen
  screens.tsx       The 6 phone-screen MOCKUPS (Album, Join, Camera, Naming, QR, Reveal)
  demo/             The REAL working demo (all client components) — see "Demo flow"
    DemoFlow.tsx        Orchestrator: device gate + join→camera→gallery state machine
    DemoJoin.tsx        Interactive guest welcome / name entry
    DemoCamera.tsx      getUserMedia viewfinder + native <input capture> fallback
    DemoGallery.tsx     Filterable 3-col photo grid; tiles open the viewer
    PhotoViewer.tsx     Full-screen photo view + thumbnail-strip navigation
    DesktopGate.tsx     "Buka di ponselmu" screen (with QR) for non-phones
    useDeviceGate.ts    matchMedia hook: portrait-phone detection
    useDemoStore.ts     localStorage-backed {guestName, photos[]}; PHOTO_LIMIT = 6
  Header.tsx        Client: sticky nav + mobile menu
  Hero.tsx          Hero + floating roll cards + QR card (desk) / "Coba demo" link (mobile)
  StatRow.tsx       Editorial stats band
  KameraTamu.tsx    "Guest camera" feature section
  CaraKerja.tsx     "How it works" 3-step section
  Showcase.tsx      Client: tabbed event-category showcase
  Pricing.tsx       Client: selectable pricing tiers (with discount badges)
  Faq.tsx           Client: accordion
  Closing.tsx       Closing CTA (filmstrip) + footer
lib/
  images.ts         UNSPLASH id map + ev(key, w) URL helper
  film.ts           captureFilmFrame() / fileToImage() — bake the .film look into captures
next.config.ts      images.remotePatterns allows images.unsplash.com
```

Section render order lives in `app/page.tsx`: Header → Hero → StatRow →
KameraTamu → CaraKerja → Showcase → Pricing → Faq → ClosingCta.

## Demo flow (`/demo`)

A real, **client-only** end-to-end demo so visitors can try the product. **No
backend** — state lives in React + `localStorage` (`useDemoStore`), single device.

- **Mockups vs. demo:** `components/screens.tsx` holds the static marketing
  mockups rendered inside `PhoneFrame`. `components/demo/*` holds the *actual
  interactive* screens — they share the visual language but are separate code.
  Don't confuse the two; changing a mockup does not change the demo (and vice versa).
- **Entry points** (in `Hero.tsx`): a real QR card on desktop (`HeroQrCard`,
  encodes `${window.location.origin}/demo`) and a "Coba demo" link on mobile.
- **Phone-only:** `useDeviceGate` (matchMedia: `pointer:coarse` + `max-width:640px`
  + portrait) gates the flow. Anything else gets `DesktopGate` ("open on your
  phone" + the same scannable QR). The gate returns `"checking"` until mounted to
  avoid a hydration flash — keep that SSR-safe pattern for any new client gates.
- **Flow:** `DemoFlow` is the state machine `join → camera → gallery`.
  - `DemoCamera`: live `getUserMedia({ facingMode: 'environment' })` viewfinder;
    on failure/denied/unsupported it **auto-falls back** to a native
    `<input type="file" capture>`. Shutter is **white** (it shoots photos, not
    video — do not use the red accent here). The thumbnail beside the shutter is
    the stacked latest-shot preview.
  - Captures run through `lib/film.ts` `captureFilmFrame()` — draws to a canvas
    with the `.film` filter baked in (`contrast(1.08) saturate(0.85)
    brightness(0.98)`), downscales, returns a JPEG data URL.
  - `DemoGallery`: 3-col grid; tiles open `PhotoViewer` (full image + thumbnail
    strip). Contributor filter tabs are wired but resolve to the same set (one
    visitor in the demo).
- **Limit:** `PHOTO_LIMIT` in `useDemoStore.ts` (currently **6**) is the single
  source of truth — counters and copy derive from it; don't hardcode the number.
- **Captured photos use a plain `<img>`** (they're client data URLs), not
  `FilmImg`/`next/image`. The `.film` look is already baked in at capture time, so
  don't re-apply the `.film` class to them.

## Conventions

### Styling
- **Tailwind utility classes only**, using the design tokens. Prefer token
  utilities (`bg-base`, `text-ink`, `text-muted`, `bg-accent`, `border-border`,
  `font-display`, `rounded-lg`, `shadow-float`) over raw values.
- Use **arbitrary values** for the many exact pixel sizes the design needs:
  `text-[15.5px]`, `gap-[13px]`, `tracking-[-0.025em]`, `bg-white/[0.66]`.
- Inline `style={{}}` is used only for **computed/derived values** (e.g.
  PhoneFrame's `calc()` math, animation delays, the corner overlays in
  ScreenCamera). Don't reach for inline styles when a class works.

### Design tokens (defined in `app/globals.css` `@theme`)
- Colors: `base`, `surface`, `surface-2`, `phone` (#000), `accent` (red),
  `accent-soft/-press/-hover/-glow`, `ink`, `ink-soft`, `muted`, `border`,
  `base-sunken`, `on-soft`.
- Fonts: `display` (Fraunces, serif headings — note the italic variants used via
  `className="italic"`), `body` (Inter), `mono` (DM Mono, for timecodes/labels).
- Radius: `sm/md/lg/phone/pill`. Shadows: `soft/card/float/rec`.
- **Accent discipline:** recording-red appears ONLY on the shutter/record dot,
  primary buttons, discount badges, and key conversion spots. Keep it rare.

### Responsive — CSS only, no JS breakpoint hooks
Custom breakpoints are defined in `@theme`: **`tab` = 640px**, **`desk` = 920px**
(these match the original `BP` map). Use the `tab:` and `desk:` variants. The
original code branched on a `useVw()` hook; do **not** reintroduce that — use
responsive classes.

### Phone scaling (`PhoneFrame`)
`PhoneFrame` derives every dimension from a single `--pw` (phone width) CSS
custom property via `calc(... * n / 320)` (the design's reference width is 320px).
Set the width — responsively — with arbitrary-property classes on the frame:

```tsx
<PhoneFrame className="[--pw:264px] desk:[--pw:290px]">
  <ScreenCamera />
</PhoneFrame>
```

This is how phones resize across breakpoints without any JavaScript.

### Server vs client components
Default to **server components**. Add `"use client"` only for genuine
interactivity/effects. Current client components: `Header` (menu toggle),
`Showcase` (tabs), `Pricing` (tier selection), `Faq` (accordion),
`Reveal` (IntersectionObserver), `ClockText` (interval), and **everything under
`components/demo/` plus `QrCode`/`HeroQrCard`** (camera, storage, matchMedia).
Everything else, including all six phone-screen mockups in `screens.tsx`, is a
server component.

### Icons
Use **lucide-react** for all iconography (e.g. `Check`, `Plus`/`Minus`,
`Menu`/`X`, `Camera`, `ArrowRight`, `Share2`). Don't hand-roll SVG icons. The
shutter/record circles in the phone screens are styled `div`s, not icons —
that's intentional.

### Images
Photos go through `FilmImg` (which uses `next/image fill` + the `.film` filter);
its parent must be `relative` and have a defined size (via `aspect-*`, flex, or
`min-h-*`). New external image hosts must be added to `next.config.ts`
`images.remotePatterns`. The faint closing-section filmstrip is the one
deliberate exception that uses a plain `<img>`.

### Copy
All user-facing text is **Indonesian**. Match the existing tone (e.g. "Mulai
gratis", "Buat album", "Langkah 01"). Currency is Indonesian rupiah written like
`Rp99rb` (rb = ribu / thousand).

## Gotchas

- **No `tailwind.config.js`** — Tailwind v4 is configured entirely in
  `app/globals.css`. Add tokens/breakpoints there, inside `@theme`.
- **Button cursor:** Tailwind v4 Preflight does not set a pointer cursor on
  buttons. A global rule in `globals.css` restores it
  (`button:not(:disabled) { cursor: pointer }`); keep it.
- **React text-node markers:** SSR output splits `-{x}%` into
  `-<!-- -->50<!-- -->%`. The rendered text is still `-50%`; grepping the raw
  HTML for `-50%` will miss. Don't be fooled.
- **Camera needs a secure context:** `getUserMedia` only works on `localhost` or
  HTTPS. Scanning the dev QR from a phone over the LAN is **not** a secure origin,
  so the demo silently uses the native-picker fallback there; the in-browser
  viewfinder works fully only on `localhost` or a deployed HTTPS URL.
- The previous static implementation was removed; its history is in git if you
  need to reference the original inline-styled version.

## Git

- Default branch: `main`. The remote uses an SSH host alias:
  `git@github.com-personal:suryawiguna/sebingkai.git` (the plain `github.com`
  key maps to a different GitHub account on this machine).
- Commit messages end with the `Co-Authored-By` trailer used in this repo's
  history. Commit/push only when asked.
