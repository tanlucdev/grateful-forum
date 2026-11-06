import { getCurrentUser } from "@/lib/auth/current-user";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createEntry } from "@/lib/entries/mutations";
import { createEntryRequestSchema } from "@/lib/entries/schema";

import { dailyQuotaFailure } from "@/lib/entries/daily-quota";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ code: "auth_required", error: "Sign in to write." }, { status: 401 });

  let input;

  try {
    const body = await request.json();
    input = createEntryRequestSchema.parse(body);
  } catch (error) {
    return NextResponse.json({ code: "entry_failed", error: error instanceof Error ? error.message : "Invalid entry." }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ saved: false, reason: "supabase-unconfigured" });
  }

  const supabase = await createSupabaseServerClient();

  try {
    const entry = await createEntry(supabase, input, user.id);
    return NextResponse.json({ saved: true, entry });
  } catch (error) {
    const quota = dailyQuotaFailure(error);
    if (quota) return NextResponse.json(quota.body, { status: 429, headers: quota.headers });
    return NextResponse.json({ code: "entry_failed", error: error instanceof Error ? error.message : "Could not save entry." }, { status: 500 });
  }

}
