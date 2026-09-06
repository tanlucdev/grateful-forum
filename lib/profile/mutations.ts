import type { SupabaseClient } from "@supabase/supabase-js";
import type { UpdateProfileRequest } from "./dto";

export async function updateOwnProfile(
  supabase: SupabaseClient,
  userId: string,
  input: UpdateProfileRequest,
) {
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    display_name: input.displayName.trim() || "Grateful human",
    username: input.username.trim().toLowerCase() || null,
    avatar_url: input.avatarUrl.trim() || null,
    bio: input.bio.trim() || null,
  });

  if (error) {
    throw new Error(error.message);
  }
}
