import { getCurrentUser } from "@/lib/auth/current-user";
import { makeWeeklyRhythm } from "@/lib/profile/weekly-rhythm";
import { queryJournalStatistics } from "@/lib/profile/queries";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function loadFeedWeeklyRhythm() {
  const now = new Date();
  if (!hasSupabaseEnv()) return makeWeeklyRhythm([], undefined, now);
  const user = await getCurrentUser();
  if (!user) return makeWeeklyRhythm([], undefined, now);
  const supabase = await createSupabaseServerClient();
  const stats = await queryJournalStatistics(supabase);
  return makeWeeklyRhythm([], stats.timezone, now).map((day) => ({ ...day, count: stats.weekBuckets[day.date] ?? 0, active: (stats.weekBuckets[day.date] ?? 0) > 0 }));
}
