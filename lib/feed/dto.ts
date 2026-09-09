import type { EntryMetadata, EntryVisibility } from "@/lib/entries/types";

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
};

export type FeedPage = {
  items: FeedItem[];
  nextCursor: string | null;
};
