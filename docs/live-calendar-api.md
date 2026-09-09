# Live Calendar Data API

- `GET /api/calendar` validates `year`, `month`, `date`, `view`, returns `CalendarOverview`, and sends `Cache-Control: no-store`.
- `/calendar` SSR calls `loadCalendarOverview`, the same service used by the API.
- `/calendar/sample` renders `sampleCalendarOverview` only.
- Calendar data is derived from visible owner `entries`; no separate calendar table.
- Supabase migration adds `profiles.timezone` and `entries_user_visible_created_at_idx`.
- Pure stats live in `lib/calendar/stats.ts`; Supabase calls stay in `lib/calendar/queries.ts`.
