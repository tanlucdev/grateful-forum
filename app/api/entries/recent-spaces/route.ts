import { NextResponse } from "next/server";
import { getRecentSpaces } from "@/lib/entries/recent-spaces-service";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  if (!hasSupabaseEnv()) return NextResponse.json({ spaces: [] });
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return NextResponse.json({ spaces: await getRecentSpaces(supabase, data.user?.id ?? null) });
}
