import assert from "node:assert/strict";
import type { FeedPage } from "../lib/feed/dto.ts";

const base = process.env.FEED_TEST_BASE_URL ?? "http://localhost:3000";
const guestRequest = { cache: "no-store", redirect: "manual" } as const;
const response = await fetch(`${base}/api/feed`, guestRequest);
assert.equal(response.status, 200);
assert.match(response.headers.get("cache-control") ?? "", /private.*no-store/);
const page = await response.json() as FeedPage;
assert.ok(page.items.length <= 5);
assert.equal(page.requiresLogin, true);
assert.equal(page.nextCursor, null);

for (const cursor of ["2026-10-01T00:00:00Z", "arbitrary-cursor"]) {
  const blocked = await fetch(`${base}/api/feed?cursor=${encodeURIComponent(cursor)}`, guestRequest);
  assert.equal(blocked.status, 401);
  assert.match(blocked.headers.get("cache-control") ?? "", /no-store/);
  const error = await blocked.json();
  assert.equal(error.code, "auth_required");
  assert.equal(error.items, undefined);
}

for (const locale of ["vi", "en"]) {
  const route = await fetch(`${base}/${locale}/feed`, guestRequest);
  const html = await route.text();
  const previewPath = `/${locale}/feed/preview`;
  assert.ok(
    route.headers.get("location") === previewPath || html.includes(`NEXT_REDIRECT;replace;${previewPath};`),
    `${locale}: guests must leave the full feed`,
  );
  const previewResponse = await fetch(`${base}${previewPath}`, guestRequest);
  assert.equal(previewResponse.status, 200);
  const previewHtml = await previewResponse.text();
  const cards = previewHtml.match(/<article class="[^"]*shadow-card[^"]*"/g) ?? [];
  assert.equal(cards.length, page.items.length * 2, "Mobile and desktop must each render only the preview");
  assert.ok(previewHtml.includes(`/${locale}/auth?next=%2F${locale}%2Ffeed`));
}

console.log("guest feed HTTP checks passed");
