// Run: node --experimental-strip-types tests/profile-share.test.mjs
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    return nextResolve(specifier.startsWith("@/")
      ? new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href
      : specifier, context);
  },
});

const { toProfileView } = await import("../app/[locale]/profile/_components/profile-view.ts");
const id = "e7c119af-d662-4b7a-bb1e-fbe86d08da18";
const dashboard = {
  profile: { id, displayName: "Tên có dấu", username: "custom_name" },
  entries: [], entryCount: 0, streak: 0, timezone: "Asia/Ho_Chi_Minh",
};
for (const locale of ["vi", "en"]) {
  const view = toProfileView(dashboard, locale);
  for (const origin of ["https://example.com", "http://localhost:3000"]) {
    assert.equal(new URL(view.shareUrl, origin).href, `${origin}/${locale}/profile/${id}`);
  }
  dashboard.profile.displayName = "Changed name";
  assert.equal(toProfileView(dashboard, locale).shareUrl, view.shareUrl);
}
console.log("profile share URL checks passed");
