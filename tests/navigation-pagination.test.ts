import assert from "node:assert/strict";
import { profileQuerySchema, journalPageHref } from "../lib/profile/pagination.ts";

const cursor = { time: "2026-11-05T00:00:00.123456+00:00", id: "00000000-0000-4000-8000-000000000001", backwards: false };
assert.equal(profileQuerySchema.safeParse({ cursor: "{" }).success, false);
assert.equal(profileQuerySchema.safeParse({ cursor: JSON.stringify({ ...cursor, time: "invalid" }) }).success, false);
assert.equal(profileQuerySchema.safeParse({ cursor: JSON.stringify({ ...cursor, id: "bad" }) }).success, false);
assert.equal(profileQuerySchema.safeParse({ cursor: JSON.stringify({ ...cursor, backwards: "false" }) }).success, false);
const url = new URL(journalPageHref("/profile", "tab=public&filter=all&entry=obsolete", cursor, "last"), "http://test");
assert.equal(url.searchParams.get("tab"), "public");
assert.equal(url.searchParams.get("filter"), "all");
assert.equal(url.searchParams.has("entry"), false);
assert.deepEqual(profileQuerySchema.parse(Object.fromEntries(url.searchParams)), { tab: "public", cursor, edge: "last" });
assert.deepEqual(profileQuerySchema.parse({}), { tab: "all" });
console.log("navigation pagination checks passed");
