import assert from "node:assert/strict";
import { dailyQuotaFailure, nextEntryQuotaReset } from "../lib/entries/daily-quota.ts";
import { feedPageQuerySchema } from "../lib/feed/validation.ts";
import { loadMoreFeed } from "../lib/api/feed.ts";

assert.equal(nextEntryQuotaReset(new Date("2026-10-28T16:59:59Z")), "2026-10-28T17:00:00.000Z");
assert.equal(nextEntryQuotaReset(new Date("2026-10-28T17:00:00Z")), "2026-10-29T17:00:00.000Z");
assert.equal(nextEntryQuotaReset(new Date("2026-12-31T23:00:00Z")), "2027-01-01T17:00:00.000Z");
const failure = dailyQuotaFailure(new Error("daily_entry_limit"), new Date("2026-10-28T16:59:59Z"));
assert.equal(failure?.body.code, "daily_entry_limit");
assert.equal(failure?.body.remaining, 0);
assert.equal(failure?.headers["Retry-After"], "1");
assert.equal(dailyQuotaFailure(new Error("network failure")), null);
for (const visibility of ["all", "anonymous", "public"]) {
  assert.equal(feedPageQuerySchema.parse({ cursor: null, visibility }).visibility, visibility);
}
assert.equal(feedPageQuerySchema.safeParse({ cursor: null, visibility: "private" }).success, false);
assert.equal(feedPageQuerySchema.parse({ cursor: null }).visibility, "all");
const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = (async (input) => {
    const url = new URL(String(input), "http://localhost");
    assert.equal(url.searchParams.get("visibility"), "anonymous");
    assert.equal(url.searchParams.get("cursor"), "2026-10-28T12:00:00Z");
    return Response.json({ items: [], nextCursor: null, requiresLogin: false });
  }) as typeof fetch;
  await loadMoreFeed("2026-10-28T12:00:00Z", "anonymous");
} finally { globalThis.fetch = originalFetch; }
console.log("feed filter and daily quota checks passed");
