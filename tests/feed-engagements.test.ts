import assert from "node:assert/strict";
import { applyViewerReaction, emptyFeedReactionCounts, toggleBookmark } from "../lib/feed/engagement-state.ts";
import { feedReactionRequestSchema } from "../lib/feed/validation.ts";

assert.equal(feedReactionRequestSchema.parse({
  entryId: "00000000-0000-4000-8000-000000000001",
  reactionType: "empathy",
}).reactionType, "empathy");
assert.throws(() => feedReactionRequestSchema.parse({
  entryId: "00000000-0000-4000-8000-000000000001",
  reactionType: "like",
}));

const start = emptyFeedReactionCounts();
start.empathy = 1;
start.healing_energy = 1;

const empathized = applyViewerReaction(start, null, "empathy");
assert.deepEqual(empathized, {
  reactions: { empathy: 2, healing_energy: 1, refreshing: 0 },
  viewerReaction: "empathy",
});

const switched = applyViewerReaction(empathized.reactions, empathized.viewerReaction, "healing_energy");
assert.deepEqual(switched, {
  reactions: { empathy: 1, healing_energy: 2, refreshing: 0 },
  viewerReaction: "healing_energy",
});

assert.deepEqual(applyViewerReaction(switched.reactions, switched.viewerReaction, null), {
  reactions: { empathy: 1, healing_energy: 1, refreshing: 0 },
  viewerReaction: null,
});
assert.equal(toggleBookmark(false), true);
assert.equal(toggleBookmark(true), false);

console.log("feed engagement checks passed");
