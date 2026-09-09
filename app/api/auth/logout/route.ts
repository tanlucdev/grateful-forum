import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ signedOut: true });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ signedOut: true });
}
