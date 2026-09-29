import { loadFeedPage } from "@/lib/feed/load-feed";
import { PublicFeedClient } from "./_components/public-feed-client";

export default async function FeedPage() {
  const initialPage = await loadFeedPage();

  return <PublicFeedClient initialPage={initialPage} />;
}
