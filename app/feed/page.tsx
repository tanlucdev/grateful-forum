import { loadFeedPage } from "@/lib/feed/load-feed";
import { PublicFeedClient } from "./_components/PublicFeedClient";

export default async function FeedPage() {
  const initialPage = await loadFeedPage();

  return <PublicFeedClient initialPage={initialPage} />;
}
