-- Run this entire file in Supabase SQL Editor.
-- It is safe to rerun on an existing project.

create extension if not exists pgcrypto;

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.gallery add column if not exists media_type text not null default 'image';
alter table public.gallery drop constraint if exists gallery_media_type_check;
alter table public.gallery add constraint gallery_media_type_check check (media_type in ('image', 'video', 'instagram'));

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

alter table public.announcements enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "announcements are public" on public.announcements;
create policy "announcements are public" on public.announcements for select using (true);

drop policy if exists "admins manage announcements" on public.announcements;
create policy "admins manage announcements" on public.announcements for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings are public" on public.site_settings;
create policy "settings are public" on public.site_settings for select using (true);

drop policy if exists "admins manage settings" on public.site_settings;
create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into public.site_settings (key, value)
values
  ('brand_name', 'Make It Sociall'),
  ('contact_email', 'hello@makeitsociall.com'),
  ('contact_phone', ''),
  ('about_text', 'A creative space where art meets people.'),
  ('people_connected', '0'),
  ('workshops_done', '0')
on conflict (key) do nothing;

notify pgrst, 'reload schema';
