import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { entrySelect, toEntryMetadata } from "@/lib/entries/records";
import { getGuestId } from "@/lib/auth/guest-session";
import type { FeedPage } from "./dto";
import { emptyFeedReactionCounts } from "./engagement-state.ts";
import type { FeedReactionType } from "./validation.ts";

const PAGE_SIZE = 8;

export async function loadFeedPage(cursor?: string | null): Promise<FeedPage> {
  if (!hasSupabaseEnv()) {
    return { items: [], nextCursor: null };
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("entries")
    .select(entrySelect)
    .is("hidden_at", null)
    .in("visibility", ["public", "anonymous"])
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(PAGE_SIZE + 1);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    if (error.message.includes("'public.entries'") && error.message.includes("schema cache")) {
      return { items: [], nextCursor: null };
    }

    throw new Error(error.message);
  }

  const rows = data ?? [];
  const pageRows = rows.length > PAGE_SIZE ? rows.slice(0, PAGE_SIZE) : rows;
  const entryIds = pageRows.map((row) => row.id);
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id ?? null;
  const guestId = userId ? null : await getGuestId();
  const profilesById = new Map<
    string,
    { id: string; display_name: string | null; username: string | null; avatar_url: string | null }
  >();
  const reactionsByEntry = new Map<string, ReturnType<typeof emptyFeedReactionCounts>>();
  const viewerReactionByEntry = new Map<string, FeedReactionType>();
  const bookmarkedEntryIds = new Set<string>();
  const userIds = Array.from(new Set(pageRows.map((row) => row.user_id).filter(Boolean)));

  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .in("id", userIds);

    profiles?.forEach((profile) => profilesById.set(profile.id, profile));
  }

  if (entryIds.length) {
    const engagementClient = tryCreateSupabaseAdminClient();

    if (engagementClient) {
      const { data: reactions, error: reactionsError } = await engagementClient
        .from("entry_reactions")
        .select("entry_id, reaction_type")
        .in("entry_id", entryIds);

      if (reactionsError && !reactionsError.message.includes("'public.entry_reactions'")) {
        throw new Error(reactionsError.message);
      }

      reactions?.forEach((reaction) => {
        const entryReactions = reactionsByEntry.get(reaction.entry_id) ?? emptyFeedReactionCounts();
        const reactionType = reaction.reaction_type as FeedReactionType;
        entryReactions[reactionType] += 1;
        reactionsByEntry.set(reaction.entry_id, entryReactions);
      });

      if (userId || guestId) {
        let viewerReactionsQuery = engagementClient.from("entry_reactions").select("entry_id, reaction_type").in("entry_id", entryIds);
        viewerReactionsQuery = userId ? viewerReactionsQuery.eq("user_id", userId) : viewerReactionsQuery.eq("guest_id", guestId);
        const { data: viewerReactions, error: viewerReactionsError } = await viewerReactionsQuery;

        if (viewerReactionsError && !viewerReactionsError.message.includes("'public.entry_reactions'")) {
          throw new Error(viewerReactionsError.message);
        }

        viewerReactions?.forEach((reaction) => viewerReactionByEntry.set(reaction.entry_id, reaction.reaction_type as FeedReactionType));

        let bookmarksQuery = engagementClient.from("entry_bookmarks").select("entry_id").in("entry_id", entryIds);
        bookmarksQuery = userId ? bookmarksQuery.eq("user_id", userId) : bookmarksQuery.eq("guest_id", guestId);
        const { data: bookmarks, error: bookmarksError } = await bookmarksQuery;

        if (bookmarksError && !bookmarksError.message.includes("'public.entry_bookmarks'")) {
          throw new Error(bookmarksError.message);
        }

        bookmarks?.forEach((bookmark) => bookmarkedEntryIds.add(bookmark.entry_id));
      }
    }
  }

  return {
    items: pageRows.map((row) => {
      const author = row.user_id ? profilesById.get(row.user_id) ?? null : null;

      return {
        id: row.id,
        content: row.content,
        visibility: row.visibility,
        createdAt: row.created_at,
        metadata: toEntryMetadata(row),
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
    nextCursor: rows.length > PAGE_SIZE ? pageRows.at(-1)?.created_at ?? null : null,
  };
}

function tryCreateSupabaseAdminClient() {
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}
