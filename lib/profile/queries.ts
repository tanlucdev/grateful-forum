import { cache } from "react";
import { loadJournalContext } from "./load-journal-context";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toEntryMetadata, type EntryRow } from "@/lib/entries/records";
import type { JournalEntry } from "./dto";
import type { JournalPagination, ProfileQuery } from "./pagination";

export type JournalStatistics = {
  timezone: string;
  total: number; publicTotal: number; streak: number; currentStreak: number; longestStreak: number;
  yearBuckets: Record<string, number>; weekBuckets: Record<string, number>;
  monthEntries: number; activeDaysThisMonth: number; currentMonthActiveDays: number; previous: number;
};
export const queryJournalStatistics = cache(async (supabase: SupabaseClient, timezone: string | null = null, year: number | null = null, month: number | null = null, profileId?: string): Promise<JournalStatistics> => {
  if (profileId === undefined && timezone === null && year === null && month === null) {
    const context = await loadJournalContext();
    if (context) return context.statistics;
  }
  const { data, error } = await supabase.rpc("journal_statistics", { profile_id: profileId ?? null, zone: timezone, viewed_year: year, viewed_month: month });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("journal_statistics_unavailable");
  return data as JournalStatistics;
});
export async function queryJournalPage(supabase: SupabaseClient, query: ProfileQuery, profileId?: string): Promise<{ entries: JournalEntry[]; pagination: JournalPagination }> {
  const { data, error } = await supabase.rpc("journal_page", {
    profile_id: profileId ?? null, public_only: query.tab === "public", cursor_time: query.cursor?.time ?? null,
    cursor_id: query.cursor?.id ?? null, backwards: query.cursor?.backwards ?? false, target_id: query.entry ?? null,
  });
  if (error) throw new Error(error.message);
  const { rows, ...pagination } = data as JournalPagination & { rows: EntryRow[] };
  return { pagination, entries: rows.map((row) => ({ id: row.id, content: row.content, visibility: row.visibility, createdAt: row.created_at, metadata: toEntryMetadata(row), entryKind: row.entry_kind, handwritingData: null, handwritingPreviewUrl: row.handwriting_preview_url })) };
}

