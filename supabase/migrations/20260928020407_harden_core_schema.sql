create schema if not exists private;

revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.handle_new_user()
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

create or replace function private.create_default_escrow_milestones()
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

create or replace function private.log_investment_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.investment_events (investment_id, actor_id, event_type, payload)
    values (new.id, (select auth.uid()), 'investment.created', jsonb_build_object('status', new.status));
  elsif old.status is distinct from new.status then
    insert into public.investment_events (investment_id, actor_id, event_type, payload)
    values (
      new.id,
      (select auth.uid()),
      'investment.status_changed',
      jsonb_build_object('from', old.status, 'to', new.status)
    );
  end if;
  return new;
end;
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;
revoke all on function private.create_default_escrow_milestones() from public, anon, authenticated;
revoke all on function private.log_investment_event() from public, anon, authenticated;
revoke all on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

drop trigger if exists on_investment_created on public.investments;
create trigger on_investment_created
after insert on public.investments
for each row execute function private.create_default_escrow_milestones();

drop trigger if exists investment_event_log on public.investments;
create trigger investment_event_log
after insert or update of status on public.investments
for each row execute function private.log_investment_event();

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = (select auth.uid()) or (select private.is_admin()));

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles for update
to authenticated
using (id = (select auth.uid()) or (select private.is_admin()))
with check (id = (select auth.uid()) or (select private.is_admin()));

drop policy if exists "investments_select_own_or_admin" on public.investments;
create policy "investments_select_own_or_admin"
on public.investments for select
to authenticated
using (investor_id = (select auth.uid()) or (select private.is_admin()));

drop policy if exists "investments_update_own_draft_or_admin" on public.investments;
create policy "investments_update_own_draft_or_admin"
on public.investments for update
to authenticated
using (
  (select private.is_admin())
  or (investor_id = (select auth.uid()) and status = 'draft')
)
with check (
  (select private.is_admin())
  or (
    investor_id = (select auth.uid())
    and status in ('draft', 'cancelled')
  )
);

drop policy if exists "escrow_select_for_owner_or_admin" on public.escrow_milestones;
create policy "escrow_select_for_owner_or_admin"
on public.escrow_milestones for select
to authenticated
using (
  (select private.is_admin())
  or exists (
    select 1
    from public.investments
    where investments.id = escrow_milestones.investment_id
      and investments.investor_id = (select auth.uid())
  )
);

drop policy if exists "escrow_admin_write" on public.escrow_milestones;

create policy "escrow_admin_insert"
on public.escrow_milestones for insert
to authenticated
with check ((select private.is_admin()));

create policy "escrow_admin_update"
on public.escrow_milestones for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "escrow_admin_delete"
on public.escrow_milestones for delete
to authenticated
using ((select private.is_admin()));

drop policy if exists "events_select_for_owner_or_admin" on public.investment_events;
create policy "events_select_for_owner_or_admin"
on public.investment_events for select
to authenticated
using (
  (select private.is_admin())
  or exists (
    select 1
    from public.investments
    where investments.id = investment_events.investment_id
      and investments.investor_id = (select auth.uid())
  )
);

drop function if exists public.handle_new_user();
drop function if exists public.create_default_escrow_milestones();
drop function if exists public.log_investment_event();
drop function if exists public.is_admin();

create index if not exists investment_events_actor_idx
  on public.investment_events (actor_id);
