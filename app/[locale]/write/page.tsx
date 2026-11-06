import { recordRenderTiming, startRenderTiming } from "@/lib/supabase/timing";
import { redirect } from "next/navigation";
import { localizedLoginHref } from "@/lib/auth/redirects";
import { EntryComposerClient } from "./_components/entry-composer-client";
import { OnboardingTourStarterClient } from "./_components/onboarding-tour-starter-client";
import { shouldStartFirstEntryTour } from "@/lib/onboarding/eligibility";
import { loadFirstEntryTourState } from "@/lib/onboarding/load-first-entry-tour-state";
import { firstEntryTourSearchSchema } from "@/lib/onboarding/schema";
import { OnboardingTourReplayButton } from "@/components/onboarding-tour-replay-button";

export default async function WritePage({
  searchParams,
  params,
}: Readonly<{ params: Promise<{ locale: string }>; searchParams?: Promise<{ tour?: string }> }>) {
  const started = startRenderTiming();
  const { locale } = await params;
  const parsedQuery = firstEntryTourSearchSchema.safeParse(await searchParams ?? {});
  const replay = parsedQuery.success && parsedQuery.data.tour === "first-entry";
  const state = await loadFirstEntryTourState();
  if (!state.signedIn) redirect(localizedLoginHref(replay ? "/write?tour=first-entry" : "/write", locale));
  const { initialQuota } = state;
  const shouldStart = shouldStartFirstEntryTour({
    ...state,
    replay,
  });

  recordRenderTiming("write", started, { state, initialQuota });

  return <><OnboardingTourStarterClient replay={replay} shouldStart={shouldStart} /><EntryComposerClient initialQuota={initialQuota} /><OnboardingTourReplayButton tour="first-entry" /></>;
}
