import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createOnboardingSeenHandler } from "../lib/onboarding/seen-handler.ts";
import { createCalendarSeenHandler } from "../lib/onboarding/calendar-seen-handler.ts";
import { calendarTourSelectors, shouldStartCalendarTour } from "../lib/onboarding/calendar-tour.ts";
import { shouldStartFirstEntryTour } from "../lib/onboarding/eligibility.ts";

assert.equal(shouldStartFirstEntryTour({ onboardingCompletedAt: null, replay: false, signedIn: true, tourSeenAt: null }), true);
assert.equal(shouldStartFirstEntryTour({ onboardingCompletedAt: null, replay: false, signedIn: true, tourSeenAt: "2026-10-23T00:00:00.000Z" }), false);
assert.equal(shouldStartFirstEntryTour({ onboardingCompletedAt: "2026-10-23T00:00:00.000Z", replay: false, signedIn: true, tourSeenAt: null }), false);
assert.equal(shouldStartFirstEntryTour({ onboardingCompletedAt: "2026-10-23T00:00:00.000Z", replay: true, signedIn: true, tourSeenAt: "2026-10-23T00:00:00.000Z" }), true);
assert.equal(shouldStartCalendarTour({ hasLocalSeen: false, tourSeenAt: null }), true);
assert.equal(shouldStartCalendarTour({ hasLocalSeen: false, tourSeenAt: "2026-10-23T00:00:00.000Z" }), false);
assert.equal(shouldStartCalendarTour({ hasLocalSeen: true, tourSeenAt: null }), false);
assert.equal(calendarTourSelectors.desktop.length, 4);
assert.equal(calendarTourSelectors.mobile.length, 4);
assert.ok(calendarTourSelectors.desktop.every((selector) => selector.includes("calendar-desktop-")));
assert.ok(calendarTourSelectors.mobile.every((selector) => selector.includes("calendar-mobile-")));

const unauthenticated = createOnboardingSeenHandler({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }),
  isConfigured: () => true,
  recordSeen: async () => assert.fail("must not update an unauthenticated user"),
});
assert.equal((await unauthenticated(new Request("http://test/api/onboarding/seen", { body: "{}", method: "POST" }))).status, 401);

const invalidBody = createOnboardingSeenHandler({
  createClient: async () => assert.fail("must not create a client for invalid input") as never,
  isConfigured: () => true,
  recordSeen: async () => assert.fail("must not update invalid input"),
});
assert.equal((await invalidBody(new Request("http://test/api/onboarding/seen", { body: '{"extra":true}', method: "POST" }))).status, 400);

let seenUserId = "";
const seen = createOnboardingSeenHandler({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: { id: "user-1" } } }) },
  }),
  isConfigured: () => true,
  recordSeen: async (_, userId) => { seenUserId = userId; },
});
const seenResponse = await seen(new Request("http://test/api/onboarding/seen", { body: "{}", method: "POST" }));
assert.equal(seenResponse.status, 200);
assert.deepEqual(await seenResponse.json(), { seen: true });
assert.equal(seenUserId, "user-1");

const calendarUnauthenticated = createCalendarSeenHandler({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }),
  isConfigured: () => true,
  recordSeen: async () => assert.fail("must not update an unauthenticated user"),
});
assert.equal((await calendarUnauthenticated(new Request("http://test/api/onboarding/calendar/seen", { body: "{}", method: "POST" }))).status, 401);

const calendarInvalidBody = createCalendarSeenHandler({
  createClient: async () => assert.fail("must not create a client for invalid input") as never,
  isConfigured: () => true,
  recordSeen: async () => assert.fail("must not update invalid input"),
});
assert.equal((await calendarInvalidBody(new Request("http://test/api/onboarding/calendar/seen", { body: '{"extra":true}', method: "POST" }))).status, 400);

let calendarSeenUserId = "";
const calendarSeen = createCalendarSeenHandler({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: { id: "user-calendar" } } }) },
  }),
  isConfigured: () => true,
  recordSeen: async (_, userId) => { calendarSeenUserId = userId; },
});
const calendarSeenResponse = await calendarSeen(new Request("http://test/api/onboarding/calendar/seen", { body: "{}", method: "POST" }));
assert.equal(calendarSeenResponse.status, 200);
assert.deepEqual(await calendarSeenResponse.json(), { seen: true });
assert.equal(calendarSeenUserId, "user-calendar");

const migration = await readFile(new URL("../supabase/migrations/20261023120000_onboarding_tour.sql", import.meta.url), "utf8");
assert.match(migration, /after insert on public\.entries/);
assert.match(migration, /if new\.user_id is not null then/);
assert.match(migration, /where id = new\.user_id/);
assert.doesNotMatch(migration, /entry_kind/);

const calendarMigration = await readFile(new URL("../supabase/migrations/20261023130000_calendar_tour.sql", import.meta.url), "utf8");
assert.match(calendarMigration, /calendar_tour_seen_at timestamptz/);
assert.doesNotMatch(calendarMigration, /update public\.profiles/i);

console.log("onboarding checks passed");
