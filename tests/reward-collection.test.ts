import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { badges } from "../app/[locale]/reward/_components/badges.ts";

assert.equal(badges.length, 12);
assert.equal(new Set(badges.map((badge) => badge.id)).size, badges.length);
assert.deepEqual(["earned", "growing", "locked"].map((status) => badges.filter((badge) => badge.status === status).length), [6, 3, 3]);
assert.deepEqual(["streak", "habit", "community"].map((category) => badges.filter((badge) => badge.category === category).length), [6, 4, 2]);
for (const badge of badges) {
  const svg = await readFile(new URL(`../public/stitch/reward/badge-${badge.id}.svg`, import.meta.url), "utf8");
  assert.ok(svg.includes('viewBox="0 0 100 100"'), `badge ${badge.id} has no valid viewBox`);
  assert.ok(!/<script|\bon\w+=|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i.test(svg), `badge ${badge.id} has active or remote content`);
  if (badge.status === "earned") assert.ok(badge.date && Number.isFinite(Date.parse(badge.date)));
  else assert.ok(badge.current != null && badge.total != null && badge.current >= 0 && badge.current < badge.total);
}
console.log("reward collection checks passed");
