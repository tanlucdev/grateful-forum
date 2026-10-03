import { toEntryMetadata } from "@/lib/entries/records";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { CalendarOverview, CalendarView } from "./dto.ts";
import { queryCalendarData, queryCalendarTimezone } from "./queries.ts";
import { bucketDates, getCalendarStreaks, localDateKey, makeBadges, makeMonthDays, makeYearDays, monthCompletion, visibleYearDays } from "./stats.ts";
import { calendarHref, resolveCalendarQueryDefaults, type CalendarQuery } from "./validation.ts";

export class CalendarAuthError extends Error {}
export class CalendarConfigError extends Error {}

const nextDay = (date: string) => new Date(Date.parse(`${date}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
const monthKey = (year: number, month: number) => `${year}-${String(month).padStart(2, "0")}`;
const previousMonth = (year: number, month: number) => {
  const date = new Date(Date.UTC(year, month - 2, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-01`;
};

function zonedMidnight(date: string, timezone: string) {
  const [year, month, day] = date.split("-").map(Number);
  let utc = Date.UTC(year, month - 1, day);
  for (let index = 0; index < 3; index += 1) {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hourCycle: "h23" }).formatToParts(new Date(utc));
    const zoned = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
    utc += Date.UTC(year, month - 1, day) - Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute, zoned.second);
  }
  return new Date(utc).toISOString();
}

export async function loadCalendarOverview(input: CalendarQuery): Promise<CalendarOverview> {
  if (!hasSupabaseEnv()) throw new CalendarConfigError("Missing Supabase environment variables.");
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new CalendarAuthError("Not signed in.");

  const timezone = await queryCalendarTimezone(supabase, auth.user.id);
  const { year, month, selectedDate } = resolveCalendarQueryDefaults(input, timezone);
  const viewedMonth = monthKey(year, month);
  const raw = await queryCalendarData(
    supabase,
    auth.user.id,
    zonedMidnight(`${year}-01-01`, timezone),
    zonedMidnight(`${year + 1}-01-01`, timezone),
    zonedMidnight(selectedDate, timezone),
    zonedMidnight(nextDay(selectedDate), timezone),
    zonedMidnight(previousMonth(year, month), timezone),
    zonedMidnight(`${viewedMonth}-01`, timezone),
  );
  const actualToday = localDateKey(new Date().toISOString(), timezone);
  const yearBuckets = bucketDates(raw.year.map((row) => row.created_at), timezone);
  const historyDates = raw.history.map((row) => localDateKey(row.created_at, timezone));
  const streaks = getCalendarStreaks(historyDates, actualToday);
  const yearDays = makeYearDays(year, yearBuckets, actualToday);
  const activeDaysThisMonth = [...yearBuckets.keys()].filter((date) => date.startsWith(viewedMonth)).length;
  const monthEntries = raw.year.filter((row) => localDateKey(row.created_at, timezone).startsWith(viewedMonth)).length;
  const completion = monthCompletion(activeDaysThisMonth, year, month, actualToday);
  const view = input.view as CalendarView;
  const href = (date: string) => calendarHref(Number(date.slice(0, 4)), Number(date.slice(5, 7)), date, view);
  const totalFlowers = yearDays.reduce((sum, day) => sum + day.count, 0);
  const level = Math.min(5, Math.max(1, Math.floor(raw.total / 25) + 1));
  const progress = Math.min(1, (raw.total % 25) / 25);

  return {
    timezone,
    view,
    period: {
      year,
      month,
      selectedDate,
      todayDate: actualToday,
    },
    filters: ["year", "six-months", "month", "week"].map((key) => ({ key: key as CalendarView, active: key === view, href: calendarHref(year, month, selectedDate, key as CalendarView) })),
    stats: { ...streaks, totalEntries: raw.total, monthEntries, activeDaysThisMonth, ...completion, entriesDeltaFromPreviousMonth: monthEntries - raw.previous },
    garden: { yearDays, visibleDays: visibleYearDays(yearDays, view, year, month, selectedDate), totalFlowers, todayCount: yearBuckets.get(actualToday) ?? 0 },
    monthDays: makeMonthDays(year, month, yearBuckets, actualToday, href),
    selectedEntries: raw.selected.map((entry) => ({ id: entry.id, content: entry.content, createdAt: entry.created_at, visibility: entry.visibility, metadata: toEntryMetadata(entry), entryKind: entry.entry_kind, handwritingPreviewUrl: entry.handwriting_preview_url })),
    badges: makeBadges(raw.total, streaks.longestStreak, activeDaysThisMonth, monthEntries),
    mascot: { level, maxLevel: 5, progress, daysToNextLevel: Math.ceil((1 - progress) * 25) },
  };
}
