-- Allow actors to delete their own notifications (for dedup on like/follow toggle)
CREATE POLICY "Actors can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = actor_id);
