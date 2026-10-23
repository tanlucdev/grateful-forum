import { EntryComposerClient } from "./_components/entry-composer-client";
import { OnboardingTourStarterClient } from "./_components/onboarding-tour-starter-client";
import { shouldStartFirstEntryTour } from "@/lib/onboarding/eligibility";
import { loadFirstEntryTourState } from "@/lib/onboarding/load-first-entry-tour-state";
import { firstEntryTourSearchSchema } from "@/lib/onboarding/schema";
import { OnboardingTourReplayButton } from "@/components/onboarding-tour-replay-button";

export default async function WritePage({
  searchParams,
}: Readonly<{ searchParams?: Promise<{ tour?: string }> }>) {
  const [state, query] = await Promise.all([
    loadFirstEntryTourState(),
    searchParams,
  ]);
  const parsedQuery = firstEntryTourSearchSchema.safeParse(query ?? {});
  const replay = parsedQuery.success && parsedQuery.data.tour === "first-entry";
  const shouldStart = shouldStartFirstEntryTour({
    ...state,
    replay,
  });

  return <><OnboardingTourStarterClient replay={replay} shouldStart={shouldStart} /><EntryComposerClient /><OnboardingTourReplayButton tour="first-entry" /></>;
}
