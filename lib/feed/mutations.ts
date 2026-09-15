import type { SupabaseClient } from "@supabase/supabase-js";
import { ensureGuestId, getGuestId } from "@/lib/auth/guest-session";
import { emptyFeedReactionCounts } from "./engagement-state.ts";
import type { FeedReactionType } from "./validation.ts";

type Actor = { userId: string; guestId: null } | { userId: null; guestId: string };

type ReactionInput = {
  entryId: string;
  reactionType: FeedReactionType;
};

export class FeedEngagementForbiddenError extends Error {}

export async function upsertEntryReaction(
  supabase: SupabaseClient,
  input: ReactionInput,
  userId: string | null,
) {
  const actor = await resolveActor(userId, true);
  if (!actor) throw new FeedEngagementForbiddenError("Feed actor is unavailable.");
  await assertVisibleEntry(supabase, input.entryId);
  const existing = await findOwnReaction(supabase, input.entryId, actor);
  const result = existing
    ? await supabase.from("entry_reactions").update({ reaction_type: input.reactionType }).eq("id", existing.id)
    : await supabase.from("entry_reactions").insert({
        entry_id: input.entryId,
        reaction_type: input.reactionType,
        user_id: actor.userId,
        guest_id: actor.guestId,
      });

  if (result.error?.code === "23505") {
    let query = supabase.from("entry_reactions").update({ reaction_type: input.reactionType }).eq("entry_id", input.entryId);
    query = actor.userId ? query.eq("user_id", actor.userId) : query.eq("guest_id", actor.guestId);
    const updated = await query;
    if (updated.error) throw new Error(updated.error.message);
    return loadEntryEngagementState(supabase, input.entryId, actor);
  }

  if (result.error) throw new Error(result.error.message);
  return loadEntryEngagementState(supabase, input.entryId, actor);
}

export async function deleteEntryReaction(
  supabase: SupabaseClient,
  entryId: string,
  userId: string | null,
) {
  const actor = await resolveActor(userId, false);
  if (!actor) return loadEntryEngagementState(supabase, entryId, null);

  let query = supabase.from("entry_reactions").delete().eq("entry_id", entryId);
  query = actor.userId ? query.eq("user_id", actor.userId) : query.eq("guest_id", actor.guestId);
  const { error } = await query;
  if (error) throw new Error(error.message);
  return loadEntryEngagementState(supabase, entryId, actor);
}

export async function upsertEntryBookmark(
  supabase: SupabaseClient,
  entryId: string,
  userId: string | null,
) {
  const actor = await resolveActor(userId, true);
  if (!actor) throw new FeedEngagementForbiddenError("Feed actor is unavailable.");
  await assertVisibleEntry(supabase, entryId);
  const existing = await findOwnBookmark(supabase, entryId, actor);

  if (!existing) {
    const { error } = await supabase.from("entry_bookmarks").insert({
      entry_id: entryId,
      user_id: actor.userId,
      guest_id: actor.guestId,
    });
    if (error && error.code !== "23505") throw new Error(error.message);
  }

  return { bookmarked: true };
}

export async function deleteEntryBookmark(
  supabase: SupabaseClient,
  entryId: string,
  userId: string | null,
) {
  const actor = await resolveActor(userId, false);
  if (!actor) return { bookmarked: false };

  let query = supabase.from("entry_bookmarks").delete().eq("entry_id", entryId);
  query = actor.userId ? query.eq("user_id", actor.userId) : query.eq("guest_id", actor.guestId);
  const { error } = await query;
  if (error) throw new Error(error.message);
  return { bookmarked: false };
}

export async function loadEntryEngagementState(
  supabase: SupabaseClient,
  entryId: string,
  actor: Actor | null,
) {
  const reactions = emptyFeedReactionCounts();
  const { data, error } = await supabase.from("entry_reactions").select("reaction_type, user_id, guest_id").eq("entry_id", entryId);

  if (error) throw new Error(error.message);

  let viewerReaction: FeedReactionType | null = null;
  data?.forEach((row) => {
    const type = row.reaction_type as FeedReactionType;
    reactions[type] += 1;
    if (actor && (actor.userId ? row.user_id === actor.userId : row.guest_id === actor.guestId)) {
      viewerReaction = type;
    }
  });

  return { reactions, viewerReaction };
}

async function assertVisibleEntry(supabase: SupabaseClient, entryId: string) {
  const { data, error } = await supabase
    .from("entries")
    .select("id")
    .eq("id", entryId)
    .is("hidden_at", null)
    .in("visibility", ["public", "anonymous"])
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new FeedEngagementForbiddenError("Entry is unavailable.");
}

async function resolveActor(userId: string | null, createGuest: boolean): Promise<Actor | null> {
  if (userId) return { userId, guestId: null };
  const guestId = createGuest ? await ensureGuestId() : await getGuestId();
  return guestId ? { userId: null, guestId } : null;
}

async function findOwnReaction(supabase: SupabaseClient, entryId: string, actor: Actor) {
  let query = supabase.from("entry_reactions").select("id").eq("entry_id", entryId).limit(1);
  query = actor.userId ? query.eq("user_id", actor.userId) : query.eq("guest_id", actor.guestId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

async function findOwnBookmark(supabase: SupabaseClient, entryId: string, actor: Actor) {
  let query = supabase.from("entry_bookmarks").select("id").eq("entry_id", entryId).limit(1);
  query = actor.userId ? query.eq("user_id", actor.userId) : query.eq("guest_id", actor.guestId);
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
