import { getCurrentUser } from "@/lib/auth/current-user";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { entrySelect, toEntryMetadata } from "@/lib/entries/records";
import { getGuestId } from "@/lib/auth/guest-session";
import type { FeedPage } from "./dto";
import { emptyFeedReactionCounts } from "./engagement-state.ts";
import type { FeedReactionType } from "./validation.ts";
import type { FeedVisibilityFilter } from "./validation.ts";
import { feedAccess } from "./access.ts";

export async function loadFeedPage(cursor?: string | null, visibility: FeedVisibilityFilter = "all"): Promise<FeedPage> {
  if (!hasSupabaseEnv()) {
    feedAccess(false, cursor);
    return { items: [], nextCursor: null, requiresLogin: true };
  }

  const supabase = await createSupabaseServerClient();
  const auth = { user: await getCurrentUser() };
  const userId = auth.user?.is_anonymous ? null : auth.user?.id ?? null;
  const { pageSize, requiresLogin } = feedAccess(Boolean(userId), cursor);
  let query = supabase
    .from("entries")
    .select(entrySelect)
    .is("hidden_at", null)
    .is("owner_deleted_at", null)
    .in("visibility", ["public", "anonymous"])
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(pageSize + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }
  if (visibility !== "all") query = query.eq("visibility", visibility);

  const { data, error } = await query;

  if (error) {
    if (error.message.includes("'public.entries'") && error.message.includes("schema cache")) {
      return { items: [], nextCursor: null, requiresLogin };
    }

    throw new Error(error.message);
  }

  const rows = data ?? [];
  const pageRows = rows.length > pageSize ? rows.slice(0, pageSize) : rows;
  const entryIds = pageRows.map((row) => row.id);
  const guestId = userId ? null : await getGuestId();
  const profilesById = new Map<
    string,
    { id: string; display_name: string | null; username: string | null; avatar_url: string | null }
  >();
  const reactionsByEntry = new Map<string, ReturnType<typeof emptyFeedReactionCounts>>();
  const viewerReactionByEntry = new Map<string, FeedReactionType>();
  const bookmarkedEntryIds = new Set<string>();
  const userIds = Array.from(new Set(pageRows.filter((row) => row.visibility !== "anonymous").map((row) => row.user_id).filter(Boolean)));

  const engagementClient = entryIds.length ? tryCreateSupabaseAdminClient() : null;
  const empty = Promise.resolve({ data: [], error: null });
  const [profiles, counts, viewer, bookmarks] = await Promise.all([
    userIds.length ? supabase.from("profiles").select("id, display_name, username, avatar_url").in("id", userIds) : empty,
    engagementClient ? engagementClient.rpc("feed_reaction_counts", { entry_ids: entryIds }) : empty,
    engagementClient && (userId || guestId) ? engagementClient.from("entry_reactions").select("entry_id, reaction_type").in("entry_id", entryIds).eq(userId ? "user_id" : "guest_id", userId ?? guestId) : empty,
    engagementClient && (userId || guestId) ? engagementClient.from("entry_bookmarks").select("entry_id").in("entry_id", entryIds).eq(userId ? "user_id" : "guest_id", userId ?? guestId) : empty,
  ]);
  for (const result of [profiles, counts, viewer, bookmarks]) {
    if (result.error) throw new Error(result.error.message);
  }
  profiles.data?.forEach((profile) => profilesById.set(profile.id, profile));
  (counts.data as { entry_id: string; reaction_type: FeedReactionType; count: number }[] | null)?.forEach((row) => {
    const reactions = reactionsByEntry.get(row.entry_id) ?? emptyFeedReactionCounts();
    reactions[row.reaction_type] = Number(row.count);
    reactionsByEntry.set(row.entry_id, reactions);
  });
  viewer.data?.forEach((reaction) => viewerReactionByEntry.set(reaction.entry_id, reaction.reaction_type as FeedReactionType));
  bookmarks.data?.forEach((bookmark) => bookmarkedEntryIds.add(bookmark.entry_id));

  return {
    items: pageRows.map((row) => {
      const author = row.visibility !== "anonymous" && row.user_id ? profilesById.get(row.user_id) ?? null : null;

      return {
        id: row.id,
        content: row.content,
        visibility: row.visibility,
        createdAt: row.created_at,
        metadata: toEntryMetadata(row),
        entryKind: row.entry_kind,
        handwritingPreviewUrl: row.handwriting_preview_url,
        reactions: reactionsByEntry.get(row.id) ?? emptyFeedReactionCounts(),
        viewerReaction: viewerReactionByEntry.get(row.id) ?? null,
        viewerBookmarked: bookmarkedEntryIds.has(row.id),
        author: author
          ? {
              id: author.id,
              displayName: author.display_name,
              username: author.username,
              avatarUrl: author.avatar_url,
            }
          : null,
      };
    }),
    requiresLogin,
    nextCursor: !requiresLogin && rows.length > pageSize ? pageRows.at(-1)?.created_at ?? null : null,
  };
}

function tryCreateSupabaseAdminClient() {
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}
