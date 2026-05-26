-- Fix handle_new_user trigger:
-- 1. Handle empty strings from OAuth providers (NULLIF + TRIM)
-- 2. Add ON CONFLICT to prevent duplicate key errors on retry

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_url, nickname_set_by_user)
  VALUES (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'nickname'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    nullif(trim(new.raw_user_meta_data ->> 'nickname'), '') IS NOT NULL
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;
