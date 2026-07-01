-- Levend Graf — private "media" storage bucket + path-scoped RLS.
-- Object path convention: {legacyId}/<kind>/<file>  (e.g. abc.../voice/123.webm)
-- Access is derived from the first path segment (the legacy id).

insert into storage.buckets (id, name, public)
values ('media', 'media', false)
on conflict (id) do nothing;

drop policy if exists "media_read" on storage.objects;
create policy "media_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'media'
    and public.has_legacy_access(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists "media_insert" on storage.objects;
create policy "media_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and public.can_edit_legacy(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists "media_update" on storage.objects;
create policy "media_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'media'
    and public.can_edit_legacy(((storage.foldername(name))[1])::uuid)
  )
  with check (
    bucket_id = 'media'
    and public.can_edit_legacy(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists "media_delete" on storage.objects;
create policy "media_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'media'
    and public.can_edit_legacy(((storage.foldername(name))[1])::uuid)
  );
