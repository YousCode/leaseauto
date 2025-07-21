-- a) Ajout colonne propriétaire (future auth)
alter table vehicles
  add column if not exists owner_id uuid;

-- b) Politique lecture : inchangé (status = 'published')
-- c) Politique INSERT (draft) déjà existante

-- d) Politique UPDATE / DELETE ultra-sécurisée
drop policy if exists anon_update_vehicle on vehicles;
drop policy if exists anon_delete_vehicle on vehicles;

create policy "owner_update_vehicle"
on public.vehicles
for update
using ( auth.role() = 'service_role'  -- appel via Edge Function
     or owner_id = auth.uid() );      -- (auth à venir)

create policy "owner_delete_vehicle"
on public.vehicles
for delete
using ( auth.role() = 'service_role'
     or (owner_id = auth.uid() and status in ('draft','archived')) );

-- Enable realtime for vehicles table (only if not already added)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'vehicles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE vehicles;
    END IF;
END $$;