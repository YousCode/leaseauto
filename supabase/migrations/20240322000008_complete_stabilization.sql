ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS brand TEXT,
  ADD COLUMN IF NOT EXISTS model TEXT;

CREATE OR REPLACE FUNCTION gen_vehicle_slug()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := translate(lower(NEW.brand || '-' || NEW.model || '-' ||
                 substr(md5(random()::text),1,6)), ' ', '-');
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_gen_slug ON public.vehicles;
CREATE TRIGGER trg_gen_slug BEFORE INSERT ON public.vehicles
FOR EACH ROW EXECUTE PROCEDURE gen_vehicle_slug();

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sel_pub" ON public.vehicles;
CREATE POLICY "sel_pub" ON public.vehicles
  FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "ins_draft" ON public.vehicles;
CREATE POLICY "ins_draft" ON public.vehicles
  FOR INSERT WITH CHECK (status = 'draft');

DROP POLICY IF EXISTS "upd_any" ON public.vehicles;
CREATE POLICY "upd_any" ON public.vehicles
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "del_any" ON public.vehicles;
CREATE POLICY "del_any" ON public.vehicles FOR DELETE USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'vehicles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE vehicles;
  END IF;
END $$;