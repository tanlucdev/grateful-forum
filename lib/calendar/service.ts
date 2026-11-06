import { loadJournalContext } from "@/lib/profile/load-journal-context";
import { toEntryMetadata } from "@/lib/entries/records";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { queryJournalStatistics } from "@/lib/profile/queries";
import type { CalendarOverview, CalendarView } from "./dto.ts";
import { queryCalendarData } from "./queries.ts";
import { localDateKey, makeBadges, makeMonthDays, makeYearDays, monthCompletion, visibleYearDays } from "./stats.ts";
import { calendarHref, resolveCalendarQueryDefaults, type CalendarQuery } from "./validation.ts";

export class CalendarAuthError extends Error {}
export class CalendarConfigError extends Error {}

const nextDay = (date: string) => new Date(Date.parse(`${date}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);

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
  const context = await loadJournalContext();
  if (!context) throw new CalendarAuthError("Not signed in.");
  const { user, profile } = context;
  let timezone = "Asia/Ho_Chi_Minh";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: profile?.timezone ?? timezone });
    timezone = profile?.timezone ?? timezone;
  } catch {
    // Keep the calendar usable when a stored timezone is no longer valid.
  }
  const calendarTourAvailable = true;
  const calendarTourSeenAt = profile?.calendar_tour_seen_at ?? null;
  const { year, month, selectedDate } = resolveCalendarQueryDefaults(input, timezone);
  const [{ selected }, statistics] = await Promise.all([
    queryCalendarData(supabase, user.id, zonedMidnight(selectedDate, timezone), zonedMidnight(nextDay(selectedDate), timezone)),
    input.year === undefined && input.month === undefined && context.statistics.timezone === timezone
      ? context.statistics
      : queryJournalStatistics(supabase, timezone, year, month),
  ]);
  const actualToday = localDateKey(new Date().toISOString(), timezone);
  const yearBuckets = new Map(Object.entries(statistics.yearBuckets));
  const streaks = { currentStreak: statistics.currentStreak, longestStreak: statistics.longestStreak };
  const yearDays = makeYearDays(year, yearBuckets, actualToday);
  const activeDaysThisMonth = statistics.activeDaysThisMonth;
  const monthEntries = statistics.monthEntries;
  const completion = monthCompletion(activeDaysThisMonth, year, month, actualToday);
  const view = input.view as CalendarView;
  const href = (date: string) => calendarHref(Number(date.slice(0, 4)), Number(date.slice(5, 7)), date, view);
  const totalFlowers = yearDays.reduce((sum, day) => sum + day.count, 0);
  const level = Math.min(5, Math.max(1, Math.floor(statistics.total / 25) + 1));
  const progress = Math.min(1, (statistics.total % 25) / 25);

  return {
    onboarding: { calendarTourAvailable, calendarTourSeenAt },
    timezone,
    view,
    period: {
      year,
      month,
      selectedDate,
      todayDate: actualToday,
    },
    filters: ["year", "six-months", "month", "week"].map((key) => ({ key: key as CalendarView, active: key === view, href: calendarHref(year, month, selectedDate, key as CalendarView) })),
    stats: { ...streaks, totalEntries: statistics.total, monthEntries, activeDaysThisMonth, ...completion, entriesDeltaFromPreviousMonth: monthEntries - statistics.previous },
    garden: { yearDays, visibleDays: visibleYearDays(yearDays, view, year, month, selectedDate), totalFlowers, todayCount: yearBuckets.get(actualToday) ?? 0 },
    monthDays: makeMonthDays(year, month, yearBuckets, actualToday, href),
    selectedEntries: selected.map((entry) => ({ id: entry.id, content: entry.content, createdAt: entry.created_at, visibility: entry.visibility, metadata: toEntryMetadata(entry), entryKind: entry.entry_kind, handwritingPreviewUrl: entry.handwriting_preview_url })),
    badges: makeBadges(statistics.total, streaks.longestStreak, activeDaysThisMonth, monthEntries),
    mascot: { level, maxLevel: 5, progress, daysToNextLevel: Math.ceil((1 - progress) * 25) },
  };
}
