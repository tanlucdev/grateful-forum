import type { SupabaseClient } from "@supabase/supabase-js";
import { ensureGuestId } from "@/lib/auth/guest-session";
import type { CreateReportRequest } from "./dto";

export class ReportForbiddenError extends Error {}

export function validateCreateReport(input: Partial<CreateReportRequest>) {
  const reason = input.reason?.trim() ?? "";

  if (!input.entryId || reason.length < 3 || reason.length > 280) {
    throw new Error("Invalid report.");
  }

  return { entryId: input.entryId, reason };
}

export async function createReport(
  supabase: SupabaseClient,
  input: CreateReportRequest,
  userId: string | null,
) {
  await assertReportableEntry(supabase, input.entryId);
  const guestId = userId ? null : await ensureGuestId();
  const result = await supabase.from("reports").insert({ entry_id: input.entryId, reason: input.reason, reporter_id: userId, guest_id: guestId });

  if (result.error?.code === "23505") {
    let query = supabase
      .from("reports")
      .update({ reason: input.reason, status: "open", moderator_id: null, moderator_note: null, reviewed_at: null })
      .eq("entry_id", input.entryId);
    query = userId ? query.eq("reporter_id", userId) : query.eq("guest_id", guestId);
    const updated = await query;
    if (updated.error) throw new Error(updated.error.message);
    return;
  }

  if (result.error) {
    throw new Error(result.error.message);
  }
}

async function assertReportableEntry(supabase: SupabaseClient, entryId: string) {
  const { data, error } = await supabase
    .from("entries")
    .select("id")
    .eq("id", entryId)
    .is("hidden_at", null)
    .is("owner_deleted_at", null)
    .in("visibility", ["public", "anonymous"])
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new ReportForbiddenError("Entry is unavailable.");
}
