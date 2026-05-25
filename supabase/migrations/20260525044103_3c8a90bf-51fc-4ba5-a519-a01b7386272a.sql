
CREATE POLICY "Anyone can delete media"
ON public.media FOR DELETE
TO public
USING (true);

CREATE POLICY "Anyone can delete wedding-media objects"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'wedding-media');
