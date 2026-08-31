import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    reportId?: string;
    entryId?: string;
    action?: "review" | "dismiss" | "hide" | "delete";
  };

  if (!body.reportId || !body.action) {
    return NextResponse.json({ error: "Invalid moderation action." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", auth.user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  if ((body.action === "hide" || body.action === "delete") && body.entryId) {
    await supabase
      .from("entries")
      .update({ hidden_at: new Date().toISOString() })
      .eq("id", body.entryId);
  }

  const status =
    body.action === "dismiss"
      ? "dismissed"
      : body.action === "hide"
        ? "hidden"
        : body.action === "delete"
          ? "deleted"
          : "reviewed";

  const { error } = await supabase
    .from("reports")
    .update({
      status,
      moderator_id: auth.user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", body.reportId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}
