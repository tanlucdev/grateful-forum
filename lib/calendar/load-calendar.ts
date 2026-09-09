import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { entrySelect, toEntryMetadata } from "@/lib/entries/records";
import type { CalendarEntry } from "./dto";

export async function loadCalendarEntries(): Promise<CalendarEntry[]> {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return [];
  }

  const { data } = await supabase
    .from("entries")
    .select(entrySelect)
    .eq("user_id", auth.user.id)
    .is("hidden_at", null)
    .order("created_at", { ascending: false })
    .limit(2);

  return (data ?? []).map((entry) => ({
    id: entry.id,
    content: entry.content,
    createdAt: entry.created_at,
    visibility: entry.visibility,
    metadata: toEntryMetadata(entry),
  }));
}
