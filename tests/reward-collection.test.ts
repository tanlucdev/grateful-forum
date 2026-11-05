import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildRewardOverview } from "../lib/rewards/stats.ts";
import type { RewardEntry } from "../lib/rewards/dto.ts";

const entry = (date: string, index = 0, gratitudes: string[] = [], visibility = "private"): RewardEntry => ({ id: String(index), created_at: date, gratitudes, visibility });
const now = new Date("2026-11-05T10:00:00Z");
const empty = buildRewardOverview([], "Asia/Ho_Chi_Minh", now);
assert.equal(empty.badges.length, 12);
assert.ok(empty.badges.every((badge) => badge.status === "locked" && badge.current === 0 && badge.earnedAt === null));
assert.deepEqual(empty.stats, { currentStreak: 0, longestStreak: 0, totalEntries: 0, activeDays: 0, activeMonths: 0, earnedBadges: 0 });

const dates = Array.from({ length: 10 }, (_, index) => entry(`2026-10-${String(index + 1).padStart(2, "0")}T00:59:00Z`, index, ["one"], "anonymous"));
const result = buildRewardOverview([...dates].reverse(), "Asia/Ho_Chi_Minh", now);
assert.equal(result.stats.currentStreak, 0);
assert.equal(result.stats.longestStreak, 10);
assert.equal(result.badges.find((badge) => badge.id === 3)?.earnedAt, dates[6].created_at);
assert.equal(result.badges.find((badge) => badge.id === 10)?.earnedAt, dates[4].created_at);
assert.equal(result.badges.find((badge) => badge.id === 9)?.status, "earned");
assert.equal(result.badges.find((badge) => badge.id === 7)?.current, 0);
assert.equal(result.badges.find((badge) => badge.id === 6)?.status, "growing");

const sameDay = buildRewardOverview([entry("2026-11-04T22:00:00Z", 1, ["one", " "]), entry("2026-11-04T23:00:00Z", 2, ["two", "three"])], "Asia/Ho_Chi_Minh", now);
assert.equal(sameDay.stats.activeDays, 1);
assert.equal(sameDay.stats.currentStreak, 1);
assert.equal(sameDay.badges.find((badge) => badge.id === 6)?.status, "earned");
assert.equal(sameDay.badges.find((badge) => badge.id === 9)?.current, 1);
assert.equal(buildRewardOverview([entry("2026-11-04T00:00:00Z")], "Asia/Ho_Chi_Minh", now).stats.currentStreak, 1);
assert.equal(buildRewardOverview([entry("2026-11-03T00:00:00Z")], "Asia/Ho_Chi_Minh", now).stats.currentStreak, 0);
assert.equal(buildRewardOverview([entry("2099-01-01T00:00:00Z"), entry("invalid", 2)], "UTC", now).stats.totalEntries, 0);
const comeback = buildRewardOverview([entry("2026-11-01T00:00:00Z"), entry("2026-11-03T00:00:00Z", 1)], "UTC", now);
assert.equal(comeback.badges.find((badge) => badge.id === 5)?.earnedAt, "2026-11-03T00:00:00Z");
const eightAm = buildRewardOverview([entry("2026-11-05T01:00:00Z")], "Asia/Ho_Chi_Minh", now);
assert.equal(eightAm.badges.find((badge) => badge.id === 9)?.current, 0);
const activeYear = Array.from({ length: 365 }, (_, index) => entry(new Date(Date.UTC(2024, 0, 1 + index * 2, 10)).toISOString(), index));
const year = buildRewardOverview(activeYear, "UTC", now);
assert.equal(year.badges.find((badge) => badge.id === 12)?.status, "earned");
assert.equal(year.stats.longestStreak, 1);
// DST boundary: calendar days, not 24-hour intervals.
const dst = buildRewardOverview([entry("2026-03-07T13:00:00Z"), entry("2026-03-08T12:00:00Z", 1), entry("2026-03-09T12:00:00Z", 2)], "America/New_York", new Date("2026-03-09T20:00:00Z"));
assert.equal(dst.stats.currentStreak, 3);
for (const badge of result.badges) {
  const svg = await readFile(new URL(`../public/stitch/reward/badge-${badge.id}.svg`, import.meta.url), "utf8");
  assert.ok(svg.includes('viewBox="0 0 100 100"'));
  assert.ok(!/<script|\bon\w+=|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i.test(svg));
  assert.ok(badge.current >= 0 && badge.current <= badge.total);
}
console.log("reward collection checks passed");
