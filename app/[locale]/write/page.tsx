import { EntryComposerClient } from "./_components/entry-composer-client";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { localizedLoginHref } from "@/lib/auth/redirects";
import { OnboardingTourStarterClient } from "./_components/onboarding-tour-starter-client";
import { shouldStartFirstEntryTour } from "@/lib/onboarding/eligibility";
import { loadFirstEntryTourState } from "@/lib/onboarding/load-first-entry-tour-state";
import { firstEntryTourSearchSchema } from "@/lib/onboarding/schema";
import { OnboardingTourReplayButton } from "@/components/onboarding-tour-replay-button";

export default async function WritePage({
  searchParams,
  params,
}: Readonly<{ params: Promise<{ locale: string }>; searchParams?: Promise<{ tour?: string }> }>) {
  const [{ locale }, query, user] = await Promise.all([params, searchParams, getCurrentUser()]);
  const parsedQuery = firstEntryTourSearchSchema.safeParse(query ?? {});
  const replay = parsedQuery.success && parsedQuery.data.tour === "first-entry";
  if (!user) redirect(localizedLoginHref(replay ? "/write?tour=first-entry" : "/write", locale));
  const state = await loadFirstEntryTourState();
  const shouldStart = shouldStartFirstEntryTour({
    ...state,
    replay,
  });

  return <><OnboardingTourStarterClient replay={replay} shouldStart={shouldStart} /><EntryComposerClient /><OnboardingTourReplayButton tour="first-entry" /></>;
}
