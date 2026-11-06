import assert from "node:assert/strict";
import { feedPageQuerySchema } from "../lib/feed/validation.ts";
import { loadMoreFeed } from "../lib/api/feed.ts";

for (const visibility of ["all", "anonymous", "public"] as const) {
  assert.equal(feedPageQuerySchema.parse({ cursor: null, visibility }).visibility, visibility);
  const original = globalThis.fetch;
  try {
    globalThis.fetch = (async (input) => {
      const url = new URL(String(input), "http://localhost");
      assert.equal(url.searchParams.get("visibility"), visibility);
      assert.equal(url.searchParams.get("cursor"), "2026-10-28T12:00:00Z");
      return Response.json({ items: [], nextCursor: null, requiresLogin: false });
    }) as typeof fetch;
    await loadMoreFeed("2026-10-28T12:00:00Z", visibility);
  } finally { globalThis.fetch = original; }
}
for (const visibility of ["private", "", "unknown"]) {
  assert.equal(feedPageQuerySchema.safeParse({ cursor: null, visibility }).success, false);
}
assert.equal(feedPageQuerySchema.parse({ cursor: null }).visibility, "all");
console.log("feed visibility validation and pagination request checks passed");
