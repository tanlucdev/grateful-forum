do $$
begin
  create type public.entry_reaction_type as enum ('empathy', 'healing_energy', 'refreshing');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.entry_reactions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  guest_id uuid,
  reaction_type public.entry_reaction_type not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint entry_reactions_actor_present check (
    (user_id is not null and guest_id is null)
    or (user_id is null and guest_id is not null)
  )
);

create table if not exists public.entry_bookmarks (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  guest_id uuid,
  created_at timestamptz not null default now(),
  constraint entry_bookmarks_actor_present check (
    (user_id is not null and guest_id is null)
    or (user_id is null and guest_id is not null)
  )
);

create unique index if not exists entry_reactions_user_entry_unique
on public.entry_reactions (entry_id, user_id)
where user_id is not null;

create unique index if not exists entry_reactions_guest_entry_unique
on public.entry_reactions (entry_id, guest_id)
where guest_id is not null;

create index if not exists entry_reactions_entry_type_idx
on public.entry_reactions (entry_id, reaction_type);

create unique index if not exists entry_bookmarks_user_entry_unique
on public.entry_bookmarks (entry_id, user_id)
where user_id is not null;

create unique index if not exists entry_bookmarks_guest_entry_unique
on public.entry_bookmarks (entry_id, guest_id)
where guest_id is not null;

create trigger entry_reactions_touch_updated_at
before update on public.entry_reactions
for each row execute function public.touch_updated_at();

alter table public.entry_reactions enable row level security;
alter table public.entry_bookmarks enable row level security;

create policy "Users read their own entry reactions"
on public.entry_reactions for select
using (auth.uid() is not null and user_id = auth.uid());

create policy "Users insert their own entry reactions"
on public.entry_reactions for insert
with check (
  auth.uid() is not null
  and user_id = auth.uid()
  and guest_id is null
  and exists (
    select 1 from public.entries
    where entries.id = entry_id
      and entries.hidden_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);

create policy "Users update their own entry reactions"
on public.entry_reactions for update
using (auth.uid() is not null and user_id = auth.uid())
with check (
  auth.uid() is not null
  and user_id = auth.uid()
  and guest_id is null
  and exists (
    select 1 from public.entries
    where entries.id = entry_id
      and entries.hidden_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);

create policy "Users delete their own entry reactions"
on public.entry_reactions for delete
using (auth.uid() is not null and user_id = auth.uid());

create policy "Users read their own entry bookmarks"
on public.entry_bookmarks for select
using (auth.uid() is not null and user_id = auth.uid());

create policy "Users insert their own entry bookmarks"
on public.entry_bookmarks for insert
with check (
  auth.uid() is not null
  and user_id = auth.uid()
  and guest_id is null
  and exists (
    select 1 from public.entries
    where entries.id = entry_id
      and entries.hidden_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);

create policy "Users delete their own entry bookmarks"
on public.entry_bookmarks for delete
using (auth.uid() is not null and user_id = auth.uid());

with ranked as (
  select id, row_number() over (
    partition by entry_id, reporter_id
    order by created_at desc, id desc
  ) as row_number
  from public.reports
  where reporter_id is not null
)
delete from public.reports
using ranked
where reports.id = ranked.id
  and ranked.row_number > 1;

with ranked as (
  select id, row_number() over (
    partition by entry_id, guest_id
    order by created_at desc, id desc
  ) as row_number
  from public.reports
  where guest_id is not null
)
delete from public.reports
using ranked
where reports.id = ranked.id
  and ranked.row_number > 1;

create unique index if not exists reports_reporter_entry_unique
on public.reports (entry_id, reporter_id)
where reporter_id is not null;

create unique index if not exists reports_guest_entry_unique
on public.reports (entry_id, guest_id)
where guest_id is not null;

drop policy if exists "Anyone can report visible entries" on public.reports;

create policy "Users can report visible entries"
on public.reports for insert
with check (
  auth.uid() is not null
  and reporter_id = auth.uid()
  and guest_id is null
  and exists (
    select 1 from public.entries
    where entries.id = entry_id
      and entries.hidden_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);

create policy "Users update their own reports"
on public.reports for update
using (auth.uid() is not null and reporter_id = auth.uid())
with check (
  auth.uid() is not null
  and reporter_id = auth.uid()
  and guest_id is null
  and exists (
    select 1 from public.entries
    where entries.id = entry_id
      and entries.hidden_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);
