import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import { updateProfileSchema } from "../lib/profile/validation.ts";
import { soulTitles, toSoulTitle } from "../lib/profile/soul-titles.ts";
import { updateOwnProfile } from "../lib/profile/mutations.ts";

const base = { displayName: "  Linh  ", username: "  LINH_123  ", avatarUrl: "/stitch/profile/avatar-desktop.jpg", bio: "  Hello  " };
for (const title of soulTitles) {
  const input = updateProfileSchema.parse({ ...base, soulTitle: title });
  assert.equal(input.displayName, "Linh");
  assert.equal(input.username, "linh_123");
  assert.equal(toSoulTitle(title), title);
  let saved: Record<string, unknown> | undefined;
  const client = { from(table: string) {
    assert.equal(table, "profiles");
    return { upsert: async (row: Record<string, unknown>) => { saved = row; return { error: null }; } };
  } } as unknown as SupabaseClient;
  await updateOwnProfile(client, "owner-id", input);
  assert.equal(saved?.soul_title, title);
  assert.equal(saved?.id, "owner-id");
  assert.equal(saved?.bio, "Hello");
  await updateOwnProfile(client, "owner-id", updateProfileSchema.parse(base));
  assert.ok(!Object.hasOwn(saved!, "soul_title"), "Older clients must preserve the saved title");
}
assert.equal(toSoulTitle("unknown"), soulTitles[0]);
for (const body of [null, { ...base, soulTitle: "unknown" }, { ...base, bio: "a".repeat(121) }, { ...base, username: [] }, { ...base, avatarUrl: "javascript:alert(1)" }, { ...base, avatarUrl: "//example.com/a.jpg" }]) {
  assert.equal(updateProfileSchema.safeParse(body).success, false);
}
await assert.rejects(updateOwnProfile({ from: () => ({ upsert: async () => ({ error: { message: "database unavailable" } }) }) } as unknown as SupabaseClient, "owner-id", updateProfileSchema.parse(base)), /database unavailable/);
console.log("profile edit checks passed: title persistence, validation, legacy clients, save failures");
