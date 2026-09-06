import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createReport, validateCreateReport } from "@/lib/reports/mutations";

export async function POST(request: Request) {
  const body = (await request.json()) as { entryId?: string; reason?: string };
  let input;

  try {
    input = validateCreateReport(body);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid report." }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ saved: false, reason: "supabase-unconfigured" });
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  try {
    await createReport(supabase, input, auth.user?.id ?? null);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not report entry." }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}
