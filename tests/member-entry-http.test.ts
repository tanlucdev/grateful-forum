import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { AwsClient } from "aws4fetch";
import { getR2Env } from "../lib/entry-media/mutations.ts";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

// Explicit opt-in: creates a temporary account, writes entries, then removes fixtures.
assert.equal(process.env.ENTRY_TEST_LIVE, "1", "Set ENTRY_TEST_LIVE=1 with Supabase credentials for a disposable live fixture");
const base = process.env.ENTRY_TEST_BASE_URL ?? "http://localhost:4317";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const r2 = getR2Env();
const storage = new AwsClient({ accessKeyId: r2.R2_ACCESS_KEY_ID, secretAccessKey: r2.R2_SECRET_ACCESS_KEY, service: "s3", region: "auto" });
const email = `entry-check-${randomUUID()}@example.com`;
const password = randomUUID();
const { data: fixture, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
assert.ifError(error);
const userId = fixture.user!.id;
const jar = new Map<string, string>();
const client = createServerClient(url, key, { cookies: { getAll: () => [...jar].map(([name, value]) => ({ name, value })), setAll: (values) => values.forEach(({ name, value }) => jar.set(name, value)) } });
const assets = new Set<string>();
const preview = new File([Buffer.from("UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", "base64")], "preview.webp", { type: "image/webp" });
const document = { version: 1, orientation: "portrait", strokes: [{ color: "#145C34", points: [{ x: 100, y: 100, pressure: 0.5 }] }] };
try {
  assert.ifError((await client.auth.signInWithPassword({ email, password })).error);
  const cookie = [...jar].map(([name, value]) => `${name}=${value}`).join("; ");
  const upload = new FormData(); upload.set("file", preview);
  const mediaResponse = await fetch(`${base}/api/entry-media`, { method: "POST", headers: { cookie }, body: upload });
  const media = await mediaResponse.json();
  assert.equal(mediaResponse.status, 200, JSON.stringify(media));
  assets.add(media.path);
  const largeImage = new Uint8Array(5 * 1024 * 1024);
  largeImage.set(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aN1cAAAAASUVORK5CYII=", "base64"));
  const largeUpload = new FormData();
  largeUpload.set("file", new File([largeImage], "limit.png", { type: "image/png" }));
  const largeResponse = await fetch(`${base}/api/entry-media`, { method: "POST", headers: { cookie }, body: largeUpload });
  const largeMedia = await largeResponse.json();
  assert.equal(largeResponse.status, 200, JSON.stringify(largeMedia));
  assert.equal(largeMedia.uploaded, true);
  assets.add(largeMedia.path);
  for (const visibility of ["private", "public", "anonymous"]) {
    if (visibility === "public") {
      const response = await fetch(`${base}/api/entries`, { method: "POST", headers: { cookie, "Content-Type": "application/json" }, body: JSON.stringify({ visibility, gratitudes: ["Temporary access verification"], imageUrl: media.url }) });
      assert.equal(response.status, 200);
      assert.equal((await response.json()).saved, true);
    } else {
      const body = new FormData(); body.set("document", JSON.stringify(document)); body.set("visibility", visibility);
      if (visibility !== "private") body.set("preview", preview);
      const ink = await fetch(`${base}/api/entries/handwritten`, { method: "POST", headers: { cookie }, body });
      assert.equal(ink.status, 200, await ink.clone().text());
      assert.equal((await ink.json()).saved, true);
    }
  }
  const quota = await (await fetch(`${base}/api/entries/quota`, { headers: { cookie } })).json();
  assert.equal(quota.remaining, 0);
  const extra = await fetch(`${base}/api/entries`, { method: "POST", headers: { cookie, "Content-Type": "application/json" }, body: JSON.stringify({ visibility: "public", gratitudes: ["Fourth entry"] }) });
  assert.equal(extra.status, 429);
  assert.equal((await extra.json()).code, "daily_entry_limit");
  assert.ok(Number(extra.headers.get("retry-after")) > 0);
  const extraInkBody = new FormData(); extraInkBody.set("document", JSON.stringify(document)); extraInkBody.set("visibility", "private");
  const extraInk = await fetch(`${base}/api/entries/handwritten`, { method: "POST", headers: { cookie }, body: extraInkBody });
  assert.equal(extraInk.status, 429);
  assert.equal((await extraInk.json()).code, "daily_entry_limit");
  for (const visibility of ["public", "anonymous"]) {
    const filtered = await (await fetch(`${base}/api/feed?visibility=${visibility}`, { headers: { cookie } })).json();
    assert.ok(filtered.items.every((item: { visibility: string }) => item.visibility === visibility));
  }
  const feed = await (await fetch(`${base}/api/feed`, { headers: { cookie } })).json();
  assert.equal(feed.requiresLogin, false);
  const next = await fetch(`${base}/api/feed?cursor=2027-01-01T00:00:00Z`, { headers: { cookie } });
  assert.equal(next.status, 200);
  assert.equal((await next.json()).requiresLogin, false);
  const rows = await admin.from("entries").select("user_id, visibility, entry_kind, image_url, handwriting_preview_url").eq("user_id", userId);
  assert.ifError(rows.error); assert.equal(rows.data!.length, 3);
  for (const row of rows.data!) assert.equal(row.user_id, userId);
  assert.equal(rows.data!.find(row => row.visibility === "private" && row.entry_kind === "handwritten")!.handwriting_preview_url, null);
  console.log("member HTTP: three visibility modes, mixed-method daily allowance, images, handwriting, feed filters and pagination passed");
} finally {
  const { data } = await admin.from("entries").select("handwriting_preview_url").eq("user_id", userId);
  for (const row of data ?? []) {
    const prefix = `${r2.R2_PUBLIC_URL.replace(/\/$/, "")}/`;
    if (row.handwriting_preview_url?.startsWith(prefix)) assets.add(row.handwriting_preview_url.slice(prefix.length));
  }
  const deletion = await admin.auth.admin.deleteUser(userId); assert.ifError(deletion.error);
  for (const path of assets) {
    const response = await fetch(await storage.sign(`${r2.R2_ENDPOINT.replace(/\/$/, "")}/${r2.R2_BUCKET_NAME}/${path}`, { method: "DELETE", signal: AbortSignal.timeout(20_000) }), { redirect: "error" });
    assert.equal(response.status, 204, "Fixture image cleanup failed");
  }
  console.log("temporary account, entries and uploaded images removed");
}
