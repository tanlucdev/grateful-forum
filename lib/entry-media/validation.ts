import { z } from "zod";
import { MediaError } from "./errors.ts";
import type { EntryVisibility } from "../entries/types.ts";

const maxBytes = 5 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export const entryMediaFormSchema = z.object({
  file: z.instanceof(File),
});

export function validateEntryMediaFile(file: File) {
  if (!allowedMimeTypes.has(file.type) || file.size <= 0 || file.size > maxBytes) {
    throw new MediaError("invalid_media");
  }
}

export function parseEntryMediaFile(value: FormDataEntryValue | null) {
  const parsed = entryMediaFormSchema.safeParse({ file: value });
  if (!parsed.success) throw new MediaError("invalid_media");
  validateEntryMediaFile(parsed.data.file);
  return parsed.data.file;
}

export function parseHandwritingPreview(visibility: EntryVisibility, value: FormDataEntryValue | null) {
  const preview = value === null ? null : parseEntryMediaFile(value);
  if (preview && preview.type !== "image/webp") throw new MediaError("invalid_media");
  if (visibility === "private" && preview) throw new MediaError("invalid_media");
  if (visibility !== "private" && !preview) throw new MediaError("invalid_media");
  return preview;
}
