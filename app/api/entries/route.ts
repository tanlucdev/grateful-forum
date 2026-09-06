import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createEntry, validateCreateEntry } from "@/lib/entries/mutations";

export async function POST(request: Request) {
  const body = (await request.json()) as { content?: string; visibility?: string };
  let input;

  try {
    input = validateCreateEntry(body);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid entry." }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ saved: false, reason: "supabase-unconfigured" });
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  try {
    const entry = await createEntry(supabase, input, data.user?.id ?? null);
    return NextResponse.json({ saved: true, entry });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save entry." }, { status: 500 });
  }

}
