import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getStreak } from "./streak";
import type { ProfileDashboard } from "./types";

export async function loadOwnProfileDashboard(): Promise<ProfileDashboard | null> {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return null;
  }

  const [{ data: profileRow }, { data: entries }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, bio")
      .eq("id", auth.user.id)
      .single(),
    supabase
      .from("entries")
      .select("id, content, visibility, created_at")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }),
  ]);

  const profile = profileRow ?? {
    id: auth.user.id,
    display_name: auth.user.user_metadata?.display_name ?? "Grateful human",
    username: null,
    avatar_url: null,
    bio: null,
  };

  const journal = entries ?? [];

  return {
    profile: {
      id: profile.id,
      displayName: profile.display_name,
      username: profile.username,
      avatarUrl: profile.avatar_url,
      bio: profile.bio,
    },
    entryCount: journal.length,
    streak: getStreak(journal.map((entry) => entry.created_at)),
    entries: journal.map((entry) => ({
      id: entry.id,
      content: entry.content,
      visibility: entry.visibility,
      createdAt: entry.created_at,
    })),
  };
}
