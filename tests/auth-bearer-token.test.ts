import assert from "node:assert/strict";
import { parseBearerToken } from "../lib/auth/bearer-token.ts";

assert.deepEqual(parseBearerToken(null), { ok: true, token: null });
assert.deepEqual(parseBearerToken("Bearer abc.def"), { ok: true, token: "abc.def" });
assert.deepEqual(parseBearerToken("bearer token"), { ok: true, token: "token" });
assert.deepEqual(parseBearerToken("Basic token"), { ok: false, token: null });

console.log("auth bearer token checks passed");
