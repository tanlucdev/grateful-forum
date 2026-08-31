import { NextResponse } from "next/server";
import { ensureGuestId } from "@/lib/auth/guest-session";
import { ENTRY_LIMIT, isEntryVisibility } from "@/lib/entries/types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    content?: string;
    visibility?: string;
  };
  const content = body.content?.trim() ?? "";
  const visibility = body.visibility ?? "private";

  if (!content || content.length > ENTRY_LIMIT || !isEntryVisibility(visibility)) {
    return NextResponse.json({ error: "Invalid entry." }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ saved: false, reason: "supabase-unconfigured" });
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const insertResult = data.user
    ? await supabase
        .from("entries")
        .insert({ content, visibility, user_id: data.user.id })
        .select("id, created_at")
        .single()
    : await supabase
        .from("entries")
        .insert({ content, visibility, guest_id: await ensureGuestId() })
        .select("id, created_at")
        .single();

  if (insertResult.error) {
    return NextResponse.json(
      { error: insertResult.error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ saved: true, entry: insertResult.data });
}
