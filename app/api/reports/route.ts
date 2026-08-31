import { NextResponse } from "next/server";
import { ensureGuestId } from "@/lib/auth/guest-session";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    entryId?: string;
    reason?: string;
  };
  const reason = body.reason?.trim() ?? "";

  if (!body.entryId || reason.length < 3 || reason.length > 280) {
    return NextResponse.json({ error: "Invalid report." }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ saved: false, reason: "supabase-unconfigured" });
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  const insertResult = auth.user
    ? await supabase
        .from("reports")
        .insert({ entry_id: body.entryId, reason, reporter_id: auth.user.id })
    : await supabase
        .from("reports")
        .insert({ entry_id: body.entryId, reason, guest_id: await ensureGuestId() });

  if (insertResult.error) {
    return NextResponse.json({ error: insertResult.error.message }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}
