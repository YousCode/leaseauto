ALTER TABLE vehicles 
  ADD COLUMN IF NOT EXISTS slug TEXT;

UPDATE vehicles 
SET slug = gen_random_uuid()::text 
WHERE slug IS NULL;

ALTER TABLE vehicles 
  ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS vehicles_slug_idx ON vehicles(slug);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_vehicle" ON vehicles;
CREATE POLICY "anon_select_vehicle"
  ON vehicles
  FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "anon_insert_vehicle" ON vehicles;
CREATE POLICY "anon_insert_vehicle" ON vehicles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_vehicle" ON vehicles;
CREATE POLICY "anon_update_vehicle" ON vehicles FOR UPDATE USING (true) WITH CHECK (true);

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
