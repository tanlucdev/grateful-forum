import assert from "node:assert/strict";
import type { FeedItem } from "../lib/feed/dto.ts";
import { appendFeedPage, feedAccess, FeedLoginRequiredError, toFeedPreview } from "../lib/feed/access.ts";

assert.deepEqual(feedAccess(false), { pageSize: 5, requiresLogin: true });
assert.deepEqual(feedAccess(false, null), { pageSize: 5, requiresLogin: true });
for (const cursor of ["2026-10-23T00:00:00Z", "arbitrary-cursor"]) {
  assert.throws(() => feedAccess(false, cursor), FeedLoginRequiredError);
  assert.deepEqual(feedAccess(true, cursor), { pageSize: 8, requiresLogin: false });
}
assert.deepEqual(feedAccess(true), { pageSize: 8, requiresLogin: false });

const loadedPosts = Array.from({ length: 24 }, (_, index) => ({ id: index + 1 }));
const preview = toFeedPreview(loadedPosts);
assert.deepEqual(preview.items.map((item) => item.id), [1, 2, 3, 4, 5]);
assert.equal(preview.nextCursor, null);
assert.equal(preview.requiresLogin, true);
assert.equal(loadedPosts.length, 24);
assert.deepEqual(toFeedPreview([]).items, []);
assert.equal(toFeedPreview(loadedPosts.slice(0, 3)).items.length, 3);
assert.deepEqual(toFeedPreview(preview.items), preview);

const makePosts = (count: number, offset = 0) => Array.from({ length: count }, (_, index) => ({ id: String(offset + index) } as FeedItem));
const memberPage = { items: makePosts(8), nextCursor: "2026-10-01", requiresLogin: false };
const nextPage = { items: makePosts(8, 8), nextCursor: "2026-09-01", requiresLogin: false };
assert.equal(appendFeedPage(memberPage, nextPage).items.length, 16);
const signedOutPage = toFeedPreview(memberPage.items);
const lateResponse = appendFeedPage(signedOutPage, nextPage);
assert.equal(lateResponse.items.length, 5);
assert.equal(lateResponse.nextCursor, null);
assert.equal(lateResponse.requiresLogin, true);
assert.deepEqual(appendFeedPage(memberPage, toFeedPreview(nextPage.items)), signedOutPage);

console.log("feed access checks passed");
