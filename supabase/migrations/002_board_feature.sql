-- =============================================================
-- MANDLE Community Board Feature - Migration
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================================

-- 1. BOARD_POSTS TABLE
create table public.board_posts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  image_url text,
  likes_count int not null default 0,
  comments_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.board_posts enable row level security;

create index idx_board_posts_user_id on public.board_posts(user_id);
create index idx_board_posts_created_at on public.board_posts(created_at desc);

create policy "Board posts are viewable by everyone"
  on public.board_posts for select using (true);

create policy "Authenticated users can create board posts"
  on public.board_posts for insert with check (auth.uid() = user_id);

create policy "Users can update own board posts"
  on public.board_posts for update using (auth.uid() = user_id);

create policy "Users can delete own board posts"
  on public.board_posts for delete using (auth.uid() = user_id);

-- 2. BOARD_COMMENTS TABLE
create table public.board_comments (
  id bigint generated always as identity primary key,
  board_post_id bigint not null references public.board_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.board_comments enable row level security;

create index idx_board_comments_post_id on public.board_comments(board_post_id);

create policy "Board comments are viewable by everyone"
  on public.board_comments for select using (true);

create policy "Authenticated users can comment on board"
  on public.board_comments for insert with check (auth.uid() = user_id);

create policy "Users can delete own board comments"
  on public.board_comments for delete using (auth.uid() = user_id);

-- Board comments count triggers
create or replace function public.handle_board_comment_created()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.board_posts set comments_count = comments_count + 1 where id = new.board_post_id;
  return new;
end;
$$;

create trigger on_board_comment_created
  after insert on public.board_comments
  for each row execute function public.handle_board_comment_created();

create or replace function public.handle_board_comment_deleted()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.board_posts set comments_count = greatest(comments_count - 1, 0) where id = old.board_post_id;
  return old;
end;
$$;

create trigger on_board_comment_deleted
  after delete on public.board_comments
  for each row execute function public.handle_board_comment_deleted();

-- 3. BOARD_LIKES TABLE
create table public.board_likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  board_post_id bigint not null references public.board_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, board_post_id)
);

alter table public.board_likes enable row level security;

create index idx_board_likes_post_id on public.board_likes(board_post_id);

create policy "Board likes are viewable by everyone"
  on public.board_likes for select using (true);

create policy "Authenticated users can like board posts"
  on public.board_likes for insert with check (auth.uid() = user_id);

create policy "Users can unlike board posts"
  on public.board_likes for delete using (auth.uid() = user_id);

-- Board likes count triggers
create or replace function public.handle_board_like_created()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.board_posts set likes_count = likes_count + 1 where id = new.board_post_id;
  return new;
end;
$$;

create trigger on_board_like_created
  after insert on public.board_likes
  for each row execute function public.handle_board_like_created();

create or replace function public.handle_board_like_deleted()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.board_posts set likes_count = greatest(likes_count - 1, 0) where id = old.board_post_id;
  return old;
end;
$$;

create trigger on_board_like_deleted
  after delete on public.board_likes
  for each row execute function public.handle_board_like_deleted();
