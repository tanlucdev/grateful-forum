alter table public.entries
  add column if not exists entry_kind text not null default 'text',
  add column if not exists handwriting_data jsonb,
  add column if not exists handwriting_preview_url text,
  add column if not exists handwriting_orientation text;

alter table public.entries
  drop constraint if exists entries_entry_kind_check,
  add constraint entries_entry_kind_check check (entry_kind in ('text', 'handwritten')),
  drop constraint if exists entries_handwritten_data_check,
  add constraint entries_handwritten_data_check check (
    entry_kind = 'text' or (
      handwriting_data is not null
      and handwriting_orientation in ('portrait', 'landscape')
    )
  );
