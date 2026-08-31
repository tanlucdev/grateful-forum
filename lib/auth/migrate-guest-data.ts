import type { SupabaseClient } from "@supabase/supabase-js";

type MigrationTarget = {
  guestId: string;
  userId: string;
};

export async function migrateGuestData(
  supabase: SupabaseClient,
  { guestId, userId }: MigrationTarget,
) {
  await supabase
    .from("entries")
    .update({ user_id: userId, guest_id: null })
    .eq("guest_id", guestId);

  await supabase
    .from("reports")
    .update({ reporter_id: userId, guest_id: null })
    .eq("guest_id", guestId);
}
