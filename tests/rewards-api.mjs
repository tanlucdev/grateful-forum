// Run only against the local Postman simulation described in docs/api/rewards.md.
import assert from "node:assert/strict";
const base = process.env.REWARDS_TEST_URL || "http://localhost:3001";
const dependency = "http://localhost:4011/supabase";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "Fixture cookie is for localhost only");
const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const token = `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: "00000000-0000-4000-8000-000000000001", exp: Math.floor(Date.now() / 1000) + 3600 })}.fixture`;
const cookie = `sb-localhost-auth-token=base64-${encode({ access_token: token, refresh_token: "fixture-refresh", expires_at: Math.floor(Date.now() / 1000) + 3600, token_type: "bearer" })}`;
const mode = async (value) => {
  const response = await fetch(`${dependency}/__test-state`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: value }) });
  assert.equal(response.status, 200);
};
try {
  const guest = await fetch(`${base}/api/rewards`);
  assert.equal(guest.status, 401);
  assert.equal((await guest.json()).code, "auth_required");
  const invalid = await fetch(`${base}/api/rewards?userId=someone-else`, { headers: { cookie } });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).code, "invalid_query");
  await mode("normal");
  const response = await fetch(`${base}/api/rewards`, { headers: { cookie } });
  const data = await response.json();
  assert.equal(response.status, 200, JSON.stringify(data));
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(data.timezone, "Asia/Ho_Chi_Minh");
  assert.equal(data.stats.totalEntries, 1118);
  assert.equal(data.stats.longestStreak, 14);
  assert.equal(data.stats.currentStreak, 3);
  assert.equal(data.stats.activeDays, 18);
  assert.equal(data.badges.length, 12);
  assert.equal(data.badges.find((badge) => badge.id === 4).status, "earned");
  assert.equal(data.badges.find((badge) => badge.id === 7).current, 3);
  assert.ok(!JSON.stringify(data).includes("synthetic gratitude"));
  assert.ok(!JSON.stringify(data).includes("00000000-0000"));
  await mode("empty");
  const empty = await fetch(`${base}/api/rewards`, { headers: { cookie } }).then((result) => result.json());
  assert.equal(empty.stats.totalEntries, 0);
  assert.ok(empty.badges.every((badge) => badge.status === "locked" && badge.earnedAt === null));
  await mode("error");
  const failure = await fetch(`${base}/api/rewards`, { headers: { cookie } });
  assert.equal(failure.status, 500);
  assert.equal((await failure.json()).code, "rewards_failed");
  assert.equal(failure.headers.get("cache-control"), "private, no-store");
  console.log("rewards API: auth, query validation, owner scope, 3-page history, excluded rows, privacy, empty state, storage failure passed");
} finally { await mode("normal"); }
