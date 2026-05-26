-- Add user status for suspension/ban functionality
ALTER TABLE public.profiles
  ADD COLUMN status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'banned')),
  ADD COLUMN suspended_until timestamptz,
  ADD COLUMN admin_memo text;

CREATE INDEX idx_profiles_status ON public.profiles(status);

-- Allow authenticated users to update any profile (admin check at app level via requireAdmin)
CREATE POLICY "Authenticated users can update profiles"
  ON public.profiles FOR UPDATE
  USING (auth.role() = 'authenticated');
