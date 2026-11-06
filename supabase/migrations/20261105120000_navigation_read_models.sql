begin;

create function public.feed_reaction_counts(entry_ids uuid[])
returns table(entry_id uuid, reaction_type text, count bigint)
language sql stable security definer set search_path = '' as $$
  select r.entry_id, r.reaction_type::text, count(*)
  from public.entry_reactions r join public.entries e on e.id = r.entry_id
  where e.id = any(entry_ids) and cardinality(entry_ids) <= 25
    and e.visibility in ('public', 'anonymous') and e.hidden_at is null and e.owner_deleted_at is null
  group by r.entry_id, r.reaction_type;
$$;
revoke all on function public.feed_reaction_counts(uuid[]) from public, anon, authenticated;
grant execute on function public.feed_reaction_counts(uuid[]) to service_role;

-- Invoker rights plus explicit scope: public statistics never include private entries,
-- even when the caller owns the profile or has moderation privileges.
create function public.journal_statistics(profile_id uuid default null, zone text default 'Asia/Ho_Chi_Minh', viewed_year integer default extract(year from now())::integer, viewed_month integer default extract(month from now())::integer)
returns jsonb language sql stable security invoker set search_path = '' as $$
 with visible as materialized (
   select created_at, visibility from public.entries
   where user_id = coalesce(profile_id, auth.uid())
     and hidden_at is null and owner_deleted_at is null
     and (profile_id is null or visibility in ('public', 'anonymous'))
 ), days as (
   select (created_at at time zone zone)::date as day, count(*) n from visible group by 1
 ), utc_days as (
   select distinct (created_at at time zone 'UTC')::date as day from visible
 ), runs as (
   select day, day - (row_number() over(order by day))::integer grp from days
 ), utc_runs as (
   select day, day - (row_number() over(order by day))::integer grp from utc_days
 ), local_streaks as (
   select min(day) first, max(day) last, count(*) n from runs group by grp
 ), utc_streaks as (
   select min(day) first, max(day) last, count(*) n from utc_runs group by grp
 ), bounds as (
   select (now() at time zone zone)::date today,
     make_date(viewed_year, viewed_month, 1) month_start,
     date_trunc('week', now() at time zone zone)::date week_start
 )
 select jsonb_build_object(
   'total', (select count(*) from visible),
   'publicTotal', (select count(*) from visible where visibility in ('public','anonymous')),
   'streak', coalesce((select n from utc_streaks where last = (now() at time zone 'UTC')::date and not exists(select 1 from utc_days where day > (now() at time zone 'UTC')::date)), 0),
   'currentStreak', coalesce((select (today - first + 1) from local_streaks where today between first and last), 0),
   'longestStreak', coalesce((select max(n) from local_streaks), 0),
   'yearBuckets', coalesce((select jsonb_object_agg(day::text,n) from days where day >= make_date(viewed_year,1,1) and day < make_date(viewed_year+1,1,1)), '{}'::jsonb),
   'weekBuckets', coalesce((select jsonb_object_agg(day::text,n) from days where day >= week_start and day < week_start + 7), '{}'::jsonb),
   'monthEntries', coalesce((select sum(n) from days where day >= month_start and day < month_start + interval '1 month'),0),
   'activeDaysThisMonth', (select count(*) from days where day >= month_start and day < month_start + interval '1 month'),
   'currentMonthActiveDays', (select count(*) from days where day >= date_trunc('month',today)::date and day <= today),
   'previous', coalesce((select sum(n) from days where day >= month_start - interval '1 month' and day < month_start),0)
 ) from bounds;
$$;
revoke all on function public.journal_statistics(uuid,text,integer,integer) from public;
grant execute on function public.journal_statistics(uuid,text,integer,integer) to anon, authenticated;

-- Fixed groups, stable (timestamp, UUID) cursors. No handwriting_data in result.
create function public.journal_page(profile_id uuid default null, public_only boolean default false, cursor_time timestamptz default null, cursor_id uuid default null, backwards boolean default false, target_id uuid default null)
returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare
  owner_id uuid := coalesce(profile_id, auth.uid());
  boundary_time timestamptz := cursor_time;
  boundary_id uuid := cursor_id;
  position bigint;
  total bigint;
  target_position bigint;
  records jsonb;
  first_row record;
  last_row record;
begin
  if (cursor_time is null) <> (cursor_id is null) then raise exception 'invalid_cursor'; end if;
  if target_id is not null then
    select e.created_at, e.id into boundary_time, boundary_id from public.entries e
    where e.id = target_id and e.user_id = owner_id and e.hidden_at is null and e.owner_deleted_at is null
      and (not (public_only or profile_id is not null) or e.visibility in ('public','anonymous'));
    if boundary_time is not null then
      select count(*) into target_position from public.entries e where e.user_id = owner_id and e.hidden_at is null and e.owner_deleted_at is null
        and (not (public_only or profile_id is not null) or e.visibility in ('public','anonymous')) and (e.created_at,e.id) > (boundary_time,boundary_id);
      select e.created_at,e.id into boundary_time,boundary_id from public.entries e where e.user_id=owner_id and e.hidden_at is null and e.owner_deleted_at is null
        and (not (public_only or profile_id is not null) or e.visibility in ('public','anonymous'))
        order by e.created_at desc,e.id desc offset ((target_position / 24) * 24) limit 1;
    end if;
  end if;
  select count(*) into total from public.entries e where e.user_id = owner_id and e.hidden_at is null and e.owner_deleted_at is null
    and (not (public_only or profile_id is not null) or e.visibility in ('public','anonymous'));
  with candidates as (
    select e.id,e.content,e.visibility,e.created_at,e.user_id,e.gratitudes,e.reflection,e.mood,e.washi,e.space,e.quote,e.sticker,e.image_url,e.entry_kind,e.handwriting_preview_url
    from public.entries e where e.user_id = owner_id and e.hidden_at is null and e.owner_deleted_at is null
      and (not (public_only or profile_id is not null) or e.visibility in ('public','anonymous'))
      and (boundary_time is null or
        case when target_id is not null then (e.created_at,e.id) <= (boundary_time,boundary_id)
             when backwards then (e.created_at,e.id) > (boundary_time,boundary_id)
             else (e.created_at,e.id) < (boundary_time,boundary_id) end)
    order by case when backwards and target_id is null then e.created_at end asc,
      case when backwards and target_id is null then e.id end asc, e.created_at desc,e.id desc limit 24
  ) select coalesce(jsonb_agg(to_jsonb(candidates) order by created_at desc,id desc),'[]'::jsonb) into records from candidates;
  if jsonb_array_length(records) = 0 and boundary_time is not null then
    return public.journal_page(profile_id,public_only,null,null,false,null);
  end if;
  select (r->>'created_at')::timestamptz created_at,(r->>'id')::uuid id into first_row from jsonb_array_elements(records) r limit 1;
  select (r->>'created_at')::timestamptz created_at,(r->>'id')::uuid id into last_row from jsonb_array_elements(records) with ordinality a(r,n) order by n desc limit 1;
  select count(*) into position from public.entries e where e.user_id=owner_id and e.hidden_at is null and e.owner_deleted_at is null
    and (not (public_only or profile_id is not null) or e.visibility in ('public','anonymous')) and (e.created_at,e.id) > (first_row.created_at,first_row.id);
  return jsonb_build_object('rows',records,'total',total,'start',position,
    'previous',case when position>0 then jsonb_build_object('time',first_row.created_at,'id',first_row.id,'backwards',true) else null end,
    'next',case when position+jsonb_array_length(records)<total and jsonb_array_length(records)>0 then jsonb_build_object('time',last_row.created_at,'id',last_row.id,'backwards',false) else null end);
end;
$$;
revoke all on function public.journal_page(uuid,boolean,timestamptz,uuid,boolean,uuid) from public;
grant execute on function public.journal_page(uuid,boolean,timestamptz,uuid,boolean,uuid) to anon, authenticated;
commit;
