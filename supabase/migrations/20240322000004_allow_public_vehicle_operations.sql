-- Allow public insert, update, and delete operations on vehicles table
-- This enables the frontend (using anon key) to perform CRUD operations

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Public read published" ON vehicles;
DROP POLICY IF EXISTS "Service role full access" ON vehicles;
DROP POLICY IF EXISTS "open write dev" ON vehicles;

-- Create comprehensive anon policies
DROP POLICY IF EXISTS "anon_insert" ON vehicles;
CREATE POLICY "anon_insert"
ON vehicles FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update" ON vehicles;
CREATE POLICY "anon_update"
ON vehicles FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete" ON vehicles;
CREATE POLICY "anon_delete"
ON vehicles FOR DELETE
USING (true);

-- Public can read all vehicles (for admin interface)
DROP POLICY IF EXISTS "anon_select" ON vehicles;
CREATE POLICY "anon_select"
ON vehicles FOR SELECT
USING (true);

-- Service role maintains full access
DROP POLICY IF EXISTS "Service role full access" ON vehicles;
CREATE POLICY "Service role full access"
ON vehicles FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
