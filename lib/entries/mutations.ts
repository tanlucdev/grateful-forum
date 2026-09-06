import type { SupabaseClient } from "@supabase/supabase-js";
import { ensureGuestId } from "@/lib/auth/guest-session";
import { ENTRY_LIMIT, isEntryVisibility } from "./types";
import type { CreateEntryRequest } from "./dto";

export function validateCreateEntry(input: { content?: string; visibility?: string }) {
  const content = input.content?.trim() ?? "";
  const visibility = input.visibility ?? "private";

  if (!content || content.length > ENTRY_LIMIT || !isEntryVisibility(visibility)) {
    throw new Error("Invalid entry.");
  }

  return { content, visibility };
}

export async function createEntry(
  supabase: SupabaseClient,
  input: CreateEntryRequest,
  userId: string | null,
) {
  const result = userId
    ? await supabase
        .from("entries")
        .insert({ content: input.content, visibility: input.visibility, user_id: userId })
        .select("id, created_at")
        .single()
    : await supabase
        .from("entries")
        .insert({ content: input.content, visibility: input.visibility, guest_id: await ensureGuestId() })
        .select("id, created_at")
        .single();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}
