
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wedding-media',
  'wedding-media',
  true,
  524288000,
  array['image/jpeg','image/png','image/webp','image/gif','image/heic','video/mp4','video/quicktime','video/webm']
)
on conflict (id) do update set public = true, file_size_limit = 524288000;

create policy "Public read wedding-media"
on storage.objects for select
using (bucket_id = 'wedding-media');

create policy "Anyone can upload wedding-media"
on storage.objects for insert
with check (bucket_id = 'wedding-media');
