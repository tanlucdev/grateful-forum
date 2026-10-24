import { createOnboardingSeenHandler } from "@/lib/onboarding/seen-handler";
import { recordOnboardingTourSeen } from "@/lib/onboarding/service";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const POST = createOnboardingSeenHandler({
  createClient: createSupabaseServerClient,
  isConfigured: hasSupabaseEnv,
  recordSeen: recordOnboardingTourSeen,
});
