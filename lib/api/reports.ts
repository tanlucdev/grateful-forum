import { fetchJson } from "./fetch-json";

export function reportEntry(entryId: string, reason: string) {
  return fetchJson<{ saved: boolean }>(
    "/api/reports",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId, reason }),
    },
    "Could not report entry.",
  );
}
