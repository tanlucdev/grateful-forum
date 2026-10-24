import assert from "node:assert/strict";
import { feedAccess, FeedLoginRequiredError } from "../lib/feed/access.ts";

assert.deepEqual(feedAccess(false), { pageSize: 5, requiresLogin: true });
assert.deepEqual(feedAccess(false, null), { pageSize: 5, requiresLogin: true });
for (const cursor of ["2026-10-23T00:00:00Z", "arbitrary-cursor"]) {
  assert.throws(() => feedAccess(false, cursor), FeedLoginRequiredError);
  assert.deepEqual(feedAccess(true, cursor), { pageSize: 8, requiresLogin: false });
}
assert.deepEqual(feedAccess(true), { pageSize: 8, requiresLogin: false });

console.log("feed access checks passed");
