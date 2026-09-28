alter table public.entries
  add column if not exists owner_deleted_at timestamptz;

drop index if exists public.entries_public_created_at_idx;
create index entries_public_created_at_idx on public.entries (created_at desc)
  where visibility in ('public', 'anonymous')
    and hidden_at is null
    and owner_deleted_at is null;

drop index if exists public.entries_user_visible_created_at_idx;
create index entries_user_visible_created_at_idx on public.entries (user_id, created_at desc)
  where hidden_at is null
    and owner_deleted_at is null;

drop policy if exists "Public entries are readable" on public.entries;
create policy "Public entries are readable"
on public.entries for select
using (
  hidden_at is null
  and owner_deleted_at is null
  and visibility in ('public', 'anonymous')
);

drop policy if exists "Users read their own entries" on public.entries;
create policy "Users read their own entries"
on public.entries for select
using (auth.uid() = user_id and owner_deleted_at is null);

drop policy if exists "Users update their own entries" on public.entries;
create policy "Users update their own entries"
on public.entries for update
using (auth.uid() = user_id and owner_deleted_at is null)
with check (auth.uid() = user_id);

drop policy if exists "Users can report visible entries" on public.reports;
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
      and entries.owner_deleted_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);

drop policy if exists "Users update their own reports" on public.reports;
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
      and entries.owner_deleted_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);

drop policy if exists "Users insert their own entry reactions" on public.entry_reactions;
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
      and entries.owner_deleted_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);

drop policy if exists "Users read their own entry reactions" on public.entry_reactions;
create policy "Users read their own entry reactions"
on public.entry_reactions for select
using (
  auth.uid() is not null
  and user_id = auth.uid()
  and exists (
    select 1 from public.entries
    where entries.id = entry_id
      and entries.hidden_at is null
      and entries.owner_deleted_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);

drop policy if exists "Users update their own entry reactions" on public.entry_reactions;
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
      and entries.owner_deleted_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);

drop policy if exists "Users insert their own entry bookmarks" on public.entry_bookmarks;
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
      and entries.owner_deleted_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);

drop policy if exists "Users read their own entry bookmarks" on public.entry_bookmarks;
create policy "Users read their own entry bookmarks"
on public.entry_bookmarks for select
using (
  auth.uid() is not null
  and user_id = auth.uid()
  and exists (
    select 1 from public.entries
    where entries.id = entry_id
      and entries.hidden_at is null
      and entries.owner_deleted_at is null
      and entries.visibility in ('public', 'anonymous')
  )
);
