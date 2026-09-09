import assert from "node:assert/strict";
import { loginHref, safeAuthRedirect } from "../lib/auth/redirects.ts";

assert.equal(safeAuthRedirect("/profile?tab=moments"), "/profile?tab=moments");
assert.equal(safeAuthRedirect("https://bad.test"), "/feed");
assert.equal(safeAuthRedirect("//bad.test"), "/feed");
assert.equal(loginHref("/calendar?month=9&year=2026"), "/auth?next=%2Fcalendar%3Fmonth%3D9%26year%3D2026");
assert.equal(loginHref("/profile"), "/auth?next=%2Fprofile");
