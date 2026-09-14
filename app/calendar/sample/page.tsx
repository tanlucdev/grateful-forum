import { sampleCalendarOverview } from "@/lib/calendar/sample";
import { visibleYearDays } from "@/lib/calendar/stats";
import { calendarHref, calendarQuerySchema } from "@/lib/calendar/validation";
import { CalendarScreen } from "../_components/calendar-screen";

export default async function CalendarSamplePage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<{ view?: string }>;
}>) {
  const params = await searchParams;
  const { view } = calendarQuerySchema.pick({ view: true }).parse(params ?? {});
  const { month, selectedDate, year } = sampleCalendarOverview.period;
  const overview = {
    ...sampleCalendarOverview,
    view,
    filters: sampleCalendarOverview.filters.map((filter) => ({ ...filter, active: filter.key === view })),
    garden: {
      ...sampleCalendarOverview.garden,
      visibleDays: visibleYearDays(sampleCalendarOverview.garden.yearDays, view, year, month, selectedDate),
    },
    monthDays: sampleCalendarOverview.monthDays.map((day) => ({
      ...day,
      href: calendarHref(Number(day.date.slice(0, 4)), Number(day.date.slice(5, 7)), day.date, view),
    })),
  };

  return <CalendarScreen overview={overview} />;
}
