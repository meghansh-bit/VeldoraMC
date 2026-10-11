-- VeldoraMC store items managed by admins
create table if not exists public.store_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'General',
  description text not null default '',
  image_url text not null default '',
  price numeric(10,2) not null default 0 check (price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.store_items enable row level security;
drop policy if exists "Public can view active store items" on public.store_items;
create policy "Public can view active store items" on public.store_items for select using (active = true);
drop policy if exists "Admins can manage store items" on public.store_items;
create policy "Admins can manage store items" on public.store_items for all
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create index if not exists store_items_active_idx on public.store_items(active, created_at desc);
