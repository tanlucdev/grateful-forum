alter table public.profiles
  add column if not exists onboarding_tour_seen_at timestamptz,
  add column if not exists onboarding_completed_at timestamptz;

update public.profiles
set onboarding_tour_seen_at = now()
where onboarding_tour_seen_at is null;

create or replace function public.complete_onboarding_after_first_entry()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.user_id is not null then
    update public.profiles
    set onboarding_completed_at = coalesce(onboarding_completed_at, now())
    where id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists entries_complete_onboarding_after_first_entry on public.entries;
create trigger entries_complete_onboarding_after_first_entry
after insert on public.entries
for each row execute function public.complete_onboarding_after_first_entry();
