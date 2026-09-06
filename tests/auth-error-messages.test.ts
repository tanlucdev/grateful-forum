import assert from "node:assert/strict";
import { normalizeAuthErrorMessage } from "../lib/auth/errors.ts";

assert.equal(
  normalizeAuthErrorMessage("Email rate limit exceeded"),
  "Bạn đã yêu cầu email quá nhanh. Chờ một lát rồi thử lại.",
);

assert.equal(
  normalizeAuthErrorMessage("User already registered"),
  "Email này đã được dùng.",
);

assert.equal(normalizeAuthErrorMessage("Other error"), "Other error");

console.log("auth error checks passed");
