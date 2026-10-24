import type { CreateEntryRequest } from "./dto.ts";
import type { EntryKind, EntryMetadata, EntryVisibility, InkDocument } from "./types.ts";

export const entrySelect =
  "id, content, visibility, created_at, user_id, gratitudes, reflection, mood, washi, space, quote, sticker, image_url, entry_kind, handwriting_preview_url";
export const entryDetailSelect = `${entrySelect}, handwriting_data, handwriting_orientation`;

export type EntryRow = {
  id: string;
  content: string;
  visibility: EntryVisibility;
  created_at: string;
  user_id: string | null;
  gratitudes: string[] | null;
  reflection: string | null;
  mood: string | null;
  washi: string | null;
  space: string | null;
  quote: string | null;
  sticker: string | null;
  image_url: string | null;
  entry_kind: EntryKind;
  handwriting_preview_url: string | null;
};

export type EntryDetailRow = EntryRow & {
  handwriting_data: InkDocument | null;
  handwriting_orientation: InkDocument["orientation"] | null;
};

export function composeEntryContent(input: CreateEntryRequest) {
  return [
    ...input.gratitudes.map((item) => item.trim()),
    input.reflection?.trim() || null,
  ].filter(Boolean).join("\n\n");
}

export function toEntryMetadata(row: Pick<EntryRow, "entry_kind" | "gratitudes" | "reflection" | "mood" | "washi" | "space" | "quote" | "sticker" | "image_url" | "handwriting_preview_url">): EntryMetadata {
  return {
    entryKind: row.entry_kind,
    gratitudes: row.gratitudes ?? [],
    reflection: row.reflection,
    mood: row.mood,
    washi: row.washi,
    space: row.space,
    quote: row.quote,
    sticker: row.sticker,
    imageUrl: row.image_url,
    handwritingPreviewUrl: row.handwriting_preview_url,
  };
}
