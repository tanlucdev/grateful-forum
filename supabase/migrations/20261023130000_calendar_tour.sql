alter table public.profiles
  add column if not exists calendar_tour_seen_at timestamptz;
