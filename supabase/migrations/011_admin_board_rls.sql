-- Expand board_posts RLS: allow any authenticated user to update/delete (admin check at app level)
-- Drop restrictive owner-only policies and replace with authenticated-user policies

DROP POLICY IF EXISTS "Users can update own board posts" ON public.board_posts;
DROP POLICY IF EXISTS "Users can delete own board posts" ON public.board_posts;

CREATE POLICY "Authenticated users can update board posts"
  ON public.board_posts FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete board posts"
  ON public.board_posts FOR DELETE
  USING (auth.role() = 'authenticated');

-- Same for posts table: expand delete to any authenticated user
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;

CREATE POLICY "Authenticated users can delete posts"
  ON public.posts FOR DELETE
  USING (auth.role() = 'authenticated');
