import type { SupabaseClient } from "@supabase/supabase-js";

export async function markOnboardingTourSeen(
  supabase: SupabaseClient,
  userId: string,
) {
  const { error } = await supabase
    .from("profiles")
    .update({ onboarding_tour_seen_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw new Error(error.message);
}

export async function markCalendarTourSeen(
  supabase: SupabaseClient,
  userId: string,
) {
  const { error } = await supabase
    .from("profiles")
    .update({ calendar_tour_seen_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) throw new Error(error.message);
}
