create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_active boolean default false,
  created_at timestamptz default now()
);

create table if not exists categories (
  id serial primary key,
  slug text unique not null,
  name text not null,
  display_order int not null,
  weight_percent int not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists questions (
  id serial primary key,
  category_id int references categories(id) on delete cascade,
  text text not null,
  explanation text,
  weight int not null check (weight between 1 and 10),
  risk_level int check (risk_level between 1 and 5),
  display_order int not null,
  created_at timestamptz default now()
);

create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  business_name text,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  category_scores jsonb,
  final_score numeric,
  started_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references audits(id) on delete cascade,
  question_id int references questions(id),
  coef int not null check (coef between 1 and 5),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(audit_id, question_id)
);

create index if not exists responses_audit_id_idx on responses(audit_id);
create index if not exists questions_category_id_idx on questions(category_id);
create index if not exists audits_user_id_idx on audits(user_id);

alter table profiles enable row level security;
alter table audits enable row level security;
alter table responses enable row level security;
alter table categories enable row level security;
alter table questions enable row level security;

drop policy if exists users_read_own_profile on profiles;
create policy users_read_own_profile on profiles for select using (auth.uid() = id);

drop policy if exists users_update_own_profile on profiles;
create policy users_update_own_profile on profiles for update using (auth.uid() = id);

drop policy if exists users_read_own_audits on audits;
create policy users_read_own_audits on audits for select using (auth.uid() = user_id);

drop policy if exists users_insert_own_audits on audits;
create policy users_insert_own_audits on audits for insert with check (auth.uid() = user_id);

drop policy if exists users_update_own_audits on audits;
create policy users_update_own_audits on audits for update using (auth.uid() = user_id);

drop policy if exists users_read_own_responses on responses;
create policy users_read_own_responses on responses for select using (
  exists (select 1 from audits where audits.id = responses.audit_id and audits.user_id = auth.uid())
);

drop policy if exists users_write_own_responses on responses;
create policy users_write_own_responses on responses for all using (
  exists (select 1 from audits where audits.id = responses.audit_id and audits.user_id = auth.uid())
) with check (
  exists (select 1 from audits where audits.id = responses.audit_id and audits.user_id = auth.uid())
);

drop policy if exists auth_read_categories on categories;
create policy auth_read_categories on categories for select using (auth.role() = 'authenticated');

drop policy if exists auth_read_questions on questions;
create policy auth_read_questions on questions for select using (auth.role() = 'authenticated');

create or replace function check_user_active()
returns trigger as $$
begin
  if not exists (select 1 from profiles where id = new.user_id and is_active = true) then
    raise exception 'User account not yet activated';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists ensure_user_active on audits;
create trigger ensure_user_active before insert on audits
for each row execute function check_user_active();

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function handle_new_user();
