import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { loadFeedPage } from "@/lib/feed/load-feed";
import { loadFeedWeeklyRhythm } from "@/lib/feed/load-weekly-rhythm";
import { PublicFeedClient } from "./_components/public-feed-client";

export default async function FeedPage({ params }: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!await getCurrentUser()) redirect(`/${locale}/feed/preview`);

  const [initialPage, weeklyRhythm] = await Promise.all([loadFeedPage(), loadFeedWeeklyRhythm()]);

  return <PublicFeedClient initialPage={initialPage} weeklyRhythm={weeklyRhythm} />;
}
