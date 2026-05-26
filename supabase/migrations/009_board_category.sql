-- =============================================================
-- Board Posts Category Column
-- TALK / ITEM 탭 구분을 위한 카테고리 컬럼 추가
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================================

-- board_posts 테이블에 category 컬럼 추가
alter table public.board_posts
  add column if not exists category text not null default 'talk';

-- 기존 게시물은 모두 'talk'으로 설정 (기본값으로 이미 적용됨)
