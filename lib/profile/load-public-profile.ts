import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { queryJournalPage, queryJournalStatistics } from "./queries";
import type { ProfileQuery } from "./pagination";

import type { PublicProfile } from "./types";

export async function loadPublicProfile(id: string, query: ProfileQuery = { tab: "all" }): Promise<PublicProfile | null> {
  // journal_page excludes hidden_at and owner_deleted_at entries.
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url, bio")
    .eq("id", id)
    .single();

  if (!profileRow) {
    return null;
  }

  const [page, statistics] = await Promise.all([
    queryJournalPage(supabase, query, id),
    queryJournalStatistics(supabase, "UTC", new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, id),
  ]);

  return {
    profile: {
      id: profileRow.id,
      displayName: profileRow.display_name,
      username: profileRow.username,
      avatarUrl: profileRow.avatar_url,
      bio: profileRow.bio,
    },
    publicEntryCount: statistics.total,
    streak: statistics.streak,
    ...page,
  };
}
