import type { CreateEntryResponse } from "@/lib/entries/dto";
import { fetchJson } from "./fetch-json";
import type { CreateEntryRequest } from "@/lib/entries/dto";

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
