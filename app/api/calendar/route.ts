import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { CalendarAuthError, CalendarConfigError, loadCalendarOverview } from "@/lib/calendar/service";
import { parseCalendarQuery } from "@/lib/calendar/validation";

export async function GET(request: Request) {
  try {
    const overview = await loadCalendarOverview(parseCalendarQuery(new URL(request.url).searchParams));
    return NextResponse.json(overview, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const headers = { "Cache-Control": "no-store" };
    if (error instanceof ZodError) return NextResponse.json({ code: "calendar_failed", error: "Invalid calendar params." }, { status: 400, headers });
    if (error instanceof CalendarAuthError) return NextResponse.json({ code: "calendar_failed", error: "Not signed in." }, { status: 401, headers });
    if (error instanceof CalendarConfigError) return NextResponse.json({ code: "calendar_failed", error: "Calendar is unavailable." }, { status: 503, headers });
    return NextResponse.json({ code: "calendar_failed", error: "Could not load calendar." }, { status: 500, headers });
  }
}
