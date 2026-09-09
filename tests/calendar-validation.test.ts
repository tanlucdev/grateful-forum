import assert from "node:assert/strict";
import { calendarQuerySchema, parseCalendarQuery, resolveCalendarQueryDefaults } from "../lib/calendar/validation.ts";

assert.throws(() => parseCalendarQuery(new URLSearchParams("year=1999")));
assert.throws(() => parseCalendarQuery(new URLSearchParams("month=13")));
assert.throws(() => parseCalendarQuery(new URLSearchParams("date=2026-02-31")));
assert.throws(() => parseCalendarQuery(new URLSearchParams("view=day")));
assert.equal(calendarQuerySchema.parse({}).view, "year");
assert.deepEqual(resolveCalendarQueryDefaults(calendarQuerySchema.parse({}), "Asia/Ho_Chi_Minh", new Date("2026-09-08T18:00:00.000Z")), { year: 2026, month: 9, selectedDate: "2026-09-09", today: "2026-09-09" });
assert.deepEqual(resolveCalendarQueryDefaults(calendarQuerySchema.parse({ year: 2026, month: 8 }), "Asia/Ho_Chi_Minh", new Date("2026-09-08T18:00:00.000Z")), { year: 2026, month: 8, selectedDate: "2026-08-01", today: "2026-09-09" });
assert.equal(resolveCalendarQueryDefaults(calendarQuerySchema.parse({ year: 2026, month: 8, date: "2026-09-09" }), "Asia/Ho_Chi_Minh", new Date("2026-09-08T18:00:00.000Z")).selectedDate, "2026-08-01");

console.log("calendar validation checks passed");
