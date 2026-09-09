export const entryVisibilities = ["private", "public", "anonymous"] as const;

export type EntryVisibility = (typeof entryVisibilities)[number];

export const ENTRY_LIMIT = 10000;

export type EntryMetadata = {
  gratitudes: string[];
  reflection: string | null;
  mood: string | null;
  washi: string | null;
  space: string | null;
  quote: string | null;
  sticker: string | null;
  imageUrl: string | null;
};

export type LocalEntry = {
  id: string;
  content: string;
  visibility: EntryVisibility;
  createdAt: string;
  synced: boolean;
};

export type LocalDraft = {
  id: string;
  content: string;
  createdAt: string;
  mood: string;
};

export function isEntryVisibility(value: string): value is EntryVisibility {
  return entryVisibilities.includes(value as EntryVisibility);
}
