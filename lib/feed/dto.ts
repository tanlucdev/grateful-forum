import type { EntryKind, EntryMetadata, EntryVisibility } from "@/lib/entries/types";
import type { FeedReactionCounts } from "./engagement-state.ts";
import type { FeedReactionType } from "./validation.ts";

export type FeedAuthor = {
  id: string;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
};

export type FeedItem = {
  id: string;
  content: string;
  visibility: EntryVisibility;
  createdAt: string;
  author: FeedAuthor | null;
  metadata: EntryMetadata;
  entryKind: EntryKind;
  handwritingPreviewUrl: string | null;
  reactions: FeedReactionCounts;
  viewerReaction: FeedReactionType | null;
  viewerBookmarked: boolean;
};

export type FeedPage = {
  items: FeedItem[];
  nextCursor: string | null;
  requiresLogin: boolean;
};
