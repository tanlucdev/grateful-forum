export const entryVisibilities = ["private", "public", "anonymous"] as const;
export const entryKinds = ["text", "handwritten"] as const;

export type EntryVisibility = (typeof entryVisibilities)[number];
export type EntryKind = (typeof entryKinds)[number];

export const ENTRY_LIMIT = 10000;

export type EntryMetadata = {
  entryKind: EntryKind;
  gratitudes: string[];
  reflection: string | null;
  mood: string | null;
  washi: string | null;
  space: string | null;
  quote: string | null;
  sticker: string | null;
  imageUrl: string | null;
  handwritingPreviewUrl: string | null;
};

export type InkPoint = { x: number; y: number; pressure: number };
export type InkStroke = { color: string; points: InkPoint[] };
export type InkPaperStyle = "blank" | "ruled" | "dot" | "grid";
export type InkStamp = "none" | "sprout" | "heart" | "star" | "sun" | "moon" | "flower";
export type InkDocumentV1 = {
  version: 1;
  orientation: "portrait" | "landscape";
  paperStyle: InkPaperStyle;
  stamp: InkStamp;
  strokes: InkStroke[];
};
export type InkDocument = InkDocumentV1;

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

export type LocalHandwrittenEntry = {
  id: string;
  document: InkDocument;
  visibility: EntryVisibility;
  createdAt: string;
};

export function isEntryVisibility(value: string): value is EntryVisibility {
  return entryVisibilities.includes(value as EntryVisibility);
}
