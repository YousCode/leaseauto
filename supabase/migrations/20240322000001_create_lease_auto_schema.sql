-- ➜ VEHICLES -----------------------------------------------------------------
create extension if not exists "pgcrypto";

create table if not exists public.vehicles (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamp       default now(),
  updated_at    timestamp       default now(),
  status        text            default 'draft'
               check (status in ('draft','published','archived')),
  title         text,
  brand         text,
  model         text,
  year          int2,
  mileage       int4,
  energy        text,
  gearbox       text,
  color         text,
  price         numeric,
  monthly       numeric,
  city          text,
  images        text[],      -- URLs stockées dans Storage
  options       text[],      -- liste d'équipements
  description   text
);

create index if not exists vehicles_status_idx on vehicles(status);
create index if not exists vehicles_created_at_idx on vehicles(created_at);

-- ➜ OPTIONS DE RÉFÉRENCE (facultatif) ----------------------------------------
create table if not exists public.vehicle_options (
  id   serial primary key,
  name text unique
);

insert into vehicle_options(name) values
('Climatisation'),
('GPS'),
('Bluetooth'),
('Caméra de recul')
on conflict do nothing;

-- ➜ TABLE PIN ADMIN -----------------------------------------------------------
create table if not exists public.admin_pins (
  pin text primary key
);

insert into admin_pins(pin) values ('leaseauto93')
on conflict do nothing;

-- ➜ RLS ----------------------------------------------------------------------
alter table vehicles enable row level security;

-- lecture publique : seulement les "published"
DROP POLICY IF EXISTS "Public read published" ON vehicles;
create policy "Public read published"
on vehicles for select
using ( status = 'published' );

-- droits complets côté service-role (backend / admin)
DROP POLICY IF EXISTS "Service role full access" ON vehicles;
create policy "Service role full access"
on vehicles for all
using  ( auth.role() = 'service_role' )
with   check ( auth.role() = 'service_role' );

-- ➜ Fonction mise à jour updated_at ------------------------------------------
create or replace function public.sync_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end; $$;

drop trigger if exists trg_updated_at on vehicles;
create trigger trg_updated_at
before update on vehicles
for each row execute procedure public.sync_updated_at();

-- ➜ FONCTION EDGE pour purge images (bonus) ─────
create or replace function public.delete_vehicle_files()
returns trigger language plpgsql as $$
declare
  file text;
begin
  if (tg_op = 'DELETE') then
    foreach file in array old.images loop
      perform storage.delete_object('vehicles', replace(file, 'https://XXXXXXXX.supabase.co/storage/v1/object/public/vehicles/', ''));
    end loop;
  end if;
  return null;
end; $$;

drop trigger if exists trg_delete_files on vehicles;
create trigger trg_delete_files
after delete on vehicles
for each row execute procedure public.delete_vehicle_files();

-- ➜ INDEX Full-Text (recherche) (bonus) ─────────
create extension if not exists "pg_trgm";

alter table vehicles
  add column if not exists search tsvector generated always as
  ( to_tsvector('simple',
      coalesce(title,'') || ' ' ||
      coalesce(brand,'') || ' ' ||
      coalesce(model,'') || ' ' ||
      coalesce(city,'')
    )
  ) stored;

create index if not exists vehicles_search_idx on vehicles using gin(search);

-- Enable realtime
alter publication supabase_realtime add table vehicles;
alter publication supabase_realtime add table vehicle_options;
alter publication supabase_realtime add table admin_pins;

-- ➜ SEED (exemple de 2 véhicules) ───────────────
insert into vehicles
(id, status, title, brand, model, year, mileage, energy, gearbox, color,
 price, monthly, city, images, options, description)
values
(gen_random_uuid(),'published','BMW X2 SDRIVE 20iA','BMW','X2',2022,15000,'Essence','Auto','Noir',
 26990,548,'Épinay-sur-Seine 93800',
 '{"https://XXXXXXXX.supabase.co/storage/v1/object/public/vehicles/demo/bmw-x2.webp"}',
 '{"Climatisation","GPS"}',
 'Très bon état, première main.'),
(gen_random_uuid(),'draft','Tesla Model 3 RWD','Tesla','Model 3',2021,12000,'Électrique','Auto','Blanc',
 27990,493,'Levallois-Perret 92300',
 '{"https://XXXXXXXX.supabase.co/storage/v1/object/public/vehicles/demo/tesla-model-3.webp"}',
 '{"Caméra de recul"}',
 'Autopilot activé.')
on conflict do nothing;