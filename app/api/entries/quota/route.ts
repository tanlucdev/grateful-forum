import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getEntryDailyQuota } from "@/lib/entries/daily-quota-repository";

const headers = { "Cache-Control": "private, no-store" };
export async function GET() {
  if (!await getCurrentUser()) return NextResponse.json({ code: "auth_required", error: "Sign in to write." }, { status: 401, headers });
  try {
    return NextResponse.json(await getEntryDailyQuota(await createSupabaseServerClient()), { headers });
  } catch {
    return NextResponse.json({ code: "quota_unavailable", error: "Could not load daily allowance." }, { status: 503, headers });
  }
}
