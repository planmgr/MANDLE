-- Reports & Notifications tables

-- ===== REPORTS =====
CREATE TABLE public.reports (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,        -- 'post' | 'board_post'
  target_id BIGINT NOT NULL,
  reason TEXT NOT NULL,             -- 'spam' | 'inappropriate' | 'harassment' | 'other'
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'reviewed' | 'dismissed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(reporter_id, target_type, target_id)
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- All authenticated users can view reports (admin check at app level)
CREATE POLICY "Authenticated users can view all reports"
  ON public.reports FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update reports"
  ON public.reports FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_target ON public.reports(target_type, target_id);

-- ===== NOTIFICATIONS =====
CREATE TABLE public.notifications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  type TEXT NOT NULL,               -- 'like' | 'comment' | 'follow' | 'board_like' | 'board_comment'
  target_type TEXT,                 -- 'post' | 'board_post'
  target_id BIGINT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = recipient_id);

CREATE POLICY "Authenticated users can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX idx_notifications_recipient ON public.notifications(recipient_id, read, created_at DESC);
