-- =============================================================
-- MANDLE Featured Members - Migration
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================================

create table public.featured_members (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  interview text not null default '',
  cover_image_url text,
  tagline text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.featured_members enable row level security;

create unique index idx_featured_members_user_id on public.featured_members(user_id);
create index idx_featured_members_order on public.featured_members(display_order asc);

create policy "Featured members are viewable by everyone"
  on public.featured_members for select using (true);
