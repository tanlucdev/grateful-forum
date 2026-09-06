import type { SupabaseClient } from "@supabase/supabase-js";
import { ensureGuestId } from "@/lib/auth/guest-session";
import type { CreateReportRequest } from "./dto";

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
  const result = userId
    ? await supabase.from("reports").insert({ entry_id: input.entryId, reason: input.reason, reporter_id: userId })
    : await supabase.from("reports").insert({ entry_id: input.entryId, reason: input.reason, guest_id: await ensureGuestId() });

  if (result.error) {
    throw new Error(result.error.message);
  }
}
