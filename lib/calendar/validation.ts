import { z } from "zod";
import type { CalendarView } from "./dto";
import { localDateKey } from "./stats.ts";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
});

export const calendarQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  date: isoDate.optional(),
  view: z.enum(["year", "six-months", "month", "week"]).default("year"),
});

export type CalendarQuery = z.infer<typeof calendarQuerySchema>;

export function parseCalendarQuery(params: URLSearchParams) {
  return calendarQuerySchema.parse({
    year: params.get("year") ?? undefined,
    month: params.get("month") ?? undefined,
    date: params.get("date") ?? undefined,
    view: params.get("view") ?? undefined,
  });
}

export function calendarHref(year: number, month: number, date: string, view: CalendarView) {
  return `/calendar?year=${year}&month=${month}&date=${date}&view=${view}`;
}

export function resolveCalendarQueryDefaults(input: CalendarQuery, timezone: string, now = new Date()) {
  const today = localDateKey(now.toISOString(), timezone);
  const year = input.year ?? Number(today.slice(0, 4));
  const month = input.month ?? Number(today.slice(5, 7));
  const viewedMonth = `${year}-${String(month).padStart(2, "0")}`;
  const selectedDate = input.date?.startsWith(viewedMonth) ? input.date : today.startsWith(viewedMonth) ? today : `${viewedMonth}-01`;
  return { year, month, selectedDate, today };
}
