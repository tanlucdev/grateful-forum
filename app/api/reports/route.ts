import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createReport, ReportForbiddenError, validateCreateReport } from "@/lib/reports/mutations";

export async function POST(request: Request) {
  let input;

  try {
    const body = (await request.json()) as { entryId?: string; reason?: string };
    input = validateCreateReport(body);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid report." }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid report." }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ saved: false, reason: "supabase-unconfigured" });
  }

  const serverSupabase = await createSupabaseServerClient();
  const { data: auth } = await serverSupabase.auth.getUser();
  const userId = auth.user?.id ?? null;

  try {
    await createReport(userId ? serverSupabase : createSupabaseAdminClient(), input, userId);
  } catch (error) {
    if (error instanceof ReportForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    if (error instanceof Error && error.message.includes("service role")) {
      return NextResponse.json({ error: "Report is unavailable." }, { status: 503 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not report entry." }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}
