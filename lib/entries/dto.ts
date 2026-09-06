import type { EntryVisibility } from "./types";

export type CreateEntryRequest = {
  content: string;
  visibility: EntryVisibility;
};

export type CreateEntryResponse =
  | { saved: true; entry: { id: string; created_at: string } }
  | { saved: false; reason: string };
