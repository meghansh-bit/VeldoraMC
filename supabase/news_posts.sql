-- VeldoraMC editable news and announcements
-- Run this in Supabase SQL Editor before using /admin/news.
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  image text not null default '',
  category text not null default 'Announcement',
  excerpt text not null default '',
  content text not null default '',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.news_posts enable row level security;

drop policy if exists "Public can read published news" on public.news_posts;
create policy "Public can read published news"
  on public.news_posts for select using (published = true);

drop policy if exists "Admins can manage news posts" on public.news_posts;
create policy "Admins can manage news posts"
  on public.news_posts for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create index if not exists news_posts_published_created_idx
  on public.news_posts (published, created_at desc);
