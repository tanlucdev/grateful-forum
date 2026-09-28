import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { deleteEntryBookmark, FeedEngagementForbiddenError, upsertEntryBookmark } from "@/lib/feed/mutations";
import { feedEntryIdQuerySchema } from "@/lib/feed/validation";

export async function POST(request: Request) {
  try {
    const { entryId } = feedEntryIdQuerySchema.parse(await request.json());
    if (!hasSupabaseEnv()) return NextResponse.json({ code: "feed_engagement_failed", error: "Feed engagement is unavailable." }, { status: 503 });
    const serverSupabase = await createSupabaseServerClient();
    const { data } = await serverSupabase.auth.getUser();
    const userId = data.user?.id ?? null;
    const state = await upsertEntryBookmark(createSupabaseAdminClient(), entryId, userId);
    return NextResponse.json({ saved: true, ...state });
  } catch (error) {
    return engagementError(error, "Could not save bookmark.");
  }
}

export async function DELETE(request: Request) {
  try {
    const { entryId } = feedEntryIdQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
    if (!hasSupabaseEnv()) return NextResponse.json({ code: "feed_engagement_failed", error: "Feed engagement is unavailable." }, { status: 503 });
    const serverSupabase = await createSupabaseServerClient();
    const { data } = await serverSupabase.auth.getUser();
    const userId = data.user?.id ?? null;
    const state = await deleteEntryBookmark(createSupabaseAdminClient(), entryId, userId);
    return NextResponse.json({ saved: true, ...state });
  } catch (error) {
    return engagementError(error, "Could not remove bookmark.");
  }
}

function engagementError(error: unknown, fallback: string) {
  if (error instanceof SyntaxError) return NextResponse.json({ code: "feed_engagement_failed", error: "Invalid feed engagement." }, { status: 400 });
  if (error instanceof ZodError) return NextResponse.json({ code: "feed_engagement_failed", error: "Invalid feed engagement." }, { status: 400 });
  if (error instanceof FeedEngagementForbiddenError) return NextResponse.json({ code: "feed_engagement_failed", error: error.message }, { status: 403 });
  if (error instanceof Error && error.message.includes("service role")) return NextResponse.json({ code: "feed_engagement_failed", error: "Feed engagement is unavailable." }, { status: 503 });
  if (isMissingEngagementSchemaError(error)) return NextResponse.json({ code: "feed_engagement_failed", error: "Feed engagement schema is not ready." }, { status: 503 });
  return NextResponse.json({ code: "feed_engagement_failed", error: error instanceof Error ? error.message : fallback }, { status: 500 });
}

function isMissingEngagementSchemaError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return error.message.includes("PGRST205") || error.message.includes("'public.entry_bookmarks'");
}
