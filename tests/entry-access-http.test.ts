import assert from "node:assert/strict";

const base = process.env.ENTRY_TEST_BASE_URL ?? "http://localhost:3000";
for (const cookie of ["", "sb-invalid-auth-token=expired-session"]) {
  for (const path of ["/api/entries", "/api/entries/handwritten", "/api/entry-media"]) {
    const response = await fetch(`${base}${path}`, { method: "POST", headers: { cookie }, body: "invalid body; auth must run first" });
    assert.equal(response.status, 401, path);
    assert.equal((await response.json()).code, "auth_required", path);
  }
}
for (const locale of ["vi", "en"]) {
  for (const query of ["", "?tour=first-entry", "?tour=invalid"]) {
    const response = await fetch(`${base}/${locale}/write${query}`, { redirect: "manual" });
    const expected = `/${locale}/auth?next=${encodeURIComponent(`/${locale}/write${query === "?tour=first-entry" ? query : ""}`)}`;
    const html = await response.text();
    assert.ok(response.headers.get("location") === expected || html.includes(`NEXT_REDIRECT;replace;${expected};`), expected);
    assert.ok(!html.includes('id="gratitude-0"'), "Guests must never receive the composer");
  }
  const preview = await (await fetch(`${base}/${locale}/feed/preview`)).text();
  assert.ok(preview.includes(`/${locale}/auth?next=%2F${locale}%2Fwrite`));
  assert.ok(!preview.includes('aria-label="Primary navigation"'));
  assert.ok(!preview.includes('aria-label="Điều hướng chính"'));
  assert.ok(!preview.includes('name="report"'));
}
console.log("entry access HTTP checks passed");
