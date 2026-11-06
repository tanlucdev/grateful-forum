import type { CreateEntryResponse, UpdateEntryResponse } from "@/lib/entries/dto";
import { fetchJson } from "./fetch-json.ts";
import type { CreateEntryRequest } from "@/lib/entries/dto";
import type { EntryVisibility } from "@/lib/entries/types";
import type { EntryDailyQuota } from "@/lib/entries/daily-quota";

export function getEntryQuota() {
  return fetchJson<EntryDailyQuota>("/api/entries/quota", { cache: "no-store" }, "Could not load daily allowance.");
}

export function createEntry(payload: CreateEntryRequest) {
  return fetchJson<CreateEntryResponse>(
    "/api/entries",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "Could not save entry.",
  );
}

export function getRecentSpaces() {
  return fetchJson<{ spaces: string[] }>("/api/entries/recent-spaces", { method: "GET" }, "Could not load recent spaces.");
}

export function updateEntryVisibility(id: string, visibility: EntryVisibility) {
  return fetchJson<UpdateEntryResponse>(
    `/api/entries/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility }),
    },
    "Could not update entry.",
  );
}

export function deleteEntry(id: string) {
  return fetchJson<{ saved: true }>(
    `/api/entries/${id}`,
    { method: "DELETE" },
    "Could not delete entry.",
  );
}
