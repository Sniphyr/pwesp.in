-- PHANTOM WARRIOR — Supabase setup for Batch 1 (profiles + Row Level Security)
-- Run once in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to re-run. Contains no secrets.
--
-- Design: the browser never inserts into `profiles`. The sign-up form sends the profile fields as sign-up metadata;
-- a trigger on auth.users validates them (via the table constraints below) and creates the profile row linked to the
-- new user's id. This works even while email confirmation is pending (no session yet). The password is handled only
-- by Supabase Auth and never touches this table.

create table if not exists public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  full_name        text not null check (char_length(full_name) between 1 and 80),
  player_role      text not null check (player_role in ('Rusher','Nader','Sniper','IGL','Assaulter','Coach / Manager','Other / Supporter')),
  ign              text not null check (char_length(ign) between 1 and 40),
  uid              text not null check (char_length(uid) between 1 and 32),   -- text on purpose: keeps leading zeros
  discovery_source text not null check (discovery_source in ('Instagram','YouTube','Discord','Friends / Referral','Free Fire Tournament / Esports','Other')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.profiles is 'Public-site member profile. One row per auth user. No passwords, no email copy.';

-- Row Level Security: ON, with policies that only ever match the signed-in user's own row.
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No INSERT or DELETE policy: clients cannot create or delete profile rows directly.

-- Least privilege: anonymous visitors get nothing; signed-in users can read their row and edit only the profile fields.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, player_role, ign, uid, discovery_source) on public.profiles to authenticated;

-- Keep updated_at current
create or replace function public.set_profile_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_profile_updated_at();

-- Create the profile when an account is created through the registration form.
-- Accounts created some other way (without IGN/UID in the sign-up metadata) get no profile row.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  if nullif(btrim(m ->> 'ign'), '') is null or nullif(btrim(m ->> 'uid'), '') is null then
    return new;
  end if;
  -- Any value that breaks a constraint above raises an error, which makes the sign-up fail instead of saving bad data.
  insert into public.profiles (id, full_name, player_role, ign, uid, discovery_source)
  values (
    new.id,
    btrim(coalesce(m ->> 'full_name', '')),
    btrim(coalesce(m ->> 'player_role', '')),
    btrim(m ->> 'ign'),
    btrim(m ->> 'uid'),
    btrim(coalesce(m ->> 'discovery_source', ''))
  );
  return new;
end $$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
