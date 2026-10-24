import type { SupabaseClient } from "@supabase/supabase-js";

export async function findRecentSpaces(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("entries")
    .select("space")
    .eq("user_id", userId)
    .is("hidden_at", null)
    .is("owner_deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return data ?? [];
}
