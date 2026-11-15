# Feed, posting allowance and capacity

## Contract

- `GET /api/feed?visibility=all|anonymous|public&cursor=...`: defaults to `all`; `public` means named shares. Invalid filters return 400. Filtering precedes pagination; private entries remain excluded. Guests receive at most five entries, without pagination or author identity for anonymous shares.
- `GET /api/entries/quota`: authenticated members only. Returns `{ limit: 3, remaining, resetsAt }`; responses are private/no-store. Unavailable database support returns 503, never an invented allowance.
- Both `POST /api/entries` and `POST /api/entries/handwritten` return 429 with `{ code: "daily_entry_limit", error, limit: 3, remaining: 0, resetsAt }` and `Retry-After` seconds when exhausted. Existing success contracts are unchanged.

Three entries per member per calendar day in `Asia/Ho_Chi_Minh`, resetting at midnight (17:00 UTC). Text and handwriting, all visibility levels, share one allowance. Deletion and moderation do not refund it; edits and privileged transfer of existing guest entries do not consume it. The database assigns insertion timestamps and protects owner/date fields. The UI preserves the current draft when quota checks or saves fail; this does not promise persistence after closing/reloading a text draft.

Apply `supabase/migrations/20261028120000_daily_entry_limit.sql` before deploying the new UI/API. It seeds today's usage from existing rows, including hidden/soft-deleted entries. Previously hard-deleted entries cannot be reconstructed. Counter increments and inserts commit/roll back together; conflicting inserts serialize on the user's daily counter. The counter table has no client write permission. Normal member-only entry RLS remains required. Privileged database owners can always change policy/data.

Checks: `npm run test:logic`, `npm run typecheck`, `npm run lint`, `npm run build`; isolated PostgreSQL concurrency check: `node tests/daily-quota-db.test.mjs` (requires `initdb`, `pg_ctl`, `psql`; creates/stops/removes its own temporary cluster, touches no application database).

## Capacity assessment

500 stored accounts is a small dataset for PostgreSQL/Supabase. 100 concurrently online users may be reasonable on suitably provisioned Next.js and Supabase hosting, but this repository alone cannot establish latency, error rate or a safe concurrency ceiling. Provider plan, region, connection limits, CPU/RAM, bandwidth and production metrics are unknown. No production load test was run.

100 online users are not 100 requests/second. An illustrative 100 users making one request every 5–10 seconds generate roughly 10–20 requests/second; synchronized refreshes produce a much larger burst. At the new limit, 500 accounts can still create 1,500 entries/day (547,500/year if sustained).

Concrete risks from source review:

- `lib/feed/queries.ts`: pages are bounded to eight entries, with supporting indexes. Auth, profiles, aggregate reaction rows, viewer reactions and bookmarks involve several round trips, some sequential. Reaction counts load individual rows; PostgREST's configured row cap can truncate totals for popular posts. Aggregate counts in SQL before large engagement volume.
- `lib/profile/load-own-profile.ts`: dashboard reads all own entries, including handwriting JSON; shell reads all entry dates for streaks. `lib/calendar/queries.ts` also reads lifetime history. These grow with account age and should become bounded pages/SQL aggregates before long histories dominate responses.
- `app/api/auth/register/route.ts`: public registration calls the admin create-user API with email auto-confirmation, with no application rate limit/CAPTCHA. A burst of 500 registrations depends on Auth capacity; the three-post limit does not prevent multi-account abuse. Add shared rate limiting and an appropriate signup verification policy before opening registration widely.
- `lib/entry-media/mutations.ts`: uploads pass through Next.js to Cloudflare R2, with a 20-second upstream timeout. Concurrent image uploads consume much more server bandwidth/memory than text posts; existing public preview upload may become orphaned if a competing save takes the last allowance.

Before claiming support for 100 concurrent users, test an isolated staging deployment with representative history/images/reactions: ramp 10, 25, 50, 100 virtual users, hold 100 for 10 minutes with realistic think time, then test synchronized refresh/signup and media separately. Track feed/save p50/p95/p99, 5xx, expected 429s separately, database CPU/connections/locks, Auth limits and hosting memory/bandwidth. Suggested acceptance targets to agree on: read p95 <1s, text-save p95 <1.5s, unexpected error rate <1%, no quota bypass, no resource saturation. These are targets, not measured results.
