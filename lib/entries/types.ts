export const ENTRY_LIMIT = 500;

export const entryVisibilities = ["private", "public", "anonymous"] as const;

export type EntryVisibility = (typeof entryVisibilities)[number];

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
