# Preview and member-only writing

Verification and migration reports below are historical session notes. They do not establish the migration history or deployment status of the current environment. Recheck each branch at its exact commit before rollout.

Guests may read at most five real public/anonymous posts at `/[locale]/feed/preview`, without pagination or interaction controls. The preview has its own header and no member navigation or personal statistics. Cards remain shared with the full feed.

Writing text, handwriting, or uploading an image requires a valid, non-anonymous Supabase account. Anonymous **post visibility** remains available to members. Supabase anonymous **accounts** cannot write. All three POST endpoints (`/api/entries`, `/api/entries/handwritten`, `/api/entry-media`) return HTTP `401` with `{ "code": "auth_required", "error": "Sign in to write." }` before parsing or uploading when authentication is absent or anonymous. Existing input validation and successful responses remain unchanged for members.

`/[locale]/write` checks authentication before loading onboarding or rendering the composer. Write links preserve the locale and return to `/write` through `auth?next=...`. A valid `tour=first-entry` query survives direct-route authentication; invalid tour values are discarded. Preview invitations return to the full feed instead. Guests entering `/feed` redirect to preview; members entering preview redirect to `/feed`.

If authentication expires during composition, text, ink and selected image remain in the current tab. The error provides a new-tab sign-in link. Return to the original tab and save again. This uses existing component state; closing/reloading the original tab is outside this guarantee. No draft subsystem was added.

Legacy guest entries remain stored. Their existing account-transfer path uses an admin update and remains intact. Public read policies and admin policies remain unchanged.

## Rollout

Apply `supabase/migrations/20261025120000_member_only_entry_creation.sql` **before** deploying the app. This drops only the guest insert policy and replaces the owner insert policy with an authenticated owner check plus `is_anonymous = false` from the signed JWT. Existing application versions will consequently fail guest saves once the migration is applied.

Migration was applied to the linked `be-grateful` Supabase project on 2026-10-25. Direct database checks passed with actual `anon`/`authenticated` RLS roles and transaction-local JWT claims; all test writes were rolled back. The user subsequently limited the remaining scope to local testing. No application deployment or production-browser verification was performed. The migration had already been applied before that clarification.

## Repeatable verification

Run the app at the chosen port, then:

```bash
npm run test:logic
npm run typecheck
npm run lint
npm run build
ENTRY_TEST_BASE_URL=http://localhost:4317 node --experimental-strip-types tests/entry-access-http.test.ts
FEED_TEST_BASE_URL=http://localhost:4317 node --experimental-strip-types tests/feed-access-http.test.ts
supabase db query --linked --file tests/sql/member-entry-access.sql
```

The SQL check creates an isolated member fixture inside its transaction. It checks guest and anonymous-account rejection, all three member visibility modes, wrong-owner rejection and legacy transfer, then rolls back the fixture and all writes. Run with SQL errors treated as failures; never select a real account as a fixture.

The following explicitly creates a disposable account, saves images and text/handwriting in all visibility modes against the real configured services, checks member feed access, then deletes its account, entries and R2 assets:

```bash
ENTRY_TEST_LIVE=1 ENTRY_TEST_BASE_URL=http://localhost:4317 node --env-file=.env --experimental-strip-types tests/member-entry-http.test.ts
```

Local HTTP checks and live member checks passed. Chromium verified both locales at 320, 390, 767, 768×1024, 769, 820, 1023, 1024×768, 1025, 1280 and 1440 CSS pixels: no page overflow, at most five visible cards, preview-only header, header targets at least 44×44, and guest redirects. A browser check removed session cookies during composition: writing and selected image survived the 401, signing in in a new tab returned to localized `/write`, and retry saved both successfully. Test accounts and images were removed.

The integrated Browser failed to initialize (`Cannot redefine property: process`); checks used standalone headless Chromium. Actual anonymous-account HTTP checks were blocked by Supabase `anonymous_provider_disabled`; database-level anonymous rejection was verified using RLS roles/JWT claims. Production deployment is outside the final requested scope. Long unbroken author names and journal text passed local DOM-fixture checks in both locales at every requested width and breakpoint boundary. The actual empty-state component was rendered in isolation and passed browser checks in both locales at all requested widths; a completely empty database was not exercised end to end.
