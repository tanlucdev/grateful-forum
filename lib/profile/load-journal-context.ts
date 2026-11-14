import { cache } from "react";
import { getVerifiedUser } from "@/lib/auth/current-user";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EntryDailyQuota } from "@/lib/entries/daily-quota";
import type { JournalStatistics } from "./queries";

type JournalContext = {
  userId: string;
  profile: {
    id: string; display_name: string; username: string | null; avatar_url: string | null;
    soul_title?: string; bio: string | null; timezone: string | null; onboarding_tour_seen_at: string | null;
    onboarding_completed_at: string | null; calendar_tour_seen_at: string | null;
  } | null;
  statistics: JournalStatistics | null;
  quota: EntryDailyQuota | null;
};

const loadContext = cache(async (includeStatistics: boolean) => {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createSupabaseServerClient();
  const [verified, response] = await Promise.allSettled([
    getVerifiedUser(),
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return { data: null, error: null };
      const { data, error } = await supabase.rpc("journal_request_context", { include_statistics: includeStatistics });
      return { data, error };
    })(),
  ]);
  if (verified.status === "rejected") throw verified.reason;
  if (!verified.value) return null;
  // No data leaves this loader until identity is verified independently of session.user.
  if (response.status === "rejected") throw response.reason;
  if (response.value.error) throw new Error(response.value.error.message);
  const context = response.value.data as JournalContext | null;
  if (!context || context.userId !== verified.value.id) throw new Error("journal_context_unavailable");
  return { ...context, user: verified.value };
});

export async function loadJournalContext() {
  const context = await loadContext(true);
  if (!context) return null;
  if (!context.statistics) throw new Error("journal_context_unavailable");
  return { ...context, statistics: context.statistics };
}

export function loadJournalShellContext() {
  return loadContext(false);
}
