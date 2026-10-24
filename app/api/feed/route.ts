import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { loadFeedPage } from "@/lib/feed/load-feed";
import { FeedLoginRequiredError } from "@/lib/feed/access";
import { feedPageQuerySchema } from "@/lib/feed/validation";

export async function GET(request: Request) {
  try {
    const { cursor } = feedPageQuerySchema.parse({ cursor: new URL(request.url).searchParams.get("cursor") });
    const page = await loadFeedPage(cursor);
    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof FeedLoginRequiredError) {
      return NextResponse.json({ code: "auth_required", error: error.message }, { status: 401 });
    }

    if (error instanceof ZodError) {
      return NextResponse.json({ code: "feed_failed", error: "Invalid feed params." }, { status: 400 });
    }

    return NextResponse.json({ code: "feed_failed", error: "Could not load feed." }, { status: 500 });
  }
}
