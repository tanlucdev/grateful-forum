import { localDateKey } from "../calendar/stats.ts";
import type { JournalEntry } from "./types";

export type WeeklyRhythmDay = {
  active: boolean;
  count: number;
  date: string;
  isToday: boolean;
  label: string;
};

const defaultTimezone = "Asia/Ho_Chi_Minh";
const dayMs = 86_400_000;
const weekdayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function makeWeeklyRhythm(entries: Pick<JournalEntry, "createdAt">[], timezone = defaultTimezone, now = new Date()) {
  const today = localDateKey(now.toISOString(), timezone);
  const weekStart = addDays(today, -((new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7));
  const counts = new Map<string, number>();

  entries.forEach((entry) => {
    const date = localDateKey(entry.createdAt, timezone);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  });

  return weekdayLabels.map((label, index) => {
    const date = addDays(weekStart, index);
    const count = counts.get(date) ?? 0;
    return { active: count > 0, count, date, isToday: date === today, label };
  });
}

function addDays(date: string, amount: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + amount * dayMs).toISOString().slice(0, 10);
}
