alter table public.entries
  add column if not exists gratitudes text[],
  add column if not exists reflection text,
  add column if not exists mood text,
  add column if not exists washi text,
  add column if not exists space text,
  add column if not exists quote text,
  add column if not exists sticker text,
  add column if not exists image_url text;

alter table public.entries
  drop constraint if exists entries_content_length;

alter table public.entries
  add constraint entries_content_length check (char_length(content) between 1 and 10000),
  add constraint entries_gratitudes_length check (gratitudes is null or array_length(gratitudes, 1) = 3);

insert into storage.buckets (id, name, public)
values ('entry-media', 'entry-media', true)
on conflict (id) do update
set public = excluded.public;
