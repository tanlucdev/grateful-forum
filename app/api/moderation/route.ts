import { NextResponse } from "next/server";
import { loadAdminQueue } from "@/lib/moderation/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateModerationUpdate, updateModerationReport } from "@/lib/moderation/mutations";

export async function GET() {
  const queue = await loadAdminQueue();
  return NextResponse.json(queue, { status: queue.admin ? 200 : 403 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { reportId?: string; entryId?: string; action?: "review" | "dismiss" | "hide" | "delete" };
  let input;

  try {
    input = validateModerationUpdate(body);
  } catch (error) {
    return NextResponse.json({ code: "moderation_failed", error: error instanceof Error ? error.message : "Invalid moderation action." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ code: "moderation_failed", error: "Not signed in." }, { status: 401 });
  }

  try {
    await updateModerationReport(supabase, auth.user.id, input);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update moderation report.";
    const status = message === "Admin only." ? 403 : 500;
    return NextResponse.json({ code: "moderation_failed", error: message }, { status });
  }

  return NextResponse.json({ saved: true });
}
