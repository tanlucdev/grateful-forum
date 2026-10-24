import { getGuestId } from "@/lib/auth/guest-session";
import { queryCalendarTimezone } from "@/lib/calendar/queries";
import { makeWeeklyRhythm } from "@/lib/profile/weekly-rhythm";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function loadFeedWeeklyRhythm() {
  const now = new Date();
  if (!hasSupabaseEnv()) return makeWeeklyRhythm([], undefined, now);

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  const guestId = userId ? null : await getGuestId();
  const timezone = userId ? await queryCalendarTimezone(supabase, userId) : undefined;
  if (!userId && !guestId) return makeWeeklyRhythm([], timezone, now);

  let query = supabase.from("entries").select("created_at")
    .is("hidden_at", null).is("owner_deleted_at", null)
    .gte("created_at", new Date(now.getTime() - 8 * 86_400_000).toISOString())
    .lte("created_at", now.toISOString());
  query = userId ? query.eq("user_id", userId) : query.eq("guest_id", guestId).is("user_id", null);
  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return makeWeeklyRhythm((data ?? []).map((entry) => ({ createdAt: entry.created_at })), timezone, now);
}
