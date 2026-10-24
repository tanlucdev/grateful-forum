import { createCalendarSeenHandler } from "@/lib/onboarding/calendar-seen-handler";
import { recordCalendarTourSeen } from "@/lib/onboarding/service";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const POST = createCalendarSeenHandler({
  createClient: createSupabaseServerClient,
  isConfigured: hasSupabaseEnv,
  recordSeen: recordCalendarTourSeen,
});
