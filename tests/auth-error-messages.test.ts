import assert from "node:assert/strict";
import { normalizeAuthErrorCode } from "../lib/auth/errors.ts";

assert.equal(
  normalizeAuthErrorCode("Email rate limit exceeded"),
  "email_rate_limit",
);

assert.equal(
  normalizeAuthErrorCode("User already registered"),
  "email_already_registered",
);

assert.equal(normalizeAuthErrorCode("Other error"), "auth_failed");

console.log("auth error checks passed");
