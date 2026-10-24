import assert from "node:assert/strict";
import { isMissingCalendarTourColumn, isMissingTimezoneColumn, shouldFallbackCalendarTour } from "../lib/calendar/errors.ts";

assert.equal(isMissingTimezoneColumn("Could not find the 'timezone' column of 'profiles' in the schema cache"), true);
assert.equal(isMissingTimezoneColumn("permission denied for table profiles"), false);
assert.equal(isMissingCalendarTourColumn("column profiles.calendar_tour_seen_at does not exist"), true);
assert.equal(isMissingCalendarTourColumn("permission denied for table profiles"), false);
assert.equal(shouldFallbackCalendarTour({ message: "column profiles.calendar_tour_seen_at does not exist" }), true);
assert.equal(shouldFallbackCalendarTour({ message: "permission denied for table profiles" }), false);

console.log("calendar queries checks passed");
