import type { SupabaseClient } from "@supabase/supabase-js";
import { findRecentSpaces } from "./recent-spaces-repository.ts";

export async function getRecentSpaces(supabase: SupabaseClient, userId: string | null) {
  if (!userId) return [];
  const rows = await findRecentSpaces(supabase, userId);
  return normalizeRecentSpaces(rows.map(({ space }) => space));
}

export function normalizeRecentSpaces(values: Array<string | null>) {
  const seen = new Set<string>();
  return values.flatMap((space) => {
    const value = space?.trim();
    const key = value?.toLocaleLowerCase();
    if (!value || !key || seen.has(key) || seen.size >= 8) return [];
    seen.add(key);
    return [value];
  });
}
