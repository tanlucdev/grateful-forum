import type { CreateEntryResponse } from "@/lib/entries/dto";
import type { EntryVisibility } from "@/lib/entries/types";
import { fetchJson } from "./fetch-json";

export function createEntry(content: string, visibility: EntryVisibility) {
  return fetchJson<CreateEntryResponse>(
    "/api/entries",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, visibility }),
    },
    "Could not save entry.",
  );
}
