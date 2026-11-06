import { recordRenderTiming, startRenderTiming } from "@/lib/supabase/timing";
import { redirect } from "next/navigation";
import { localizedLoginHref } from "@/lib/auth/redirects";
import { CalendarAuthError, loadCalendarOverview } from "@/lib/calendar/service";
import { calendarQuerySchema } from "@/lib/calendar/validation";
import { CalendarScreen } from "./_components/calendar-screen";
import { CalendarTourStarterClient } from "./_components/calendar-tour-starter-client";
import { OnboardingTourReplayButton } from "@/components/onboarding-tour-replay-button";

export default async function CalendarPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ year?: string; month?: string; date?: string; view?: string }>;
}>) {
  const started = startRenderTiming();
  const { locale } = await params;
  const query = await searchParams;
  let overview;
  try {
    overview = await loadCalendarOverview(calendarQuerySchema.parse(query ?? {}));
  } catch (error) {
    if (error instanceof CalendarAuthError) redirect(localizedLoginHref("/calendar", locale));
    throw error;
  }
  recordRenderTiming("calendar", started, overview);
  return <>{overview.onboarding.calendarTourAvailable ? <CalendarTourStarterClient tourSeenAt={overview.onboarding.calendarTourSeenAt} /> : null}<CalendarScreen overview={overview} />{overview.onboarding.calendarTourAvailable ? <OnboardingTourReplayButton tour="calendar" /> : null}</>;
}
