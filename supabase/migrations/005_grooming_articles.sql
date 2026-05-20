-- =============================================================
-- MANDLE Grooming Articles - Migration
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================================

create table public.grooming_articles (
  id bigint generated always as identity primary key,
  title text not null,
  summary text,
  body text not null default '',
  cover_image_url text not null,
  category text not null,
  read_time text,
  is_featured boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.grooming_articles enable row level security;

create index idx_grooming_articles_category on public.grooming_articles(category);
create index idx_grooming_articles_created on public.grooming_articles(created_at desc);

create policy "Grooming articles are viewable by everyone"
  on public.grooming_articles for select using (true);
