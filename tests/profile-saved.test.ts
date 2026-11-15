import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import { querySavedEntries, savedPageSchema } from "../lib/profile/saved-queries.ts";

for (const value of [undefined, "bad", "0", "-1", "1.5", "10001"]) assert.equal(savedPageSchema.parse(value), 1);
assert.equal(savedPageSchema.parse("2"), 2);

const calls: [string, ...unknown[]][] = [];
const rows = Array.from({ length: 13 }, (_, index) => ({ entries: {
  id: `post-${index}`, content: `Content ${index}`, created_at: "2026-11-13T00:00:00Z",
  visibility: "anonymous", user_id: "must-not-leak", entry_kind: "text",
  gratitudes: ["Gratitude"], reflection: null, quote: null,
  mood: null, washi: null, space: null, sticker: null, image_url: null, handwriting_preview_url: null,
} }));
let response: { data: typeof rows | null; error: { message: string } | null } = { data: rows, error: null };
const chain = Object.fromEntries(["from", "select", "eq", "in", "is", "order", "range"].map((method) => [method, (...args: unknown[]) => {
  calls.push([method, ...args]);
  return chain;
}])) as Record<string, (...args: unknown[]) => unknown>;
chain.returns = async () => response;
const client = chain as unknown as SupabaseClient;
const page = await querySavedEntries(client, "viewer-a", 2);
assert.equal(page.entries.length, 12);
assert.equal(page.hasNext, true);
assert.equal(page.page, 2);
assert.deepEqual(page.entries[0].metadata.gratitudes, ["Gratitude"]);
assert.equal("user_id" in page.entries[0], false);
assert.ok(calls.some(([method, column, value]) => method === "eq" && column === "user_id" && value === "viewer-a"));
assert.ok(calls.some(([method, column, value]) => method === "in" && column === "entries.visibility" && JSON.stringify(value) === '["public","anonymous"]'));
for (const field of ["hidden_at", "owner_deleted_at"]) assert.ok(calls.some(([method, column, value]) => method === "is" && column === `entries.${field}` && value === null));
assert.ok(calls.some(([method, start, end]) => method === "range" && start === 12 && end === 24));
assert.ok(calls.some(([method, column]) => method === "order" && column === "entry_id"));
response = { data: [], error: null };
assert.deepEqual(await querySavedEntries(client, "viewer-b", 1), { page: 1, hasNext: false, entries: [] });
response = { data: null, error: { message: "Database unavailable" } };
await assert.rejects(querySavedEntries(client, "viewer-a", 1), /Database unavailable/);
console.log("saved posts checks passed: viewer isolation, visible entries, pagination, metadata, empty and error states");
