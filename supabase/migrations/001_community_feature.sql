-- =============================================================
-- MANDLE Community Feature - Supabase Migration
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================================

-- 1. PROFILES TABLE
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nickname', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Sync profile when user metadata changes
create or replace function public.handle_user_updated()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.profiles
  set
    nickname = coalesce(new.raw_user_meta_data ->> 'nickname', public.profiles.nickname),
    avatar_url = coalesce(new.raw_user_meta_data ->> 'avatar_url', public.profiles.avatar_url),
    updated_at = now()
  where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_updated
  after update on auth.users
  for each row execute function public.handle_user_updated();

-- 2. TAGS TABLE
create table public.tags (
  id bigint generated always as identity primary key,
  name text not null unique,
  post_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.tags enable row level security;

create policy "Tags are viewable by everyone"
  on public.tags for select using (true);

create policy "Authenticated users can create tags"
  on public.tags for insert
  with check (auth.role() = 'authenticated');

-- 3. POSTS TABLE
create table public.posts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,
  caption text,
  likes_count int not null default 0,
  comments_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create index idx_posts_user_id on public.posts(user_id);
create index idx_posts_created_at on public.posts(created_at desc);
create index idx_posts_likes_count on public.posts(likes_count desc);

create policy "Posts are viewable by everyone"
  on public.posts for select using (true);

create policy "Authenticated users can create posts"
  on public.posts for insert with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.posts for update using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.posts for delete using (auth.uid() = user_id);

-- 4. POST_TAGS JOIN TABLE
create table public.post_tags (
  post_id bigint not null references public.posts(id) on delete cascade,
  tag_id bigint not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

alter table public.post_tags enable row level security;

create index idx_post_tags_tag_id on public.post_tags(tag_id);

create policy "Post tags are viewable by everyone"
  on public.post_tags for select using (true);

create policy "Post owners can manage post tags"
  on public.post_tags for insert
  with check (exists (select 1 from public.posts where posts.id = post_id and posts.user_id = auth.uid()));

create policy "Post owners can delete post tags"
  on public.post_tags for delete
  using (exists (select 1 from public.posts where posts.id = post_id and posts.user_id = auth.uid()));

-- 5. LIKES TABLE
create table public.likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id bigint not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

alter table public.likes enable row level security;

create index idx_likes_post_id on public.likes(post_id);

create policy "Likes are viewable by everyone"
  on public.likes for select using (true);

create policy "Authenticated users can like"
  on public.likes for insert with check (auth.uid() = user_id);

create policy "Users can unlike"
  on public.likes for delete using (auth.uid() = user_id);

-- Likes count triggers
create or replace function public.handle_like_created()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.posts set likes_count = likes_count + 1 where id = new.post_id;
  return new;
end;
$$;

create trigger on_like_created
  after insert on public.likes
  for each row execute function public.handle_like_created();

create or replace function public.handle_like_deleted()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.posts set likes_count = greatest(likes_count - 1, 0) where id = old.post_id;
  return old;
end;
$$;

create trigger on_like_deleted
  after delete on public.likes
  for each row execute function public.handle_like_deleted();

-- 6. COMMENTS TABLE
create table public.comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create index idx_comments_post_id on public.comments(post_id);

create policy "Comments are viewable by everyone"
  on public.comments for select using (true);

create policy "Authenticated users can comment"
  on public.comments for insert with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.comments for delete using (auth.uid() = user_id);

-- Comments count triggers
create or replace function public.handle_comment_created()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.posts set comments_count = comments_count + 1 where id = new.post_id;
  return new;
end;
$$;

create trigger on_comment_created
  after insert on public.comments
  for each row execute function public.handle_comment_created();

create or replace function public.handle_comment_deleted()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.posts set comments_count = greatest(comments_count - 1, 0) where id = old.post_id;
  return old;
end;
$$;

create trigger on_comment_deleted
  after delete on public.comments
  for each row execute function public.handle_comment_deleted();

-- 7. BOOKMARKS TABLE
create table public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id bigint not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

alter table public.bookmarks enable row level security;

create index idx_bookmarks_user_id on public.bookmarks(user_id);

create policy "Users can view own bookmarks"
  on public.bookmarks for select using (auth.uid() = user_id);

create policy "Authenticated users can bookmark"
  on public.bookmarks for insert with check (auth.uid() = user_id);

create policy "Users can remove bookmarks"
  on public.bookmarks for delete using (auth.uid() = user_id);

-- 8. FOLLOWS TABLE
create table public.follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint no_self_follow check (follower_id != following_id)
);

alter table public.follows enable row level security;

create index idx_follows_following_id on public.follows(following_id);

create policy "Follows are viewable by everyone"
  on public.follows for select using (true);

create policy "Authenticated users can follow"
  on public.follows for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.follows for delete using (auth.uid() = follower_id);

-- 9. STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('posts', 'posts', true);
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

create policy "Anyone can view post images"
  on storage.objects for select using (bucket_id = 'posts');

create policy "Authenticated users can upload post images"
  on storage.objects for insert
  with check (bucket_id = 'posts' and auth.role() = 'authenticated');

create policy "Users can delete own post images"
  on storage.objects for delete
  using (bucket_id = 'posts' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Anyone can view avatars"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- 10. TAG POST_COUNT TRIGGERS
create or replace function public.handle_post_tag_created()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.tags set post_count = post_count + 1 where id = new.tag_id;
  return new;
end;
$$;

create trigger on_post_tag_created
  after insert on public.post_tags
  for each row execute function public.handle_post_tag_created();

create or replace function public.handle_post_tag_deleted()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.tags set post_count = greatest(post_count - 1, 0) where id = old.tag_id;
  return old;
end;
$$;

create trigger on_post_tag_deleted
  after delete on public.post_tags
  for each row execute function public.handle_post_tag_deleted();

-- 11. SEED: create profiles for existing users
insert into public.profiles (id, nickname, avatar_url)
select
  id,
  coalesce(raw_user_meta_data ->> 'nickname', split_part(email, '@', 1)),
  raw_user_meta_data ->> 'avatar_url'
from auth.users
on conflict (id) do nothing;
