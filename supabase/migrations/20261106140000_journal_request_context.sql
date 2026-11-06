begin;

-- One caller-scoped read; JWT verification and RLS remain with PostgREST.
create function public.journal_request_context(include_statistics boolean default true)
returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare
  viewer_id uuid := auth.uid();
  profile jsonb;
  quota jsonb;
begin
  if viewer_id is null then return null; end if;
  select jsonb_build_object(
    'id',p.id,'display_name',p.display_name,'username',p.username,
    'avatar_url',p.avatar_url,'bio',p.bio,'timezone',p.timezone,
    'onboarding_tour_seen_at',p.onboarding_tour_seen_at,
    'onboarding_completed_at',p.onboarding_completed_at,
    'calendar_tour_seen_at',p.calendar_tour_seen_at
  ) into profile from public.profiles p where p.id=viewer_id;
  if include_statistics and coalesce(auth.jwt()->>'is_anonymous','true')='false' then
    begin
      quota := public.get_entry_daily_quota();
    exception when others then
      -- Keep the composer available with its existing quota error/retry state.
      quota := null;
    end;
  end if;
  return jsonb_build_object('userId',viewer_id,'profile',profile,
    'statistics',case when include_statistics then public.journal_statistics() else null end,'quota',quota);
end;
$$;
revoke all on function public.journal_request_context(boolean) from public;
grant execute on function public.journal_request_context(boolean) to anon, authenticated;

commit;
