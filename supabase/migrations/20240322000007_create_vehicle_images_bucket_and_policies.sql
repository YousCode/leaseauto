INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-images', 'vehicle-images', true) ON CONFLICT (id) DO NOTHING;

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "write_anon" ON vehicles;
CREATE POLICY "write_anon" ON vehicles
  FOR ALL
  USING (true)
  WITH CHECK (true);
