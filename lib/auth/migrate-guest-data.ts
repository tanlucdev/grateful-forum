import type { SupabaseClient } from "@supabase/supabase-js";

type MigrationTarget = {
  guestId: string;
  userId: string;
};

export async function migrateGuestData(
  supabase: SupabaseClient,
  { guestId, userId }: MigrationTarget,
) {
  const { error: entriesError } = await supabase
    .from("entries")
    .update({ user_id: userId, guest_id: null })
    .eq("guest_id", guestId);

  if (entriesError) {
    throw new Error(entriesError.message);
  }

  await migrateOwnedRows(supabase, "reports", guestId, userId, "reporter_id");
  await migrateOwnedRows(supabase, "entry_reactions", guestId, userId, "user_id");
  await migrateOwnedRows(supabase, "entry_bookmarks", guestId, userId, "user_id");
}

async function migrateOwnedRows(
  supabase: SupabaseClient,
  table: "reports" | "entry_reactions" | "entry_bookmarks",
  guestId: string,
  userId: string,
  userColumn: "reporter_id" | "user_id",
) {
  const { data: guestRows, error: guestError } = await supabase.from(table).select("id, entry_id").eq("guest_id", guestId);
  if (shouldSkipMissingEngagementTable(table, guestError)) return;
  if (guestError) throw new Error(guestError.message);
  if (!guestRows?.length) return;

  const { data: userRows, error: userError } = await supabase.from(table).select("entry_id").eq(userColumn, userId);
  if (shouldSkipMissingEngagementTable(table, userError)) return;
  if (userError) throw new Error(userError.message);

  const userEntryIds = new Set((userRows ?? []).map((row) => row.entry_id));
  const duplicateIds = guestRows.filter((row) => userEntryIds.has(row.entry_id)).map((row) => row.id);

  if (duplicateIds.length) {
    const { error } = await supabase.from(table).delete().in("id", duplicateIds);
    if (error) throw new Error(error.message);
  }

  const { error } = await supabase.from(table).update({ [userColumn]: userId, guest_id: null }).eq("guest_id", guestId);
  if (error) throw new Error(error.message);
}

function shouldSkipMissingEngagementTable(
  table: "reports" | "entry_reactions" | "entry_bookmarks",
  error: { code?: string } | null,
) {
  return (table === "entry_reactions" || table === "entry_bookmarks") && error?.code === "PGRST205";
}
