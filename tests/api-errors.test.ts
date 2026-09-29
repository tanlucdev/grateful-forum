import assert from "node:assert/strict";
import { ApiClientError, fetchJson } from "../lib/api/fetch-json.ts";

const originalFetch = globalThis.fetch;
globalThis.fetch = (async () => new Response(JSON.stringify({ code: "invalid_entry", error: "Invalid entry." }), { status: 400 })) as typeof fetch;

await assert.rejects(
  () => fetchJson("/api/entries", {}, "fallback"),
  (error: unknown) => error instanceof ApiClientError && error.code === "invalid_entry" && error.message === "Invalid entry.",
);

globalThis.fetch = originalFetch;
console.log("API error checks passed");
