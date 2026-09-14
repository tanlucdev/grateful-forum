import type { CreateEntryRequest } from "./dto.ts";
import type { EntryMetadata, EntryVisibility } from "./types.ts";

export const entrySelect =
  "id, content, visibility, created_at, user_id, gratitudes, reflection, mood, washi, space, quote, sticker, image_url";

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
};

export function composeEntryContent(input: CreateEntryRequest) {
  return [
    `Washi: ${input.washi}`,
    `Tâm trạng: ${input.mood}`,
    `Không gian: ${input.space}`,
    `Sticker: ${input.sticker}`,
    `Câu trích dẫn: ${input.quote}`,
    ...(input.imageUrl ? [`Ảnh: ${input.imageUrl}`] : []),
    ...(input.gratitudes.length
      ? ["", "Điều biết ơn:", ...input.gratitudes.map((item, index) => `${index + 1}. ${item}`)]
      : []),
    "",
    "Tự sự:",
    input.reflection,
  ].join("\n");
}

export function toEntryMetadata(row: Pick<EntryRow, "gratitudes" | "reflection" | "mood" | "washi" | "space" | "quote" | "sticker" | "image_url">): EntryMetadata {
  return {
    gratitudes: row.gratitudes ?? [],
    reflection: row.reflection,
    mood: row.mood,
    washi: row.washi,
    space: row.space,
    quote: row.quote,
    sticker: row.sticker,
    imageUrl: row.image_url,
  };
}
