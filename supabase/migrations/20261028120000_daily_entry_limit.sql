begin;

-- A durable counter survives entry deletion; the upsert serializes concurrent inserts.
create table public.entry_daily_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  used integer not null check (used >= 0),
  primary key (user_id, day)
);
alter table public.entry_daily_usage enable row level security;
revoke all on public.entry_daily_usage from anon, authenticated;

-- Include existing hidden and soft-deleted entries in today's allowance.
lock table public.entries in share row exclusive mode;
insert into public.entry_daily_usage (user_id, day, used)
select user_id, (created_at at time zone 'Asia/Ho_Chi_Minh')::date, count(*)::integer
from public.entries
where user_id is not null
  and created_at >= (date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh')
group by user_id, (created_at at time zone 'Asia/Ho_Chi_Minh')::date;

create function public.enforce_daily_entry_limit()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  usage_day date;
  consumed integer;
begin
  if tg_op = 'UPDATE' then
    -- Preserve the privileged legacy guest-transfer workflow, not owner transfers.
    if (old.user_id is not null and new.user_id is distinct from old.user_id) or new.created_at is distinct from old.created_at then
      raise exception 'entry_identity_immutable' using errcode = '23514';
    end if;
    return new;
  end if;
  if new.user_id is null then
    -- Member-only RLS rejects guest writes; maintenance can still migrate legacy rows.
    return new;
  end if;
  new.created_at := clock_timestamp();
  usage_day := (new.created_at at time zone 'Asia/Ho_Chi_Minh')::date;
  insert into public.entry_daily_usage as usage (user_id, day, used)
  values (new.user_id, usage_day, 1)
  on conflict (user_id, day) do update set used = usage.used + 1
    where usage.used < 3
  returning used into consumed;
  if consumed is null then
    raise exception 'daily_entry_limit' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
revoke all on function public.enforce_daily_entry_limit() from public;
create trigger entries_daily_limit before insert or update on public.entries
for each row execute function public.enforce_daily_entry_limit();

create function public.get_entry_daily_quota()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'limit', 3,
    'remaining', greatest(0, 3 - coalesce((
      select used from public.entry_daily_usage
      where user_id = auth.uid() and day = (now() at time zone 'Asia/Ho_Chi_Minh')::date
    ), 0)),
    'resetsAt', ((now() at time zone 'Asia/Ho_Chi_Minh')::date + 1)::timestamp at time zone 'Asia/Ho_Chi_Minh'
  ) where auth.uid() is not null and coalesce(auth.jwt()->>'is_anonymous', 'true') = 'false';
$$;
revoke all on function public.get_entry_daily_quota() from public, anon;
grant execute on function public.get_entry_daily_quota() to authenticated;

create index entries_feed_visibility_cursor_idx on public.entries (visibility, created_at desc, id desc)
where hidden_at is null and owner_deleted_at is null and visibility in ('public', 'anonymous');

commit;
