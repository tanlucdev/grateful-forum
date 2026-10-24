import type { EntryVisibility, InkDocument } from "./types";

export type CreateEntryRequest = {
  visibility: EntryVisibility;
  gratitudes: string[];
  reflection?: string | null;
  mood?: string | null;
  washi?: string | null;
  space?: string | null;
  quote?: string | null;
  sticker?: string | null;
  imageUrl?: string | null;
};

export type CreateEntryResponse =
  | { saved: true; entry: { id: string; created_at: string } }
  | { saved: false; reason: string };

export type UpdateEntryResponse = { entry: { id: string; visibility: EntryVisibility } };

export type CreateHandwrittenEntryResponse =
  | { saved: true; entry: { id: string; created_at: string } }
  | { saved: false; reason: string };

export type CreateHandwrittenEntryRequest = {
  document: InkDocument;
  visibility: EntryVisibility;
};
