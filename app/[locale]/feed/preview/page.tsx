import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { loadFeedPage } from "@/lib/feed/load-feed";
import { FeedPreviewClient } from "./_components/feed-preview-client";

export default async function FeedPreviewPage({ params }: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (await getCurrentUser()) redirect(`/${locale}/feed`);

  const initialPage = await loadFeedPage();

  return <FeedPreviewClient initialPage={initialPage} />;
}
