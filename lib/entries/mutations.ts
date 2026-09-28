import type { SupabaseClient } from "@supabase/supabase-js";
import { ensureGuestId } from "@/lib/auth/guest-session";
import { ENTRY_LIMIT } from "./types.ts";
import type { CreateEntryRequest } from "./dto.ts";
import { composeEntryContent } from "./records.ts";
import { entrySelect } from "./records.ts";
import type { EntryVisibility } from "./types.ts";
import { softDeleteEntryData } from "./ownership.ts";

export async function createEntry(
  supabase: SupabaseClient,
  input: CreateEntryRequest,
  userId: string | null,
) {
  const content = composeEntryContent(input).trim();

  if (!content || content.length > ENTRY_LIMIT) {
    throw new Error("Invalid entry.");
  }

  const data = {
    content,
    visibility: input.visibility,
    gratitudes: input.gratitudes,
    reflection: input.reflection,
    mood: input.mood,
    washi: input.washi,
    space: input.space,
    quote: input.quote,
    sticker: input.sticker,
    image_url: input.imageUrl ?? null,
  };

  const result = userId
    ? await supabase
        .from("entries")
        .insert({ ...data, user_id: userId })
        .select("id, created_at")
        .single()
    : await supabase
        .from("entries")
        .insert({ ...data, guest_id: await ensureGuestId() })
        .select("id, created_at")
        .single();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

export async function updateOwnEntryVisibility(
  supabase: SupabaseClient,
  entryId: string,
  userId: string,
  visibility: EntryVisibility,
) {
  const { data, error } = await supabase
    .from("entries")
    .update({ visibility })
    .eq("id", entryId)
    .eq("user_id", userId)
    .is("owner_deleted_at", null)
    .select(entrySelect)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function softDeleteOwnEntry(
  supabase: SupabaseClient,
  entryId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("entries")
    .update(softDeleteEntryData())
    .eq("id", entryId)
    .eq("user_id", userId)
    .is("owner_deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
