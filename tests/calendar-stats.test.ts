import assert from "node:assert/strict";
import { bucketDates, getCalendarStreaks, makeMonthDays, makeYearDays, monthCompletion } from "../lib/calendar/stats.ts";

assert.equal(bucketDates(["2026-09-08T18:00:00.000Z"], "Asia/Ho_Chi_Minh").get("2026-09-09"), 1);
assert.deepEqual(getCalendarStreaks(["2026-09-08"], "2026-09-09"), { currentStreak: 0, longestStreak: 1 });
assert.equal(getCalendarStreaks(["2026-09-05", "2026-09-06", "2026-09-08", "2026-09-09"], "2026-09-09").longestStreak, 2);
assert.equal(getCalendarStreaks(["2026-09-09", "2026-09-09"], "2026-09-09").currentStreak, 1);
assert.deepEqual(monthCompletion(4, 2026, 9, "2026-09-09"), { daysElapsedInMonth: 9, monthCompletionRate: 44 });
assert.equal(makeYearDays(2024, new Map(), "2024-01-01").length, 366);
assert.equal(makeMonthDays(2026, 9, new Map([["2026-09-09", 2]]), "2026-09-09", (date) => date).find((day) => day.date === "2026-09-09")?.count, 2);

console.log("calendar stats checks passed");
