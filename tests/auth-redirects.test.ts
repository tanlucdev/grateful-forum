import assert from "node:assert/strict";
import { localizedLoginHref, loginHref, safeAuthRedirect, safeLocalizedAuthRedirect } from "../lib/auth/redirects.ts";

assert.equal(safeAuthRedirect("/profile?tab=moments"), "/profile?tab=moments");
assert.equal(safeAuthRedirect("https://bad.test"), "/feed");
assert.equal(safeAuthRedirect("//bad.test"), "/feed");
assert.equal(loginHref("/calendar?month=9&year=2026"), "/auth?next=%2Fcalendar%3Fmonth%3D9%26year%3D2026");
assert.equal(loginHref("/profile"), "/auth?next=%2Fprofile");
assert.equal(loginHref("/calendar?month=9&year=2026", "en"), "/auth?next=%2Fen%2Fcalendar%3Fmonth%3D9%26year%3D2026");
assert.equal(localizedLoginHref("/profile", "vi"), "/vi/auth?next=%2Fvi%2Fprofile");
assert.equal(safeLocalizedAuthRedirect("/en/feed", "vi"), "/en/feed");
assert.equal(safeLocalizedAuthRedirect("//bad.test", "en"), "/en/feed");
