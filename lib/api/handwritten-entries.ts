import type { CreateHandwrittenEntryRequest, CreateHandwrittenEntryResponse } from "@/lib/entries/dto";
import { fetchJson } from "./fetch-json";

export function createHandwrittenEntry(input: CreateHandwrittenEntryRequest, preview: File | null) {
  const body = new FormData();
  body.set("document", JSON.stringify(input.document));
  body.set("visibility", input.visibility);
  if (preview) body.set("preview", preview);
  return fetchJson<CreateHandwrittenEntryResponse>("/api/entries/handwritten", { method: "POST", body }, "Could not save handwritten entry.");
}
