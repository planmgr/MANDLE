-- =============================================================
-- Social Login Profile Trigger Update
-- 소셜 로그인(Google/카카오/Apple) 시 프로필 닉네임을 올바르게 설정
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================================

-- 기존 handle_new_user 함수 업데이트
-- nickname fallback: nickname → full_name → name → 이메일 앞부분
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'nickname',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

-- 기존 handle_user_updated 함수 업데이트
create or replace function public.handle_user_updated()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  update public.profiles
  set
    nickname = coalesce(
      new.raw_user_meta_data ->> 'nickname',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      public.profiles.nickname
    ),
    avatar_url = coalesce(new.raw_user_meta_data ->> 'avatar_url', public.profiles.avatar_url),
    updated_at = now()
  where id = new.id;
  return new;
end;
$$;
