-- TALIVA core schema (athlete records intentionally deferred)
-- Apply this file through the Supabase SQL editor or CLI.

create extension if not exists pgcrypto;

create type public.app_role as enum ('investor', 'admin');
create type public.investment_status as enum ('draft', 'pending', 'confirmed', 'cancelled', 'completed');
create type public.escrow_status as enum ('locked', 'pending', 'released', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role public.app_role not null default 'investor',
  locale text not null default 'en' check (locale in ('fa', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.investments (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.profiles(id) on delete cascade,
  athlete_reference text not null check (char_length(athlete_reference) between 1 and 120),
  amount numeric(20, 6) not null check (amount > 0),
  currency text not null default 'USDC' check (currency in ('USDC')),
  status public.investment_status not null default 'draft',
  transaction_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  constraint transaction_hash_format check (
    transaction_hash is null or transaction_hash ~ '^0x[0-9a-fA-F]{64}$'
  )
);

create table public.escrow_milestones (
  id uuid primary key default gen_random_uuid(),
  investment_id uuid not null references public.investments(id) on delete cascade,
  tier text not null check (tier in ('D', 'C', 'B', 'A')),
  position smallint not null check (position between 1 and 4),
  allocation_bps integer not null check (allocation_bps > 0 and allocation_bps <= 10000),
  status public.escrow_status not null default 'locked',
  release_criteria jsonb not null default '{}'::jsonb,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (investment_id, tier),
  unique (investment_id, position),
  constraint release_timestamp_matches_status check (
    (status = 'released' and released_at is not null)
    or (status <> 'released' and released_at is null)
  )
);

create table public.investment_events (
  id bigint generated always as identity primary key,
  investment_id uuid not null references public.investments(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index investments_investor_created_idx
  on public.investments (investor_id, created_at desc);
create index investments_status_idx
  on public.investments (status);
create index investments_athlete_reference_idx
  on public.investments (athlete_reference);
create index escrow_milestones_investment_idx
  on public.escrow_milestones (investment_id, position);
create index investment_events_investment_created_idx
  on public.investment_events (investment_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger investments_set_updated_at
before update on public.investments
for each row execute function public.set_updated_at();

create trigger escrow_milestones_set_updated_at
before update on public.escrow_milestones
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, locale, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)),
    case when new.raw_user_meta_data ->> 'locale' = 'fa' then 'fa' else 'en' end,
    'investor'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.create_default_escrow_milestones()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.escrow_milestones
    (investment_id, tier, position, allocation_bps, status)
  values
    (new.id, 'D', 1, 1000, 'pending'),
    (new.id, 'C', 2, 2000, 'locked'),
    (new.id, 'B', 3, 3000, 'locked'),
    (new.id, 'A', 4, 4000, 'locked');

  return new;
end;
$$;

create trigger on_investment_created
after insert on public.investments
for each row execute function public.create_default_escrow_milestones();

create or replace function public.log_investment_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.investment_events (investment_id, actor_id, event_type, payload)
    values (new.id, auth.uid(), 'investment.created', jsonb_build_object('status', new.status));
  elsif old.status is distinct from new.status then
    insert into public.investment_events (investment_id, actor_id, event_type, payload)
    values (
      new.id,
      auth.uid(),
      'investment.status_changed',
      jsonb_build_object('from', old.status, 'to', new.status)
    );
  end if;

  return new;
end;
$$;

create trigger investment_event_log
after insert or update of status on public.investments
for each row execute function public.log_investment_event();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.investments enable row level security;
alter table public.escrow_milestones enable row level security;
alter table public.investment_events enable row level security;

create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
on public.profiles for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "investments_select_own_or_admin"
on public.investments for select
to authenticated
using (investor_id = auth.uid() or public.is_admin());

create policy "investments_insert_own"
on public.investments for insert
to authenticated
with check (investor_id = auth.uid() and status = 'draft');

create policy "investments_update_own_draft_or_admin"
on public.investments for update
to authenticated
using (
  public.is_admin()
  or (investor_id = auth.uid() and status = 'draft')
)
with check (
  public.is_admin()
  or (
    investor_id = auth.uid()
    and status in ('draft', 'cancelled')
  )
);

create policy "escrow_select_for_owner_or_admin"
on public.escrow_milestones for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.investments
    where investments.id = escrow_milestones.investment_id
      and investments.investor_id = auth.uid()
  )
);

create policy "escrow_admin_write"
on public.escrow_milestones for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "events_select_for_owner_or_admin"
on public.investment_events for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.investments
    where investments.id = investment_events.investment_id
      and investments.investor_id = auth.uid()
  )
);

revoke all on public.profiles from anon;
revoke all on public.investments from anon;
revoke all on public.escrow_milestones from anon;
revoke all on public.investment_events from anon;

grant select on public.profiles to authenticated;
grant update (display_name, locale) on public.profiles to authenticated;
grant select, insert, update on public.investments to authenticated;
grant select on public.escrow_milestones to authenticated;
grant select on public.investment_events to authenticated;
grant usage, select on sequence public.investment_events_id_seq to authenticated;

comment on column public.investments.athlete_reference is
  'Temporary external athlete identifier. Replace with an athlete foreign key in the future athlete migration.';
