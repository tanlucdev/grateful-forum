import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { migrateEntryMedia } from "../lib/entry-media/migration.ts";

const originalFetch = globalThis.fetch;
const env = {
  R2_ENDPOINT: "https://0123456789abcdef0123456789abcdef.r2.cloudflarestorage.com",
  R2_ACCESS_KEY_ID: "test-key", R2_SECRET_ACCESS_KEY: "test-secret",
  R2_BUCKET_NAME: "grateful-media", R2_PUBLIC_URL: "https://media.example.com",
};
const previousEnv = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]));
const source = "https://res.cloudinary.com/old-cloud/image/upload/v1/entries/photo.webp";
const row = (n: number) => ({ id: `00000000-0000-0000-0000-${String(n).padStart(12, "0")}`, image_url: source, handwriting_preview_url: n === 1 ? source : null });
let rows = Array.from({ length: 103 }, (_, n) => row(n + 1));
let uploads = 0;
let updates = 0;
let pages = 0;
let uploadStatus = 200;
let corruptDelivery = false;
let databaseFailure = false;
let concurrentChange = false;
const supabase = createClient("https://db.example.com", "test-service-key", { auth: { persistSession: false, autoRefreshToken: false } });
try {
  globalThis.fetch = (async (input, init) => {
    const request = input instanceof Request ? input : new Request(input, init);
    const url = new URL(request.url);
    if (url.hostname === "db.example.com") {
      assert.equal(url.pathname, "/rest/v1/entries");
      if (request.method === "GET") {
        pages++;
        assert.equal(url.searchParams.get("order"), "id.asc");
        assert.equal(url.searchParams.get("limit"), "100");
        assert.ok(url.searchParams.get("or")?.includes("handwriting_preview_url.like.https://res.cloudinary.com/%"));
        const cursor = url.searchParams.get("id")?.slice(3) ?? "";
        return Response.json(rows.filter((entry) => entry.id > cursor && [entry.image_url, entry.handwriting_preview_url].some((value) => value?.startsWith("https://res.cloudinary.com/"))).slice(0, 100));
      }
      assert.equal(request.method, "PATCH");
      updates++;
      if (databaseFailure) return Response.json({ message: "Database unavailable" }, { status: 500 });
      const patch = await request.json() as Partial<ReturnType<typeof row>>;
      const column = Object.keys(patch)[0] as "image_url" | "handwriting_preview_url";
      const entry = rows.find((entry) => `eq.${entry.id}` === url.searchParams.get("id"))!;
      assert.equal(url.searchParams.get(column), `eq.${source}`, "Updates must compare the old URL to avoid overwriting edits");
      if (concurrentChange) {
        concurrentChange = false;
        entry[column] = "https://external.example.com/changed.webp";
        return Response.json([]);
      }
      if (url.searchParams.get(column) !== `eq.${entry[column]}`) return Response.json([]);
      Object.assign(entry, patch);
      return Response.json([{ id: entry.id }]);
    }
    if (request.method === "PUT") {
      assert.equal(url.hostname, new URL(env.R2_ENDPOINT).hostname);
      uploads++;
      assert.deepEqual(new Uint8Array(await request.arrayBuffer()), new Uint8Array([1, 2, 3]));
      return new Response(null, { status: uploadStatus });
    }
    assert.ok(["res.cloudinary.com", "media.example.com"].includes(url.hostname));
    return new Response(new Uint8Array(corruptDelivery && url.hostname === "media.example.com" ? [9] : [1, 2, 3]), { headers: { "Content-Type": "image/webp" } });
  }) as typeof fetch;
  assert.deepEqual(await migrateEntryMedia(supabase), { entries: 103, references: 104, copied: 0, updated: 0, concurrentChanges: 0 });
  assert.equal(uploads, 0);
  assert.equal(updates, 0);
  Object.assign(process.env, env);
  concurrentChange = true;
  const stats = await migrateEntryMedia(supabase, true);
  assert.deepEqual(stats, { entries: 103, references: 104, copied: 1, updated: 103, concurrentChanges: 1 });
  assert.equal(uploads, 1, "Shared source URLs should only be copied once");
  assert.ok(pages >= 6, "Keyset pages must still work while migrated rows leave the filter");
  assert.equal((await migrateEntryMedia(supabase, true)).references, 0, "Reruns skip migrated URLs");
  for (const failure of ["upload", "checksum", "database"]) {
    rows = [row(1)];
    uploadStatus = failure === "upload" ? 403 : 200;
    corruptDelivery = failure === "checksum";
    databaseFailure = failure === "database";
    await assert.rejects(() => migrateEntryMedia(supabase, true));
    assert.equal(rows[0].image_url, source);
    assert.equal(rows[0].handwriting_preview_url, source);
  }
  console.log("media migration checks passed: dry run, keyset pages, deduplication, checksum, concurrent edits, reruns and failure preservation");
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(previousEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}
