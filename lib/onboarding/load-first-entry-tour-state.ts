import { loadJournalContext } from "@/lib/profile/load-journal-context";
import type { EntryDailyQuota } from "@/lib/entries/daily-quota";

export type FirstEntryTourState = {
  onboardingCompletedAt: string | null;
  signedIn: boolean;
  tourSeenAt: string | null;
  initialQuota: EntryDailyQuota | null;
};

export async function loadFirstEntryTourState(): Promise<FirstEntryTourState> {
  const context = await loadJournalContext();
  return {
    onboardingCompletedAt: context?.profile?.onboarding_completed_at ?? null,
    signedIn: Boolean(context && !context.user.is_anonymous),
    tourSeenAt: context?.profile?.onboarding_tour_seen_at ?? null,
    initialQuota: context?.quota ?? null,
  };
}
