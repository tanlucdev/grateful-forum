import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getStreak } from "./streak";
import type { PublicProfile } from "./types";

export async function loadPublicProfile(id: string): Promise<PublicProfile | null> {
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

  const { data: entries } = await supabase
    .from("entries")
    .select("id, content, visibility, created_at")
    .eq("user_id", id)
    .in("visibility", ["public", "anonymous"])
    .eq("hidden_at", null)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  const journal = entries ?? [];

  return {
    profile: {
      id: profileRow.id,
      displayName: profileRow.display_name,
      username: profileRow.username,
      avatarUrl: profileRow.avatar_url,
      bio: profileRow.bio,
    },
    publicEntryCount: journal.length,
    streak: getStreak(journal.map((entry) => entry.created_at)),
    entries: journal.map((entry) => ({
      id: entry.id,
      content: entry.content,
      visibility: entry.visibility,
      createdAt: entry.created_at,
    })),
  };
}
