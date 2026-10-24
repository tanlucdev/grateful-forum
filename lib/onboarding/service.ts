import type { SupabaseClient } from "@supabase/supabase-js";
import { markCalendarTourSeen, markOnboardingTourSeen } from "./repository";

export async function recordOnboardingTourSeen(
  supabase: SupabaseClient,
  userId: string,
) {
  await markOnboardingTourSeen(supabase, userId);
}

export async function recordCalendarTourSeen(
  supabase: SupabaseClient,
  userId: string,
) {
  await markCalendarTourSeen(supabase, userId);
}
