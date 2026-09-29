create type public.workshop_status as enum ('draft', 'published', 'sold_out', 'archived');
create type public.registration_status as enum ('pending', 'confirmed', 'cancelled', 'attended');
create type public.payment_status as enum ('pending', 'paid', 'refunded', 'not_required');

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table public.workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text not null,
  short_description text not null,
  image_url text,
  date date not null,
  start_time time not null,
  end_time time not null,
  location text not null,
  price integer not null check (price >= 0),
  total_seats integer not null check (total_seats > 0),
  available_seats integer not null check (available_seats >= 0 and available_seats <= total_seats),
  materials text[] not null default '{}',
  status public.workshop_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  registration_id text unique not null,
  workshop_id uuid not null references public.workshops(id),
  full_name text not null,
  phone text not null,
  email text not null,
  age_group text,
  number_of_seats integer not null check (number_of_seats > 0),
  instagram_username text,
  special_note text,
  source text,
  status public.registration_status not null default 'pending',
  payment_status public.payment_status not null default 'not_required',
  created_at timestamptz not null default now()
);

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  workshop_id uuid references public.workshops(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.workshops enable row level security;
alter table public.registrations enable row level security;
alter table public.gallery enable row level security;
alter table public.contacts enable row level security;
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()); $$;

create policy "published workshops are public" on public.workshops for select using (status = 'published');
create policy "gallery is public" on public.gallery for select using (true);
create policy "visitors can create registrations" on public.registrations for insert with check (true);
create policy "visitors can create contacts" on public.contacts for insert with check (true);
create policy "admins manage workshops" on public.workshops for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage registrations" on public.registrations for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage gallery" on public.gallery for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read contacts" on public.contacts for select using (public.is_admin());
create policy "admins read own role" on public.admins for select using (user_id = auth.uid());

-- Add an authenticated user's UUID to public.admins from a trusted migration/admin console.
-- Never put passwords or service-role keys in frontend code.
