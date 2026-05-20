-- =============================================================
-- MANDLE Style Articles - Migration
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================================

create table public.style_articles (
  id bigint generated always as identity primary key,
  title text not null,
  summary text,
  body text not null default '',
  cover_image_url text not null,
  category text not null,
  is_featured boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.style_articles enable row level security;

create index idx_style_articles_category on public.style_articles(category);
create index idx_style_articles_featured on public.style_articles(is_featured) where is_featured = true;
create index idx_style_articles_created on public.style_articles(created_at desc);

create policy "Style articles are viewable by everyone"
  on public.style_articles for select using (true);
