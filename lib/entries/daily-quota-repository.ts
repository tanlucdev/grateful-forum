import type { SupabaseClient } from "@supabase/supabase-js";
import type { EntryDailyQuota } from "./daily-quota";

export async function getEntryDailyQuota(supabase: SupabaseClient): Promise<EntryDailyQuota> {
  const { data, error } = await supabase.rpc("get_entry_daily_quota");
  if (error) throw new Error(error.message);
  if (!data) throw new Error("auth_required");
  return data as EntryDailyQuota;
}
