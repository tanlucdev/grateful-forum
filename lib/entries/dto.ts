import type { EntryVisibility } from "./types";

export type CreateEntryRequest = {
  visibility: EntryVisibility;
  gratitudes: string[];
  reflection: string;
  mood: string;
  washi: string;
  space: string;
  quote: string;
  sticker: string;
  imageUrl?: string | null;
};

export type CreateEntryResponse =
  | { saved: true; entry: { id: string; created_at: string } }
  | { saved: false; reason: string };

export type UpdateEntryResponse = { entry: { id: string; visibility: EntryVisibility } };
