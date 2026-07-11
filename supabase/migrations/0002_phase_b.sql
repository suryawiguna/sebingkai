-- Sebingkai — Phase B: guest join, photo upload, shared album + reveal
-- Run in Supabase → SQL Editor after 0001_init.sql.
--
-- Design: anonymous guests never touch tables directly. All guest operations
-- go through SECURITY DEFINER functions that enforce capacity + reveal rules
-- atomically, so the table RLS from 0001 (host-only) stays locked down.
-- Photos live in a PUBLIC storage bucket at event-scoped paths; the upload
-- policy is the one place anon writes to storage.

-- ── guests: one row per (event, device-token); rejoining upserts ───────────
create unique index if not exists guests_event_token_key
  on public.guests(event_id, token);

-- ── Storage bucket (public) ────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', true)
on conflict (id) do nothing;

-- Anonymous guests may upload into an event's folder only while that event is
-- still 'active' and not yet revealed. Path convention: {event_id}/{...}.jpg
create policy "guests upload to open events"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'event-photos'
    and exists (
      select 1 from public.events e
      where e.id::text = (storage.foldername(name))[1]
        and e.status = 'active'
        and (e.reveal_at is null or e.reveal_at > now())
    )
  );
-- Public bucket ⇒ objects are readable via their public URL; no SELECT policy needed.

-- ── Helper: is an event revealed right now? ────────────────────────────────
create or replace function public.is_event_revealed(e public.events)
returns boolean language sql stable as $$
  select e.status = 'revealed' or (e.reveal_at is not null and e.reveal_at <= now());
$$;

-- ── Public read: fetch one event by slug (safe columns only) ───────────────
create or replace function public.get_event_by_slug(p_slug text)
returns table (
  id uuid, slug text, name text, tier text,
  guest_limit int, photo_limit_per_guest int,
  status text, reveal_at timestamptz, revealed boolean
)
language sql stable security definer set search_path = public as $$
  select e.id, e.slug, e.name, e.tier, e.guest_limit, e.photo_limit_per_guest,
         e.status, e.reveal_at, public.is_event_revealed(e)
  from public.events e
  where e.slug = p_slug;
$$;

-- ── Guest joins an event (enforces guest_limit; idempotent per token) ──────
create or replace function public.join_event(p_event_id uuid, p_name text, p_token text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_event public.events;
  v_guest_id uuid;
  v_count int;
begin
  select * into v_event from public.events where id = p_event_id;
  if v_event is null then raise exception 'event not found'; end if;
  if public.is_event_revealed(v_event) or v_event.status <> 'active' then
    raise exception 'event is closed';
  end if;

  -- Rejoin from the same device reuses the existing guest.
  select id into v_guest_id from public.guests
    where event_id = p_event_id and token = p_token;
  if v_guest_id is not null then
    update public.guests set name = coalesce(nullif(trim(p_name), ''), name)
      where id = v_guest_id;
    return v_guest_id;
  end if;

  select count(*) into v_count from public.guests where event_id = p_event_id;
  if v_count >= v_event.guest_limit then
    raise exception 'guest limit reached';
  end if;

  insert into public.guests (event_id, name, token)
    values (p_event_id, nullif(trim(p_name), ''), p_token)
    returning id into v_guest_id;
  return v_guest_id;
end;
$$;

-- ── Guest records an uploaded photo (enforces photo_limit_per_guest) ───────
create or replace function public.add_photo(
  p_event_id uuid, p_guest_id uuid, p_token text, p_storage_path text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_event public.events;
  v_count int;
  v_photo_id uuid;
begin
  select * into v_event from public.events where id = p_event_id;
  if v_event is null then raise exception 'event not found'; end if;
  if public.is_event_revealed(v_event) or v_event.status <> 'active' then
    raise exception 'event is closed';
  end if;

  -- The guest_id must belong to this event AND match the caller's token.
  if not exists (
    select 1 from public.guests
    where id = p_guest_id and event_id = p_event_id and token = p_token
  ) then
    raise exception 'invalid guest';
  end if;

  select count(*) into v_count from public.photos
    where event_id = p_event_id and guest_id = p_guest_id;
  if v_count >= v_event.photo_limit_per_guest then
    raise exception 'photo limit reached';
  end if;

  insert into public.photos (event_id, guest_id, storage_path)
    values (p_event_id, p_guest_id, p_storage_path)
    returning id into v_photo_id;
  return v_photo_id;
end;
$$;

-- ── Public read: the shared album — only when the event is revealed ────────
create or replace function public.get_event_photos(p_event_id uuid)
returns table (id uuid, storage_path text, guest_name text, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
declare v_event public.events;
begin
  select * into v_event from public.events where id = p_event_id;
  if v_event is null or not public.is_event_revealed(v_event) then
    return; -- sealed: return no rows until reveal
  end if;
  return query
    select p.id, p.storage_path, g.name, p.created_at
    from public.photos p
    join public.guests g on g.id = p.guest_id
    where p.event_id = p_event_id
    order by p.created_at asc;
end;
$$;

-- ── Grants: expose only the RPCs to anonymous/auth clients ─────────────────
grant execute on function public.get_event_by_slug(text)               to anon, authenticated;
grant execute on function public.join_event(uuid, text, text)          to anon, authenticated;
grant execute on function public.add_photo(uuid, uuid, text, text)     to anon, authenticated;
grant execute on function public.get_event_photos(uuid)                to anon, authenticated;

-- ── Realtime: let the album/waiting view subscribe to reveal + new photos ──
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.photos;
