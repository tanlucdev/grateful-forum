import { redirect } from "next/navigation";
import { loginHref } from "@/lib/auth/redirects";
import { CalendarAuthError, loadCalendarOverview } from "@/lib/calendar/service";
import { calendarQuerySchema } from "@/lib/calendar/validation";
import { CalendarScreen } from "./_components/calendar-screen";

export default async function CalendarPage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<{ year?: string; month?: string; date?: string; view?: string }>;
}>) {
  const params = await searchParams;
  let overview;
  try {
    overview = await loadCalendarOverview(calendarQuerySchema.parse(params ?? {}));
  } catch (error) {
    if (error instanceof CalendarAuthError) redirect(loginHref("/calendar"));
    throw error;
  }
  return <CalendarScreen overview={overview} />;
}
