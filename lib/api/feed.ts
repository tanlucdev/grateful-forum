import type { FeedPage } from "@/lib/feed/dto";
import type { FeedReactionCounts } from "@/lib/feed/engagement-state";
import type { FeedReactionType } from "@/lib/feed/validation";
import { fetchJson } from "./fetch-json";

type ReactionResponse = {
  saved: true;
  reactions: FeedReactionCounts;
  viewerReaction: FeedReactionType | null;
};

type BookmarkResponse = {
  saved: true;
  bookmarked: boolean;
};

export function loadMoreFeed(cursor: string) {
  return fetchJson<FeedPage>(
    `/api/feed?cursor=${encodeURIComponent(cursor)}`,
    {},
    "Could not load more entries.",
  );
}

export function saveFeedReaction(entryId: string, reactionType: FeedReactionType) {
  return fetchJson<ReactionResponse>(
    "/api/feed/reactions",
    {
      body: JSON.stringify({ entryId, reactionType }),
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
    "Could not save reaction.",
  );
}

export function deleteFeedReaction(entryId: string) {
  return fetchJson<ReactionResponse>(
    `/api/feed/reactions?entryId=${encodeURIComponent(entryId)}`,
    { credentials: "same-origin", method: "DELETE" },
    "Could not remove reaction.",
  );
}

export function saveFeedBookmark(entryId: string) {
  return fetchJson<BookmarkResponse>(
    "/api/feed/bookmarks",
    {
      body: JSON.stringify({ entryId }),
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
    "Could not save bookmark.",
  );
}

export function deleteFeedBookmark(entryId: string) {
  return fetchJson<BookmarkResponse>(
    `/api/feed/bookmarks?entryId=${encodeURIComponent(entryId)}`,
    { credentials: "same-origin", method: "DELETE" },
    "Could not remove bookmark.",
  );
}
