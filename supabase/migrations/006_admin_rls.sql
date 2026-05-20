-- =============================================================
-- MANDLE Admin RLS - Migration
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================================

-- style_articles: 인증 유저 쓰기 (어드민 체크는 앱 레벨)
create policy "Authenticated users can insert style articles"
  on public.style_articles for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update style articles"
  on public.style_articles for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete style articles"
  on public.style_articles for delete
  using (auth.role() = 'authenticated');

-- grooming_articles: 동일
create policy "Authenticated users can insert grooming articles"
  on public.grooming_articles for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update grooming articles"
  on public.grooming_articles for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete grooming articles"
  on public.grooming_articles for delete
  using (auth.role() = 'authenticated');

-- featured_members: INSERT/UPDATE/DELETE 추가
create policy "Authenticated users can insert featured members"
  on public.featured_members for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update featured members"
  on public.featured_members for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete featured members"
  on public.featured_members for delete
  using (auth.role() = 'authenticated');
