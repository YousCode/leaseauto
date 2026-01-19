-- Table véhicule enrichie
create extension if not exists pgcrypto;

-- Add new columns to vehicles table
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS km int4,
ADD COLUMN IF NOT EXISTS fuel text,
ADD COLUMN IF NOT EXISTS gearbox text,
ADD COLUMN IF NOT EXISTS monthly numeric,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS equipments text[],
ADD COLUMN IF NOT EXISTS specs jsonb;

-- Update RLS policies
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published" ON vehicles;
DROP POLICY IF EXISTS "public read published" ON vehicles;
DROP POLICY IF EXISTS "sel_pub" ON vehicles;
DROP POLICY IF EXISTS "anon_select" ON vehicles;
DROP POLICY IF EXISTS "anon_select_vehicle" ON vehicles;
DROP POLICY IF EXISTS "open write dev" ON vehicles;
DROP POLICY IF EXISTS "write_anon" ON vehicles;
DROP POLICY IF EXISTS "anon_insert" ON vehicles;
DROP POLICY IF EXISTS "anon_insert_vehicle" ON vehicles;
DROP POLICY IF EXISTS "anon_update" ON vehicles;
DROP POLICY IF EXISTS "anon_update_vehicle" ON vehicles;
DROP POLICY IF EXISTS "owner_update_vehicle" ON vehicles;
DROP POLICY IF EXISTS "upd_any" ON vehicles;
DROP POLICY IF EXISTS "anon_delete" ON vehicles;
DROP POLICY IF EXISTS "owner_delete_vehicle" ON vehicles;
DROP POLICY IF EXISTS "del_any" ON vehicles;
DROP POLICY IF EXISTS "Service role full access" ON vehicles;
DROP POLICY IF EXISTS "auth_write" ON vehicles;

CREATE POLICY "public read published"
  ON vehicles FOR SELECT
  USING (status = 'published');

-- Insert / update / delete = users authentifiés (JWT = authenticated)
CREATE POLICY "auth_write"
  ON vehicles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (status IN ('draft','published','archived'));

CREATE POLICY "Service role full access"
  ON vehicles FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Enable realtime (only if not already added)
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
