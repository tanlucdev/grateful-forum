import { toSoulTitle } from "./soul-titles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { queryJournalPage } from "./queries";
import { loadJournalContext, loadJournalShellContext } from "./load-journal-context";
import type { ProfileQuery } from "./pagination";

import type { ProfileDashboard } from "./types";

export async function loadOwnProfileDashboard(query: ProfileQuery = { tab: "all" }): Promise<ProfileDashboard | null> {
  // journal_page excludes hidden_at and owner_deleted_at entries.
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const [contextResult, pageResult] = await Promise.allSettled([
    loadJournalContext(), queryJournalPage(supabase, query),
  ]);
  if (contextResult.status === "rejected") throw contextResult.reason;
  const context = contextResult.value;
  if (!context) return null;
  if (pageResult.status === "rejected") throw pageResult.reason;
  const { user, profile: profileRow, statistics } = context;
  const page = pageResult.value;

  const profile = profileRow ?? {
    id: user.id,
    display_name: user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "",
    username: null,
    avatar_url: null,
    bio: null,
  };

  return {
    profile: {
      id: profile.id,
      displayName: profile.display_name,
      username: profile.username,
      avatarUrl: profile.avatar_url,
      bio: profile.bio,
      soulTitle: toSoulTitle(profileRow?.soul_title),
      email: user.email ?? null,
    },
    entryCount: statistics.total,
    streak: statistics.streak,
    timezone: statistics.timezone,
    statistics,
    ...page,
  };
}

export async function loadOwnShellProfile() {
  const context = await loadJournalShellContext();
  if (!context || context.user.is_anonymous) return null;
  const { user, profile } = context;
  return {
    avatarUrl: profile?.avatar_url || "",
    displayName: profile?.display_name || user.user_metadata?.display_name || user.email?.split("@")[0] || "",
    email: user.email || "",
    signedIn: true,
  };
}
