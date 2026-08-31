create type public.entry_visibility as enum ('private', 'public', 'anonymous');
create type public.report_status as enum ('open', 'reviewed', 'dismissed', 'hidden', 'deleted');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Grateful human',
  username text unique,
  avatar_url text,
  bio text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username is null or username ~ '^[a-z0-9_]{3,24}$')
);

create table public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  guest_id uuid,
  content text not null,
  visibility public.entry_visibility not null default 'private',
  hidden_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entries_owner_present check (user_id is not null or guest_id is not null),
  constraint entries_content_length check (char_length(content) between 1 and 500)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  reporter_id uuid references auth.users(id) on delete set null,
  guest_id uuid,
  reason text not null,
  status public.report_status not null default 'open',
  moderator_id uuid references auth.users(id) on delete set null,
  moderator_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint reports_reporter_present check (reporter_id is not null or guest_id is not null),
  constraint reports_reason_length check (char_length(reason) between 3 and 280)
);

create index entries_user_id_created_at_idx on public.entries (user_id, created_at desc);
create index entries_guest_id_created_at_idx on public.entries (guest_id, created_at desc);
create index entries_public_created_at_idx on public.entries (created_at desc)
  where visibility in ('public', 'anonymous') and hidden_at is null;
create index reports_status_created_at_idx on public.reports (status, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger entries_touch_updated_at
before update on public.entries
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Grateful human'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

alter table public.profiles enable row level security;
alter table public.entries enable row level security;
alter table public.reports enable row level security;

create policy "Profiles are publicly readable"
on public.profiles for select
using (true);

create policy "Users insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Public entries are readable"
on public.entries for select
using (hidden_at is null and visibility in ('public', 'anonymous'));

create policy "Users read their own entries"
on public.entries for select
using (auth.uid() = user_id);

create policy "Users insert their own entries"
on public.entries for insert
with check (auth.uid() = user_id and guest_id is null);

create policy "Guests insert guest entries"
on public.entries for insert
with check (auth.uid() is null and user_id is null and guest_id is not null);

create policy "Users update their own entries"
on public.entries for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users delete their own entries"
on public.entries for delete
using (auth.uid() = user_id);

create policy "Admins manage entries"
on public.entries for all
using (public.is_admin())
with check (public.is_admin());

create policy "Anyone can report visible entries"
on public.reports for insert
with check (
  (
    (auth.uid() is not null and reporter_id = auth.uid() and guest_id is null)
    or
    (auth.uid() is null and reporter_id is null and guest_id is not null)
  )
  and exists (
    select 1 from public.entries
    where entries.id = entry_id
      and entries.hidden_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);

create policy "Users read their own reports"
on public.reports for select
using (auth.uid() = reporter_id);

create policy "Admins manage reports"
on public.reports for all
using (public.is_admin())
with check (public.is_admin());
