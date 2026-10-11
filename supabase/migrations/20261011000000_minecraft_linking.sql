-- VeldoraMC account linking. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.minecraft_link_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists minecraft_link_codes_user_created_idx
  on public.minecraft_link_codes(user_id, created_at desc);

create table if not exists public.minecraft_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  minecraft_username text not null,
  minecraft_uuid text not null unique,
  edition text not null default 'java' check (edition in ('java','bedrock')),
  linked_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.minecraft_link_codes enable row level security;
alter table public.minecraft_links enable row level security;
-- No direct browser access to codes. Edge Functions use the service role and
-- verify the caller's JWT before issuing a code.
drop policy if exists "Players read own Minecraft link" on public.minecraft_links;
create policy "Players read own Minecraft link"
  on public.minecraft_links for select to authenticated
  using (user_id = (select auth.uid()));
-- No client INSERT/UPDATE/DELETE policies: only trusted Edge Functions write.
