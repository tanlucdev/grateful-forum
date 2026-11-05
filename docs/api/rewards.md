# Rewards API

`GET /api/rewards` uses the existing Supabase session cookie. No request body or query parameters. The server chooses the authenticated user; callers cannot request another user's rewards.

Responses: `200` overview; `400 invalid_query`; `401 auth_required`; `503 rewards_unavailable` for missing configuration; `500 rewards_failed` when storage fails. Every response uses `Cache-Control: private, no-store`. Error bodies contain a locale-neutral `code` and `error`.

The overview contains `timezone`, `stats` (`currentStreak`, `longestStreak`, `totalEntries`, `activeDays`, `activeMonths`, `earnedBadges`) and twelve `badges`. Each badge contains `id`, `category`, `status` (`earned`, `growing`, `locked`), `current`, `total`, `unit`, `earnedAt` (ISO timestamp or null). Copy and date/number formatting belong to the client locale. No journal content, entry IDs or user IDs are returned.

Rules use the profile timezone, falling back to Asia/Ho_Chi_Minh. Only owned entries that are neither hidden nor owner-deleted and were created no later than the evaluation time count. Current streak includes yesterday while today is still open. Duplicate entries on a local day count once toward streaks, morning practice and active days.

| Badge | Requirement |
| --- | --- |
| 1 | First entry |
| 2, 3, 4, 7, 8, 11 | Consecutive-day streak of 3, 7, 14, 21, 30, 100 |
| 5 | Write again after at least one skipped local calendar day |
| 6 | Three nonblank gratitude items across entries in one local day |
| 9 | Write before 08:00 on ten distinct local days |
| 10 | Five anonymous entries |
| 12 | Write on 365 distinct local days; consecutive days not required |

Earned dates identify the first qualifying entry. A later broken streak does not revoke an earned badge; unfinished streak progress follows the current streak. Other unfinished progress reflects its accumulated criterion. Progress is capped at the target. Zero progress is locked; positive unfinished progress is growing.

Rewards are derived on every request and server page render. No additional migration or claim action is needed. Editing, deleting or hiding qualifying entries can change progress or revoke a badge; this is a reflection of current journal history, not an immutable award ledger. Handwritten and legacy entries count for writing-based milestones; only stored gratitude items count toward badge 6. Reads paginate to avoid Supabase's default row cap.

## Local integration check

The committed Postman simulation replaces Supabase only. The real Next.js API, SDK requests, auth guard, repository, pagination and reward calculations still run. Fixtures are synthetic; this does not verify production JWT signatures or deployed RLS/schema.

Run the following in separate terminals, with any existing development server stopped:

```sh
postman simulation run postman/simulations/rewards.sim.yaml --port 4011 --no-history
NEXT_PUBLIC_SUPABASE_URL=http://localhost:4011/supabase NEXT_PUBLIC_SUPABASE_ANON_KEY=fixture-key npm run dev -- --port 3001
node tests/rewards-api.mjs
```

`fixture-key` and the fixture JWT are deliberately invalid outside the local stand-in. Never configure a deployed app with them. The test checks anonymous rejection, forbidden query parameters, private/no-store responses, 1,118 eligible entries over three pages (including cursor ties), owner/deletion/moderation/future filters, empty history and storage errors. Restore normal app environment by stopping the test server and restarting `npm run dev` without overrides. Run `npm run test:logic` for deterministic timezone, DST, streak and badge-rule checks.
