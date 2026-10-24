import assert from "node:assert/strict";
import { makeWeeklyRhythm } from "../lib/profile/weekly-rhythm.ts";
import { makeMonthlyRhythm } from "../lib/profile/monthly-rhythm.ts";

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

const emptyWeek = makeWeeklyRhythm([], "Asia/Ho_Chi_Minh", new Date("2026-09-10T04:00:00Z"));
assert.equal(emptyWeek.length, 7);
assert.equal(emptyWeek.some((day) => day.active || day.count), false);
assert.equal(emptyWeek.findIndex((day) => day.isToday), 3);

const sunday = makeWeeklyRhythm([
  { createdAt: "2026-09-06T16:59:59Z" }, // Previous week in Vietnam.
  { createdAt: "2026-09-06T17:00:00Z" }, // Monday in Vietnam.
  { createdAt: "2026-09-06T18:00:00Z" }, // A second entry still counts as one active day.
  { createdAt: "2026-09-13T16:59:59Z" }, // Sunday in Vietnam.
  { createdAt: "2026-09-13T17:00:00Z" }, // Next week in Vietnam.
], "Asia/Ho_Chi_Minh", new Date("2026-09-13T16:59:59Z"));
assert.deepEqual(sunday.map((day) => day.count), [2, 0, 0, 0, 0, 0, 1]);
assert.equal(sunday.filter((day) => day.active).length, 2);
assert.equal(sunday[6].isToday, true);

console.log("profile weekly rhythm checks passed");

const monthNow = new Date("2026-10-23T17:00:00Z"); // October 24 in Vietnam.
assert.deepEqual(makeMonthlyRhythm([], "Asia/Ho_Chi_Minh", monthNow), {
  activeDays: 0, totalDays: 31, completionRate: 0,
});
assert.deepEqual(makeMonthlyRhythm([
  { createdAt: "2026-09-30T16:59:59Z" }, // September in Vietnam.
  { createdAt: "2026-09-30T17:00:00Z" }, // October 1 in Vietnam.
  { createdAt: "2026-10-01T03:00:00Z" }, // Same local day.
  { createdAt: "2026-10-23T17:00:00Z" }, // Today in Vietnam.
  { createdAt: "2026-10-24T17:00:00Z" }, // Future day.
  { createdAt: "2026-10-31T17:00:00Z" }, // November in Vietnam.
], "Asia/Ho_Chi_Minh", monthNow), {
  activeDays: 2, totalDays: 31, completionRate: 2 / 31,
});
for (const [year, totalDays] of [[2024, 29], [2026, 28]]) {
  const now = new Date(`${year}-02-${totalDays}T12:00:00Z`);
  const entries = Array.from({ length: totalDays }, (_, index) => ({
    createdAt: `${year}-02-${String(index + 1).padStart(2, "0")}T00:00:00Z`,
  }));
  assert.deepEqual(makeMonthlyRhythm(entries, "UTC", now), {
    activeDays: totalDays, totalDays, completionRate: 1,
  });
}
console.log("profile monthly rhythm checks passed");
