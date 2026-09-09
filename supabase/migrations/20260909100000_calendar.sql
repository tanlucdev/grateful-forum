create index if not exists entries_user_visible_created_at_idx
on public.entries (user_id, created_at desc)
where hidden_at is null;

alter table public.profiles
add column if not exists timezone text not null default 'Asia/Ho_Chi_Minh';
