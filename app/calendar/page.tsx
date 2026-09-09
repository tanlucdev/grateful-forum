import { loadCalendarEntries } from "@/lib/calendar/load-calendar";
import { CalendarScreen } from "./_components/CalendarScreen";

export default async function CalendarPage() {
  const todayEntries = await loadCalendarEntries();
  return <CalendarScreen todayEntries={todayEntries} />;
}
