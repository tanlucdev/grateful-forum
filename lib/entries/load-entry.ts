import { entryRouteParamsSchema } from "./schema";
import { entryDetailSelect, type EntryDetailRow } from "./records";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function loadReadableEntry(id: string): Promise<EntryDetailRow | null> {
  if (!hasSupabaseEnv()) return null;
  const entryId = entryRouteParamsSchema.parse({ id }).id;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("entries")
    .select(entryDetailSelect)
    .eq("id", entryId)
    .is("hidden_at", null)
    .is("owner_deleted_at", null)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as EntryDetailRow | null;
}
