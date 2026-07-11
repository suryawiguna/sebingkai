-- Sebingkai — Phase A foundation schema
-- Run in Supabase → SQL Editor (or `supabase db push`).
-- Tables: events, guests, photos, orders. RLS on all.
-- Phase A activates HOST policies (a host owns their events). Guest/public
-- policies for the join + album flow are added in Phase B (see block at bottom).

-- ── events ───────────────────────────────────────────────────────────────
create table if not exists public.events (
  id                    uuid primary key default gen_random_uuid(),
  host_id               uuid not null references auth.users(id) on delete cascade,
  name                  text not null,
  slug                  text not null unique,               -- short public code for the QR/link
  tier                  text not null default 'coba',       -- coba | kecil | standar | besar
  guest_limit           int  not null default 5,
  photo_limit_per_guest int  not null default 6,
  status                text not null default 'active',     -- draft | active | revealed | closed
  reveal_at             timestamptz,
  referred_by_event_id  uuid references public.events(id) on delete set null,
  created_at            timestamptz not null default now()
);
create index if not exists events_host_id_idx on public.events(host_id);

-- ── guests ───────────────────────────────────────────────────────────────
create table if not exists public.guests (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events(id) on delete cascade,
  name       text not null,
  token      text not null,                                 -- anonymous guest identity (cookie)
  created_at timestamptz not null default now()
);
create index if not exists guests_event_id_idx on public.guests(event_id);

-- ── photos ───────────────────────────────────────────────────────────────
create table if not exists public.photos (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references public.events(id) on delete cascade,
  guest_id     uuid not null references public.guests(id) on delete cascade,
  storage_path text not null,
  created_at   timestamptz not null default now()
);
create index if not exists photos_event_id_idx on public.photos(event_id);

-- ── orders (payments land in Phase C; table exists now to avoid migration) ─
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  event_id          uuid not null references public.events(id) on delete cascade,
  host_id           uuid not null references auth.users(id) on delete cascade,
  midtrans_order_id text unique,
  amount            int  not null,
  status            text not null default 'pending',        -- pending | paid | failed | expired
  paid_at           timestamptz,
  created_at        timestamptz not null default now()
);
create index if not exists orders_event_id_idx on public.orders(event_id);

-- ── Row Level Security ─────────────────────────────────────────────────────
alter table public.events  enable row level security;
alter table public.guests  enable row level security;
alter table public.photos  enable row level security;
alter table public.orders  enable row level security;

-- Host owns their events (full CRUD, scoped to auth.uid()).
create policy "host reads own events"   on public.events for select using  (host_id = (select auth.uid()));
create policy "host creates own events" on public.events for insert with check (host_id = (select auth.uid()));
create policy "host updates own events" on public.events for update using  (host_id = (select auth.uid()));
create policy "host deletes own events" on public.events for delete using  (host_id = (select auth.uid()));

-- Host reads guests/photos belonging to their own events (for the dashboard).
create policy "host reads own event guests" on public.guests for select
  using (exists (select 1 from public.events e where e.id = guests.event_id and e.host_id = (select auth.uid())));
create policy "host reads own event photos" on public.photos for select
  using (exists (select 1 from public.events e where e.id = photos.event_id and e.host_id = (select auth.uid())));

-- Host reads their own orders.
create policy "host reads own orders" on public.orders for select using (host_id = (select auth.uid()));

-- ── Phase B (deferred) — to enable the public guest/join/album flow, add: ──
--   • public SELECT on events (by slug, active) — likely via a security-definer
--     RPC or a restricted view so host_id etc. aren't exposed wholesale
--   • anon INSERT on guests (event must exist & be active; within guest_limit)
--   • guest INSERT on photos (own guest_id; within photo_limit_per_guest)
--   • album SELECT on photos gated on event.status = 'revealed'
--   • a Storage bucket + policies for the uploaded JPEGs
