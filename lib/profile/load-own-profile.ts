import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { entrySelect, toEntryMetadata } from "@/lib/entries/records";
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
      .select(entrySelect)
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }),
  ]);

  const profile = profileRow ?? {
    id: auth.user.id,
    display_name: auth.user.user_metadata?.display_name ?? auth.user.email?.split("@")[0] ?? "",
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
      email: auth.user.email ?? null,
    },
    entryCount: journal.length,
    streak: getStreak(journal.map((entry) => entry.created_at)),
    entries: journal.map((entry) => ({
      id: entry.id,
      content: entry.content,
      visibility: entry.visibility,
      createdAt: entry.created_at,
      metadata: toEntryMetadata(entry),
    })),
  };
}

export async function loadOwnShellProfile() {
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
      .select("id, display_name, avatar_url")
      .eq("id", auth.user.id)
      .single(),
    supabase
      .from("entries")
      .select("created_at")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false }),
  ]);

  return {
    avatarUrl: profileRow?.avatar_url || "",
    displayName: profileRow?.display_name || auth.user.user_metadata?.display_name || auth.user.email?.split("@")[0] || "Tài khoản",
    email: auth.user.email || "",
    signedIn: true,
    streak: getStreak((entries ?? []).map((entry) => entry.created_at)),
  };
}
