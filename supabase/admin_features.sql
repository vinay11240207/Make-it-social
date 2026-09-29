-- Run this once in Supabase SQL Editor after the original schema.sql.
-- It is safe for an existing project and adds the admin studio features.

alter table public.gallery add column if not exists media_type text not null default 'image';
alter table public.gallery drop constraint if exists gallery_media_type_check;
alter table public.gallery add constraint gallery_media_type_check check (media_type in ('image', 'video', 'instagram'));

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

alter table public.announcements enable row level security;
alter table public.site_settings enable row level security;

do $$ begin
  create policy "announcements are public" on public.announcements for select using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "admins manage announcements" on public.announcements for all using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "settings are public" on public.site_settings for select using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null;
end $$;
