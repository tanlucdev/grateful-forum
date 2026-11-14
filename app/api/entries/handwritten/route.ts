import { getCurrentUser } from "@/lib/auth/current-user";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { saveHandwrittenEntry } from "@/lib/entries/handwriting-service";
import { createHandwrittenEntryRequestSchema } from "@/lib/entries/schema";
import { MediaError, mediaFailure } from "@/lib/entry-media/errors";
import { parseHandwritingPreview } from "@/lib/entry-media/validation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { dailyQuotaFailure } from "@/lib/entries/daily-quota";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ code: "auth_required", error: "Sign in to write." }, { status: 401 });

  try {
    const formData = await request.formData().catch(() => { throw new MediaError("invalid_media"); });
    const documentValue = formData.get("document");
    const visibility = formData.get("visibility");
    const input = createHandwrittenEntryRequestSchema.parse({
      document: typeof documentValue === "string" ? JSON.parse(documentValue) : documentValue,
      visibility,
    });
    const preview = parseHandwritingPreview(input.visibility, formData.get("preview"));
    if (!hasSupabaseEnv()) return NextResponse.json({ saved: false, reason: "supabase-unconfigured" });

    const supabase = await createSupabaseServerClient();
    const entry = await saveHandwrittenEntry(supabase, { ...input, preview }, user.id);
    return NextResponse.json({ saved: true, entry });
  } catch (error) {
    const quota = dailyQuotaFailure(error);
    if (quota) return NextResponse.json(quota.body, { status: 429, headers: quota.headers });
    const failure = mediaFailure(error);
    if (failure) return NextResponse.json({ code: failure.code, error: failure.error }, { status: failure.status });
    const invalid = error instanceof SyntaxError || error instanceof ZodError;
    return NextResponse.json(
      { code: "entry_failed", error: invalid ? "Invalid handwritten entry." : error instanceof Error ? error.message : "Could not save handwritten entry." },
      { status: invalid ? 400 : 500 },
    );
  }
}
