-- Sebingkai — Phase B host moderation
-- Run in Supabase → SQL Editor after 0003.
--
-- Lets a host (1) preview their event's photos regardless of reveal state, and
-- (2) delete individual photos (row + full & thumb storage objects). Both are
-- SECURITY DEFINER + scoped to auth.uid() = the event's host. Deleting a photo
-- row naturally frees that guest's slot (add_photo counts rows).

-- ── Host preview: all photos for an owned event, ignoring reveal state ──────
create or replace function public.get_host_event_photos(p_event_id uuid)
returns table (id uuid, storage_path text, guest_name text, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (
    select 1 from public.events e
    where e.id = p_event_id and e.host_id = auth.uid()
  ) then
    raise exception 'not authorized';
  end if;

  return query
    select p.id, p.storage_path, g.name, p.created_at
    from public.photos p
    join public.guests g on g.id = p.guest_id
    where p.event_id = p_event_id
    order by p.created_at asc;
end;
$$;

-- ── Host delete: remove a photo (row + full + thumbnail objects) ────────────
create or replace function public.delete_event_photo(p_photo_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_event_id uuid;
  v_path text;
begin
  select event_id, storage_path into v_event_id, v_path
    from public.photos where id = p_photo_id;
  if v_event_id is null then raise exception 'photo not found'; end if;

  if not exists (
    select 1 from public.events e
    where e.id = v_event_id and e.host_id = auth.uid()
  ) then
    raise exception 'not authorized';
  end if;

  -- Remove the stored objects (full + derived thumbnail), then the row.
  delete from storage.objects
    where bucket_id = 'event-photos'
      and name in (v_path, regexp_replace(v_path, '\.jpg$', '_thumb.jpg'));

  delete from public.photos where id = p_photo_id;
end;
$$;

grant execute on function public.get_host_event_photos(uuid) to authenticated;
grant execute on function public.delete_event_photo(uuid)     to authenticated;
