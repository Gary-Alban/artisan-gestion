create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'given_name',
      new.raw_user_meta_data->>'first_name'
    )
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.check_user_active()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.profiles
    where id = new.user_id
      and is_active = true
  ) then
    raise exception 'User account not yet activated';
  end if;

  return new;
end;
$$;

drop trigger if exists ensure_user_active on public.audits;
create trigger ensure_user_active
before insert on public.audits
for each row execute function public.check_user_active();

insert into public.profiles (id, email, full_name)
select
  id,
  coalesce(email, ''),
  coalesce(
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'display_name',
    raw_user_meta_data->>'given_name',
    raw_user_meta_data->>'first_name'
  )
from auth.users
on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name);
