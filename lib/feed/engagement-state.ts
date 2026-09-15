import { feedReactionTypes } from "./constants.ts";
import type { FeedReactionType } from "./validation.ts";

export type FeedReactionCounts = Record<FeedReactionType, number>;

export function emptyFeedReactionCounts(): FeedReactionCounts {
  return Object.fromEntries(feedReactionTypes.map((type) => [type, 0])) as FeedReactionCounts;
}

export function applyViewerReaction(
  reactions: FeedReactionCounts,
  current: FeedReactionType | null,
  next: FeedReactionType | null,
) {
  const updated = { ...reactions };
  if (current) updated[current] = Math.max(0, updated[current] - 1);
  if (next) updated[next] += 1;
  return { reactions: updated, viewerReaction: next };
}

export function toggleBookmark(bookmarked: boolean) {
  return !bookmarked;
}
