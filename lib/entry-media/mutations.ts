import { randomUUID } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { validateEntryMediaFile } from "./validation";

const bucket = "entry-media";
const allowedMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"],
]);

export async function uploadEntryMedia(file: File) {
  validateEntryMediaFile(file);

  const supabase = createSupabaseAdminClient();
  const extension = allowedMimeTypes.get(file.type);

  if (!extension) {
    throw new Error("Invalid image.");
  }

  const path = `entries/${new Date().getFullYear()}/${randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
}
