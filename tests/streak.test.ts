import assert from "node:assert/strict";
import { getStreak } from "../lib/profile/streak.ts";

const today = new Date();
const yesterday = new Date(today);
yesterday.setUTCDate(today.getUTCDate() - 1);

assert.equal(getStreak([]), 0);
assert.equal(getStreak([today.toISOString()]), 1);
assert.equal(getStreak([today.toISOString(), yesterday.toISOString()]), 2);

console.log("streak checks passed");
