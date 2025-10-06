-- Create makes and models tables for better data structure
CREATE TABLE IF NOT EXISTS public.makes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.models (
  id SERIAL PRIMARY KEY,
  make_id INTEGER REFERENCES makes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  first_year INTEGER,
  last_year INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(make_id, name)
);

-- Insert popular makes
INSERT INTO makes (name, logo_url) VALUES
('Audi', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=100&q=80'),
('BMW', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100&q=80'),
('Mercedes-Benz', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=100&q=80'),
('Volkswagen', 'https://images.unsplash.com/photo-1622353219448-46a5eca8e4be?w=100&q=80'),
('Peugeot', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=100&q=80'),
('Renault', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=100&q=80'),
('Citroën', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=100&q=80'),
('Toyota', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&q=80'),
('Honda', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=100&q=80'),
('Ford', 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=100&q=80'),
('Opel', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=100&q=80'),
('Nissan', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&q=80'),
('Hyundai', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&q=80'),
('Kia', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&q=80'),
('Mazda', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&q=80'),
('Seat', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=100&q=80'),
('Skoda', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=100&q=80'),
('Volvo', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&q=80'),
('Fiat', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=100&q=80'),
('Mini', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100&q=80'),
('Alfa Romeo', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=100&q=80'),
('Jeep', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=100&q=80'),
('Land Rover', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=100&q=80'),
('Porsche', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=100&q=80'),
('Tesla', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=100&q=80')
ON CONFLICT (name) DO NOTHING;

-- Insert some popular models for major brands
INSERT INTO models (make_id, name, first_year, last_year) VALUES
((SELECT id FROM makes WHERE name = 'Audi'), 'A3', 1996, NULL),
((SELECT id FROM makes WHERE name = 'Audi'), 'A4', 1994, NULL),
((SELECT id FROM makes WHERE name = 'Audi'), 'A6', 1994, NULL),
((SELECT id FROM makes WHERE name = 'Audi'), 'Q3', 2011, NULL),
((SELECT id FROM makes WHERE name = 'Audi'), 'Q5', 2008, NULL),
((SELECT id FROM makes WHERE name = 'BMW'), '3 Series', 1975, NULL),
((SELECT id FROM makes WHERE name = 'BMW'), '5 Series', 1972, NULL),
((SELECT id FROM makes WHERE name = 'BMW'), 'X1', 2009, NULL),
((SELECT id FROM makes WHERE name = 'BMW'), 'X3', 2003, NULL),
((SELECT id FROM makes WHERE name = 'Mercedes-Benz'), 'C-Class', 1993, NULL),
((SELECT id FROM makes WHERE name = 'Mercedes-Benz'), 'E-Class', 1993, NULL),
((SELECT id FROM makes WHERE name = 'Mercedes-Benz'), 'GLA', 2013, NULL),
((SELECT id FROM makes WHERE name = 'Volkswagen'), 'Golf', 1974, NULL),
((SELECT id FROM makes WHERE name = 'Volkswagen'), 'Polo', 1975, NULL),
((SELECT id FROM makes WHERE name = 'Volkswagen'), 'Tiguan', 2007, NULL),
((SELECT id FROM makes WHERE name = 'Peugeot'), '208', 2012, NULL),
((SELECT id FROM makes WHERE name = 'Peugeot'), '308', 2007, NULL),
((SELECT id FROM makes WHERE name = 'Peugeot'), '3008', 2008, NULL),
((SELECT id FROM makes WHERE name = 'Renault'), 'Clio', 1990, NULL),
((SELECT id FROM makes WHERE name = 'Renault'), 'Megane', 1995, NULL),
((SELECT id FROM makes WHERE name = 'Renault'), 'Captur', 2013, NULL),
((SELECT id FROM makes WHERE name = 'Toyota'), 'Corolla', 1966, NULL),
((SELECT id FROM makes WHERE name = 'Toyota'), 'Yaris', 1999, NULL),
((SELECT id FROM makes WHERE name = 'Toyota'), 'RAV4', 1994, NULL),
((SELECT id FROM makes WHERE name = 'Tesla'), 'Model 3', 2017, NULL),
((SELECT id FROM makes WHERE name = 'Tesla'), 'Model Y', 2019, NULL),
((SELECT id FROM makes WHERE name = 'Tesla'), 'Model S', 2012, NULL)
ON CONFLICT (make_id, name) DO NOTHING;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS makes_name_idx ON makes(name);
CREATE INDEX IF NOT EXISTS models_make_id_idx ON models(make_id);
CREATE INDEX IF NOT EXISTS models_name_idx ON models(name);

-- Enable RLS
ALTER TABLE makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "public_read_makes" ON makes;
CREATE POLICY "public_read_makes" ON makes FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_models" ON models;
CREATE POLICY "public_read_models" ON models FOR SELECT USING (true);

-- Allow service role full access
DROP POLICY IF EXISTS "service_full_makes" ON makes;
CREATE POLICY "service_full_makes" ON makes FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "service_full_models" ON models;
CREATE POLICY "service_full_models" ON models FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Enable realtime
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'makes'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE makes;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'models'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE models;
    END IF;
END $$;
