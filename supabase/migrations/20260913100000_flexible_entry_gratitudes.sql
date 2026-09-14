alter table public.entries
  drop constraint if exists entries_gratitudes_length;

alter table public.entries
  add constraint entries_gratitudes_length check (coalesce(array_length(gratitudes, 1), 0) <= 10);
