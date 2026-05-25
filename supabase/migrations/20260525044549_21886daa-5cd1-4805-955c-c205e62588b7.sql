
ALTER TABLE public.media
  ADD COLUMN visibility text NOT NULL DEFAULT 'public'
  CHECK (visibility IN ('public', 'private'));

CREATE POLICY "Anyone can update media"
ON public.media FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
