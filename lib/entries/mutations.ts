import type { SupabaseClient } from "@supabase/supabase-js";
import { ENTRY_LIMIT } from "./types.ts";
import type { CreateEntryRequest } from "./dto.ts";
import { composeEntryContent } from "./records.ts";
import { entrySelect } from "./records.ts";
import type { EntryVisibility, InkDocument } from "./types.ts";
import { softDeleteEntryData } from "./ownership.ts";

export async function createEntry(
  supabase: SupabaseClient,
  input: CreateEntryRequest,
  userId: string,
) {
  const content = composeEntryContent(input).trim();

  if (!content || content.length > ENTRY_LIMIT) {
    throw new Error("Invalid entry.");
  }

  const data = {
    content,
    visibility: input.visibility,
    gratitudes: input.gratitudes,
    reflection: optional(input.reflection),
    mood: optional(input.mood),
    washi: optional(input.washi),
    space: optional(input.space),
    quote: optional(input.quote),
    sticker: optional(input.sticker),
    image_url: input.imageUrl ?? null,
  };

  const result = await supabase.from("entries").insert({ ...data, user_id: userId }).select("id, created_at").single();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

function optional(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || null;
}

export async function createHandwrittenEntry(
  supabase: SupabaseClient,
  input: { document: InkDocument; visibility: EntryVisibility; previewUrl: string | null },
  userId: string,
) {
  const data = {
    content: "[Handwritten journal entry]",
    visibility: input.visibility,
    entry_kind: "handwritten" as const,
    handwriting_data: input.document,
    handwriting_orientation: input.document.orientation,
    handwriting_preview_url: input.previewUrl,
  };
  const result = await supabase.from("entries").insert({ ...data, user_id: userId }).select("id, created_at").single();

  if (result.error) throw new Error(result.error.message);
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
    .eq("entry_kind", "text")
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
