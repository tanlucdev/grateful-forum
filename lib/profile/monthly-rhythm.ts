import { bucketDates, localDateKey } from "../calendar/stats.ts";
import type { JournalEntry } from "./types";

export function makeMonthlyRhythm(entries: Pick<JournalEntry, "createdAt">[], timezone = "Asia/Ho_Chi_Minh", now = new Date()) {
  const today = localDateKey(now.toISOString(), timezone);
  const month = today.slice(0, 7);
  const [year, monthNumber] = month.split("-").map(Number);
  const totalDays = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const dates = bucketDates(entries.map((entry) => entry.createdAt), timezone);
  const activeDays = [...dates.keys()].filter((date) => date.startsWith(month) && date <= today).length;

  return { activeDays, totalDays, completionRate: activeDays / totalDays };
}
