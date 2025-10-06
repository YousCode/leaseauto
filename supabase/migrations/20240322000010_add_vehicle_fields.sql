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
DROP POLICY IF EXISTS "public read published" ON vehicles;
CREATE POLICY "public read published"
  ON vehicles FOR SELECT
  USING (status = 'published');

-- Insert / update / delete = users authentifiés (JWT = authenticated)
DROP POLICY IF EXISTS "auth_write" ON vehicles;
CREATE POLICY "auth_write"
  ON vehicles FOR ALL
  TO authenticated
  USING     (auth.role() = 'authenticated')
  WITH CHECK(status IN ('draft','published','archived'));

-- Enable realtime (only if not already added)
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'vehicles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE vehicles;
    END IF;
END $;
