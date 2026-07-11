-- Phase B fix — guest photo uploads were denied.
--
-- The storage upload policy from 0002 checked the event with a subquery on
-- public.events. RLS policy expressions run under the CURRENT role, so for an
-- anonymous guest that subquery was subject to events' RLS (host-only, no anon
-- SELECT) and always returned zero rows → WITH CHECK was always false → every
-- upload was rejected. (join_event etc. worked because they are SECURITY
-- DEFINER and bypass RLS.)
--
-- Fix: move the check into a SECURITY DEFINER function so it can read events
-- regardless of the caller, keeping events non-enumerable for anon.

create or replace function public.event_accepts_uploads(p_event_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.events e
    where e.id = p_event_id
      and e.status = 'active'
      and (e.reveal_at is null or e.reveal_at > now())
  );
$$;

grant execute on function public.event_accepts_uploads(uuid) to anon, authenticated;

drop policy if exists "guests upload to open events" on storage.objects;

create policy "guests upload to open events"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'event-photos'
    and public.event_accepts_uploads(((storage.foldername(name))[1])::uuid)
  );
