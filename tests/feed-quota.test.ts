import assert from "node:assert/strict";
import { dailyQuotaFailure, nextEntryQuotaReset } from "../lib/entries/daily-quota.ts";

assert.equal(nextEntryQuotaReset(new Date("2026-10-28T16:59:59Z")), "2026-10-28T17:00:00.000Z");
assert.equal(nextEntryQuotaReset(new Date("2026-10-28T17:00:00Z")), "2026-10-29T17:00:00.000Z");
assert.equal(nextEntryQuotaReset(new Date("2026-12-31T23:00:00Z")), "2027-01-01T17:00:00.000Z");
const failure = dailyQuotaFailure(new Error("daily_entry_limit"), new Date("2026-10-28T16:59:59Z"));
assert.equal(failure?.body.code, "daily_entry_limit");
assert.equal(failure?.body.remaining, 0);
assert.equal(failure?.headers["Retry-After"], "1");
assert.equal(dailyQuotaFailure(new Error("network failure")), null);
console.log("daily quota reset and HTTP error checks passed");
