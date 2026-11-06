import type { SupabaseClient } from "@supabase/supabase-js";
import type { RewardEntry } from "./dto";
import { queryCalendarTimezone } from "@/lib/calendar/queries";

export async function queryRewardHistory(supabase: SupabaseClient, userId: string, through: string) {
  const entries: RewardEntry[] = [];
  const pageSize = 500;
  let cursor: { id: string; created_at: string } | undefined;
  for (;;) {
    let query = supabase.from("entries").select("id, created_at, visibility, gratitudes")
      .eq("user_id", userId).is("hidden_at", null).is("owner_deleted_at", null).lte("created_at", through)
      .order("created_at", { ascending: true }).order("id", { ascending: true }).limit(pageSize);
    if (cursor) query = query.or(`created_at.gt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.gt.${cursor.id})`);
    const { data, error } = await query;
    if (error) throw new Error("Could not load reward history.");
    const page = (data ?? []) as RewardEntry[];
    entries.push(...page);
    if (page.length < pageSize) break;
    cursor = page.at(-1)!;
  }
  return entries;
}

export async function queryRewardData(supabase: SupabaseClient, userId: string, through: string) {
  const [entries, timezone] = await Promise.all([queryRewardHistory(supabase, userId, through), queryCalendarTimezone(supabase, userId)]);
  return { entries, timezone };
}
