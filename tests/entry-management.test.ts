import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { entryRouteParamsSchema, updateEntryRequestSchema } from "../lib/entries/schema.ts";
import { softDeleteEntryData } from "../lib/entries/ownership.ts";

assert.deepEqual(
  entryRouteParamsSchema.parse({ id: "00000000-0000-4000-8000-000000000001" }),
  { id: "00000000-0000-4000-8000-000000000001" },
);
assert.throws(() => entryRouteParamsSchema.parse({ id: "not-a-uuid" }));
assert.deepEqual(updateEntryRequestSchema.parse({ visibility: "anonymous" }), { visibility: "anonymous" });
assert.throws(() => updateEntryRequestSchema.parse({ visibility: "friends" }));
assert.throws(() => updateEntryRequestSchema.parse({ visibility: "public", content: "must not change" }));
assert.deepEqual(
  softDeleteEntryData(new Date("2026-09-28T00:00:00.000Z")),
  { owner_deleted_at: "2026-09-28T00:00:00.000Z" },
);

const root = process.cwd();
const migration = readFileSync(`${root}/supabase/migrations/20260928110000_owner_deleted_entries.sql`, "utf8");
assert.match(migration, /add column if not exists owner_deleted_at timestamptz/);
assert.match(migration, /owner_deleted_at is null/);
assert.doesNotMatch(migration, /drop policy if exists "Admins manage entries"/);
assert.match(readFileSync(`${root}/lib/entries/mutations.ts`, "utf8"), /update\(\{ visibility \}\)/);
assert.match(readFileSync(`${root}/lib/entries/mutations.ts`, "utf8"), /update\(softDeleteEntryData\(\)\)/);

for (const file of [
  "lib/feed/queries.ts",
  "lib/feed/mutations.ts",
  "lib/reports/mutations.ts",
  "lib/profile/load-own-profile.ts",
  "lib/profile/load-public-profile.ts",
  "lib/calendar/queries.ts",
]) {
  assert.match(readFileSync(`${root}/${file}`, "utf8"), /owner_deleted_at/);
}

console.log("entry management checks passed");
