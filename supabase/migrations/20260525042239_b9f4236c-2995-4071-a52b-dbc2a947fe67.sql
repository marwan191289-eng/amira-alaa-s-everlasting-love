
drop policy if exists "Public read wedding-media" on storage.objects;

create table public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  type text not null check (type in ('image','video')),
  caption text,
  uploader text,
  created_at timestamptz not null default now()
);

alter table public.media enable row level security;

create policy "Anyone can view media"
on public.media for select
using (true);

create policy "Anyone can insert media"
on public.media for insert
with check (true);

alter publication supabase_realtime add table public.media;
