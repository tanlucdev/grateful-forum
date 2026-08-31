create table public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_roles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_roles
    where user_id = auth.uid()
  );
$$;

create policy "Admins read admin roles"
on public.admin_roles for select
using (public.is_admin());

create policy "Admins manage admin roles"
on public.admin_roles for all
using (public.is_admin())
with check (public.is_admin());

alter table public.profiles drop column is_admin;
