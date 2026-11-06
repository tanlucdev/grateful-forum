import type { SupabaseClient } from "@supabase/supabase-js";
import { uploadEntryMedia } from "@/lib/entry-media/mutations";
import type { EntryVisibility, InkDocument } from "./types";
import { getEntryDailyQuota } from "./daily-quota-repository";
import { createHandwrittenEntry } from "./mutations";

export async function saveHandwrittenEntry(
  supabase: SupabaseClient,
  input: { document: InkDocument; preview: File | null; visibility: EntryVisibility },
  userId: string,
) {
  if ((await getEntryDailyQuota(supabase)).remaining === 0) throw new Error("daily_entry_limit");
  // Public previews are intentional; private ink remains only in the protected entry row.
  const previewUrl = input.preview ? (await uploadEntryMedia(input.preview)).url : null;
  return createHandwrittenEntry(supabase, { document: input.document, previewUrl, visibility: input.visibility }, userId);
}
