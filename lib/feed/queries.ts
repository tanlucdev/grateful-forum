import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { entrySelect, toEntryMetadata } from "@/lib/entries/records";
import type { FeedPage } from "./dto";

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
  const profilesById = new Map<
    string,
    { id: string; display_name: string | null; username: string | null; avatar_url: string | null }
  >();
  const userIds = Array.from(new Set(pageRows.map((row) => row.user_id).filter(Boolean)));

  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .in("id", userIds);

    profiles?.forEach((profile) => profilesById.set(profile.id, profile));
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
