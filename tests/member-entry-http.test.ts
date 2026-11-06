import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

// Explicit opt-in: creates a temporary account, writes entries, then removes fixtures.
assert.equal(process.env.ENTRY_TEST_LIVE, "1", "Set ENTRY_TEST_LIVE=1 with Supabase credentials for a disposable live fixture");
const base = process.env.ENTRY_TEST_BASE_URL ?? "http://localhost:4317";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
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
    const match = row.handwriting_preview_url?.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    if (match) assets.add(match[1]);
  }
  const deletion = await admin.auth.admin.deleteUser(userId); assert.ifError(deletion.error);
  for (const publicId of assets) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createHash("sha1").update(`public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`).digest("hex");
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`, { method: "POST", body: new URLSearchParams({ public_id: publicId, timestamp: String(timestamp), signature, api_key: process.env.CLOUDINARY_API_KEY! }) });
    assert.equal(response.status, 200, "Fixture image cleanup failed");
  }
  console.log("temporary account, entries and uploaded images removed");
}
