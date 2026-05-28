alter table public.profiles
  add column if not exists is_admin boolean default false;

alter table public.audits
  add column if not exists viewed_by_admin boolean default false;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and is_admin = true
  );
$$;

drop policy if exists admins_read_all_profiles on public.profiles;
create policy admins_read_all_profiles
on public.profiles
for select
using (public.is_admin());

drop policy if exists admins_update_all_profiles on public.profiles;
create policy admins_update_all_profiles
on public.profiles
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists admins_read_all_audits on public.audits;
create policy admins_read_all_audits
on public.audits
for select
using (public.is_admin());

drop policy if exists admins_update_all_audits on public.audits;
create policy admins_update_all_audits
on public.audits
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists admins_read_all_responses on public.responses;
create policy admins_read_all_responses
on public.responses
for select
using (public.is_admin());

create index if not exists profiles_is_active_idx on public.profiles(is_active);
create index if not exists profiles_is_admin_idx on public.profiles(is_admin);
create index if not exists audits_status_viewed_by_admin_idx
  on public.audits(status, viewed_by_admin);
create index if not exists audits_completed_at_idx on public.audits(completed_at desc);
