-- Ouverture des droits pour l'interface admin (utilise l'anon key)
-- ⚠️ À resserrer dès que l'auth admin est prête

-- Table vehicles : RLS permissive
alter table public.vehicles enable row level security;

drop policy if exists "public read published" on public.vehicles;
drop policy if exists "public read all" on public.vehicles;
drop policy if exists "anon_select" on public.vehicles;
drop policy if exists "anon_insert" on public.vehicles;
drop policy if exists "anon_update" on public.vehicles;
drop policy if exists "anon_delete" on public.vehicles;
drop policy if exists "auth_write" on public.vehicles;
drop policy if exists "write_anon" on public.vehicles;
drop policy if exists "open write dev" on public.vehicles;
drop policy if exists "owner_update_vehicle" on public.vehicles;
drop policy if exists "owner_delete_vehicle" on public.vehicles;

create policy "anon_select"
  on public.vehicles
  for select
  using (true);

create policy "anon_insert"
  on public.vehicles
  for insert
  with check (true);

create policy "anon_update"
  on public.vehicles
  for update
  using (true)
  with check (true);

create policy "anon_delete"
  on public.vehicles
  for delete
  using (true);

create policy "Service role full access"
  on public.vehicles
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Bucket storage vehicle-images : accès public complet
-- (nécessaire tant que l'admin tourne avec l'anon key)
drop policy if exists "Public read access" on storage.objects;
drop policy if exists "Public upload access" on storage.objects;
drop policy if exists "Public update access" on storage.objects;
drop policy if exists "Public delete access" on storage.objects;
drop policy if exists "Service role full access" on storage.objects;

create policy "Public read access"
  on storage.objects for select
  using (bucket_id = 'vehicle-images');

create policy "Public upload access"
  on storage.objects for insert
  with check (bucket_id = 'vehicle-images');

create policy "Public update access"
  on storage.objects for update
  using (bucket_id = 'vehicle-images')
  with check (bucket_id = 'vehicle-images');

create policy "Public delete access"
  on storage.objects for delete
  using (bucket_id = 'vehicle-images');

create policy "Service role full access"
  on storage.objects for all
  using (bucket_id = 'vehicle-images' and auth.role() = 'service_role')
  with check (bucket_id = 'vehicle-images' and auth.role() = 'service_role');
