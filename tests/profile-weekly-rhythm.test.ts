import assert from "node:assert/strict";
import { makeWeeklyRhythm } from "../lib/profile/weekly-rhythm.ts";

const week = makeWeeklyRhythm(
  [
    { createdAt: "2026-09-06T18:00:00.000Z" },
    { createdAt: "2026-09-08T02:00:00.000Z" },
    { createdAt: "2026-09-08T03:00:00.000Z" },
    { createdAt: "2026-09-10T00:30:00.000Z" },
    { createdAt: "2026-09-13T17:01:00.000Z" },
  ],
  "Asia/Ho_Chi_Minh",
  new Date("2026-09-10T04:00:00.000Z"),
);

assert.deepEqual(
  week.map(({ active, count, date, isToday, label }) => ({ active, count, date, isToday, label })),
  [
    { active: true, count: 1, date: "2026-09-07", isToday: false, label: "T2" },
    { active: true, count: 2, date: "2026-09-08", isToday: false, label: "T3" },
    { active: false, count: 0, date: "2026-09-09", isToday: false, label: "T4" },
    { active: true, count: 1, date: "2026-09-10", isToday: true, label: "T5" },
    { active: false, count: 0, date: "2026-09-11", isToday: false, label: "T6" },
    { active: false, count: 0, date: "2026-09-12", isToday: false, label: "T7" },
    { active: false, count: 0, date: "2026-09-13", isToday: false, label: "CN" },
  ],
);

console.log("profile weekly rhythm checks passed");
