import assert from "node:assert/strict";
import { ApiClientError, fetchJson } from "../lib/api/fetch-json.ts";

const originalFetch = globalThis.fetch;

try {
  for (const [body, code, message] of [
    [JSON.stringify({ code: "invalid_entry", error: "Invalid entry." }), "invalid_entry", "Invalid entry."],
    ["<html>Bad Gateway</html>", "unknown", "fallback"],
    ["", "unknown", "fallback"],
    ["null", "unknown", "fallback"],
    [JSON.stringify({ code: 502, error: { message: "Bad Gateway" } }), "unknown", "fallback"],
  ]) {
    globalThis.fetch = async () => new Response(body, { status: 502 });
    await assert.rejects(
      () => fetchJson("/api/entries", {}, "fallback"),
      (error: unknown) => error instanceof ApiClientError && error.code === code && error.message === message,
    );
  }

  globalThis.fetch = async () => new Response(JSON.stringify({ saved: true }));
  assert.deepEqual(await fetchJson("/api/entries", {}, "fallback"), { saved: true });

  globalThis.fetch = async () => new Response("invalid JSON");
  await assert.rejects(() => fetchJson("/api/entries", {}, "fallback"), SyntaxError);
} finally {
  globalThis.fetch = originalFetch;
}

console.log("API error checks passed");
