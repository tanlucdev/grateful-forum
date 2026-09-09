import { sampleCalendarOverview } from "@/lib/calendar/sample";
import { CalendarScreen } from "../_components/CalendarScreen";

export default function CalendarSamplePage() {
  return <CalendarScreen overview={sampleCalendarOverview} />;
}
