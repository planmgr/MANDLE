-- =============================================================
-- Nickname Set By User Flag
-- 소셜 로그인 사용자의 닉네임 설정 여부 추적
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================================

-- 1. profiles 테이블에 nickname_set_by_user 컬럼 추가
alter table public.profiles
  add column if not exists nickname_set_by_user boolean not null default false;

-- 2. 기존 사용자 중 닉네임을 직접 설정한 사용자 backfill
-- 이메일 앞부분과 닉네임이 다른 사용자는 직접 설정한 것으로 간주
update public.profiles
set nickname_set_by_user = true
where nickname != split_part(
  (select email from auth.users where auth.users.id = profiles.id),
  '@', 1
)
and nickname is not null;

-- 3. handle_new_user 트리거 수정
-- 이메일 가입(nickname 메타데이터 존재) 시 true, 소셜 가입 시 false
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname, avatar_url, nickname_set_by_user)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'nickname',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    (new.raw_user_meta_data ->> 'nickname') is not null
  );
  return new;
end;
$$;
