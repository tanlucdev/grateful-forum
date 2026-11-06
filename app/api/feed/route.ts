import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { loadFeedPage } from "@/lib/feed/load-feed";
import { FeedLoginRequiredError } from "@/lib/feed/access";
import { feedPageQuerySchema } from "@/lib/feed/validation";

const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const { cursor, visibility } = feedPageQuerySchema.parse({ cursor: params.get("cursor"), visibility: params.get("visibility") ?? undefined });
    const page = await loadFeedPage(cursor, visibility);
    return NextResponse.json(page, { headers });
  } catch (error) {
    if (error instanceof FeedLoginRequiredError) {
      return NextResponse.json({ code: "auth_required", error: error.message }, { status: 401, headers });
    }

    if (error instanceof ZodError) {
      return NextResponse.json({ code: "feed_failed", error: "Invalid feed params." }, { status: 400, headers });
    }

    return NextResponse.json({ code: "feed_failed", error: "Could not load feed." }, { status: 500, headers });
  }
}
