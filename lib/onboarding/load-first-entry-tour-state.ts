import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FirstEntryTourState = {
  onboardingCompletedAt: string | null;
  signedIn: boolean;
  tourSeenAt: string | null;
};

export async function loadFirstEntryTourState(): Promise<FirstEntryTourState> {
  if (!hasSupabaseEnv()) {
    return { onboardingCompletedAt: null, signedIn: false, tourSeenAt: null };
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return { onboardingCompletedAt: null, signedIn: false, tourSeenAt: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_tour_seen_at, onboarding_completed_at")
    .eq("id", auth.user.id)
    .maybeSingle();

  return {
    onboardingCompletedAt: profile?.onboarding_completed_at ?? null,
    signedIn: true,
    tourSeenAt: profile?.onboarding_tour_seen_at ?? null,
  };
}
