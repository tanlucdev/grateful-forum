import type { SupabaseClient } from "@supabase/supabase-js";

export const entryMediaColumns = ["image_url", "handwriting_preview_url"] as const;
export type EntryMediaColumn = (typeof entryMediaColumns)[number];
type MigrationRow = { id: string; image_url: string | null; handwriting_preview_url: string | null };

export async function getCloudinaryMediaPage(supabase: SupabaseClient, after?: string) {
  let query = supabase.from("entries").select("id, image_url, handwriting_preview_url")
    .or(entryMediaColumns.map((column) => `${column}.like.https://res.cloudinary.com/%`).join(","))
    .order("id").limit(100);
  if (after) query = query.gt("id", after);
  const { data, error } = await query;
  if (error) throw new Error(`Could not read entry media: ${error.message}`);
  return (data ?? []) as MigrationRow[];
}

export async function replaceEntryMediaUrl(supabase: SupabaseClient, id: string, column: EntryMediaColumn, before: string, after: string) {
  const { data, error } = await supabase.from("entries").update({ [column]: after })
    .eq("id", id).eq(column, before).select("id");
  if (error) throw new Error(`Could not update entry media: ${error.message}`);
  return data.length > 0;
}
