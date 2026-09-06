import type { SupabaseClient } from "@supabase/supabase-js";
import type { ModerationAction, UpdateModerationReportRequest } from "./dto";

const actions = ["review", "dismiss", "hide", "delete"] as const;

export function validateModerationUpdate(input: Partial<UpdateModerationReportRequest>) {
  if (!input.reportId || !actions.includes(input.action as ModerationAction)) {
    throw new Error("Invalid moderation action.");
  }

  if ((input.action === "hide" || input.action === "delete") && !input.entryId) {
    throw new Error("Invalid moderation action.");
  }

  return input as UpdateModerationReportRequest;
}

async function isAdmin(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("admin_roles")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  return Boolean(data);
}

export async function updateModerationReport(
  supabase: SupabaseClient,
  userId: string,
  input: UpdateModerationReportRequest,
) {
  if (!(await isAdmin(supabase, userId))) {
    throw new Error("Admin only.");
  }

  if ((input.action === "hide" || input.action === "delete") && input.entryId) {
    const { error } = await supabase
      .from("entries")
      .update({ hidden_at: new Date().toISOString() })
      .eq("id", input.entryId);

    if (error) {
      throw new Error(error.message);
    }
  }

  const status: Record<ModerationAction, string> = {
    dismiss: "dismissed",
    delete: "deleted",
    hide: "hidden",
    review: "reviewed",
  };

  const { error } = await supabase
    .from("reports")
    .update({
      status: status[input.action],
      moderator_id: userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", input.reportId);

  if (error) {
    throw new Error(error.message);
  }
}
