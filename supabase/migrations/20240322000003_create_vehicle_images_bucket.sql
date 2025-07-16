-- Create vehicle-images bucket for storing vehicle photos
-- This bucket will store all vehicle images with public read access

-- Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;

-- Allow public read access to vehicle images
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicle-images');

-- Allow public upload access for frontend
DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
CREATE POLICY "Public upload access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'vehicle-images');

-- Allow public update access
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
CREATE POLICY "Public update access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'vehicle-images')
WITH CHECK (bucket_id = 'vehicle-images');

-- Allow public delete access
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;
CREATE POLICY "Public delete access"
ON storage.objects FOR DELETE
USING (bucket_id = 'vehicle-images');

-- Allow service role full access
DROP POLICY IF EXISTS "Service role full access" ON storage.objects;
CREATE POLICY "Service role full access"
ON storage.objects FOR ALL
USING (bucket_id = 'vehicle-images' AND auth.role() = 'service_role')
WITH CHECK (bucket_id = 'vehicle-images' AND auth.role() = 'service_role');
