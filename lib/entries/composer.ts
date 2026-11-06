import { createEntryRequestSchema, entryRouteParamsSchema } from "./schema.ts";
import { composeEntryContent } from "./records.ts";
import { ENTRY_LIMIT } from "./types.ts";
import type { CreateEntryRequest } from "./dto.ts";

export function validComposerEntry(input: CreateEntryRequest) {
  return createEntryRequestSchema.safeParse(input).success && composeEntryContent(input).length <= ENTRY_LIMIT;
}

export function canSubmitEntry(valid: boolean, saving: boolean, saved: boolean) {
  return valid && !saving && !saved;
}

export function selectJournalEntry(entries: readonly { id: string }[], requested?: string | null) {
  const validId = entryRouteParamsSchema.safeParse({ id: requested }).success;
  const index = validId ? entries.findIndex((entry) => entry.id === requested) : -1;
  return { index: Math.max(index, 0), unavailable: Boolean(requested) && index < 0 };
}
