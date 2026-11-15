import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { entrySelect, toEntryMetadata, type EntryRow } from "../entries/records.ts";

const pageSize = 12;
export const savedPageSchema = z.coerce.number().int().min(1).max(10000).catch(1);

export async function querySavedEntries(supabase: SupabaseClient, userId: string, page: number) {
  const { data, error } = await supabase
    .from("entry_bookmarks")
    .select(`created_at, entry_id, entries!inner(${entrySelect})`)
    .eq("user_id", userId)
    .in("entries.visibility", ["public", "anonymous"])
    .is("entries.hidden_at", null)
    .is("entries.owner_deleted_at", null)
    .order("created_at", { ascending: false })
    .order("entry_id", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize)
    .returns<{ entries: EntryRow }[]>();
  if (error) throw new Error(error.message);
  return {
    page,
    hasNext: (data?.length ?? 0) > pageSize,
    entries: (data ?? []).slice(0, pageSize).map(({ entries: row }) => ({
      id: row.id,
      content: row.content,
      createdAt: row.created_at,
      entryKind: row.entry_kind,
      metadata: toEntryMetadata(row),
    })),
  };
}

export type SavedEntriesPage = Awaited<ReturnType<typeof querySavedEntries>>;
