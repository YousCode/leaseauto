-- Fix RLS policy for vehicles table to allow anon users to insert/update/delete

-- Ensure RLS is enabled on vehicles table
alter table vehicles enable row level security;

-- Drop any existing policy with the same name
drop policy if exists "open write dev" on vehicles;

-- Create policy that allows anon users to perform all operations
create policy "open write dev"
  on public.vehicles
  for all
  using ( true )
  with check ( true );
