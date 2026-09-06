import type { FeedPage } from "@/lib/feed/dto";
import { fetchJson } from "./fetch-json";

export function loadMoreFeed(cursor: string) {
  return fetchJson<FeedPage>(
    `/api/feed?cursor=${encodeURIComponent(cursor)}`,
    {},
    "Could not load more entries.",
  );
}
