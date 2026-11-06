begin;

-- Resolve the caller's timezone inside the aggregate; preserve explicit calendar/public inputs.
create or replace function public.journal_statistics(profile_id uuid default null, zone text default null, viewed_year integer default null, viewed_month integer default null)
returns jsonb language sql stable security invoker set search_path = '' as $$
 with settings as (
   select coalesce(
     zone,
     (select p.timezone from public.profiles p where p.id=coalesce(profile_id,auth.uid()) and exists(select 1 from pg_catalog.pg_timezone_names t where t.name=p.timezone)),
     'Asia/Ho_Chi_Minh'
   ) timezone
 ), period as (
   select timezone,
     coalesce(viewed_year,extract(year from now() at time zone timezone)::integer) as year,
     coalesce(viewed_month,extract(month from now() at time zone timezone)::integer) as month
   from settings
 ), visible as materialized (
   select created_at, visibility from public.entries
   where user_id = coalesce(profile_id, auth.uid())
     and hidden_at is null and owner_deleted_at is null
     and (profile_id is null or visibility in ('public', 'anonymous'))
 ), days as (
   select (created_at at time zone (select timezone from period))::date as day, count(*) n from visible group by 1
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
   select (now() at time zone (select timezone from period))::date today,
     make_date((select year from period),(select month from period),1) month_start,
     date_trunc('week', now() at time zone (select timezone from period))::date week_start
 )
 select jsonb_build_object(
   'timezone', (select timezone from period),
   'total', (select count(*) from visible),
   'publicTotal', (select count(*) from visible where visibility in ('public','anonymous')),
   'streak', coalesce((select n from utc_streaks where last = (now() at time zone 'UTC')::date and not exists(select 1 from utc_days where day > (now() at time zone 'UTC')::date)), 0),
   'currentStreak', coalesce((select (today - first + 1) from local_streaks where today between first and last), 0),
   'longestStreak', coalesce((select max(n) from local_streaks), 0),
   'yearBuckets', coalesce((select jsonb_object_agg(day::text,n) from days where day >= make_date((select year from period),1,1) and day < make_date((select year from period)+1,1,1)), '{}'::jsonb),
   'weekBuckets', coalesce((select jsonb_object_agg(day::text,n) from days where day >= week_start and day < week_start + 7), '{}'::jsonb),
   'monthEntries', coalesce((select sum(n) from days where day >= month_start and day < month_start + interval '1 month'),0),
   'activeDaysThisMonth', (select count(*) from days where day >= month_start and day < month_start + interval '1 month'),
   'currentMonthActiveDays', (select count(*) from days where day >= date_trunc('month',today)::date and day <= today),
   'previous', coalesce((select sum(n) from days where day >= month_start - interval '1 month' and day < month_start),0)
 ) from bounds;
$$;
commit;
