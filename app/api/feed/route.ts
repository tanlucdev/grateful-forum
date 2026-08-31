import { NextResponse } from "next/server";
import { loadFeedPage } from "@/lib/feed/load-feed";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const page = await loadFeedPage(cursor);
  return NextResponse.json(page);
}
