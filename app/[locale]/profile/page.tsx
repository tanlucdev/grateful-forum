import { recordRenderTiming, startRenderTiming } from "@/lib/supabase/timing";
import { profileQuerySchema } from "@/lib/profile/pagination";
import { OnboardingTourReplayButton } from "@/components/onboarding-tour-replay-button";
import { ProfileTourStarterClient } from "./_components/profile-tour-starter-client";
import { redirect } from "next/navigation";
import { localizedLoginHref } from "@/lib/auth/redirects";
import { loadOwnProfileDashboard } from "@/lib/profile/load-own-profile";
import { ProfileScreen } from "./_components/profile-screen";
import { toProfileView } from "./_components/profile-view";

export default async function ProfilePage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ tab?: string; entry?: string; cursor?: string; edge?: string }>;
}>) {
  const started = startRenderTiming();
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const parsed = profileQuerySchema.safeParse(resolvedSearchParams ?? {});
  const query = parsed.success ? parsed.data : { tab: "all" as const };
  const dashboard = await loadOwnProfileDashboard(query);
  if (!dashboard) {
    redirect(localizedLoginHref("/profile", locale));
  }

  const view = toProfileView(dashboard);
  const requestedTab = query.tab;
  view.requestedEntry = query.entry;
  view.initialEdge = query.edge;
  const initialTab =
    requestedTab === "public" || requestedTab === "moments" ? requestedTab : "all";

  recordRenderTiming("profile", started, dashboard);

  return <><ProfileTourStarterClient userId={dashboard.profile.id} /><ProfileScreen initialTab={initialTab} view={view} /><OnboardingTourReplayButton tour="profile" /></>;
}
