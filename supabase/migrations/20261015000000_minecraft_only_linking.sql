-- Minecraft-only account linking. Run with Supabase migrations before enabling the UI.
create table if not exists public.minecraft_link_codes (
  code_hash text primary key,
  minecraft_uuid text not null,
  minecraft_username text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists minecraft_link_codes_expiry_idx on public.minecraft_link_codes (expires_at);

create table if not exists public.minecraft_accounts (
  minecraft_uuid text primary key,
  minecraft_username text not null,
  linked_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

alter table public.minecraft_link_codes enable row level security;
alter table public.minecraft_accounts enable row level security;
revoke all on public.minecraft_link_codes from anon, authenticated;
revoke all on public.minecraft_accounts from anon, authenticated;
grant all on public.minecraft_link_codes to service_role;
grant all on public.minecraft_accounts to service_role;

-- Public users must never be able to read or mint verification codes directly.
