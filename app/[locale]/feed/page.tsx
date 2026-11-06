import { Suspense } from "react";
import { DesktopAside } from "./_components/feed-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { loadFeedPage } from "@/lib/feed/load-feed";
import { loadFeedWeeklyRhythm } from "@/lib/feed/load-weekly-rhythm";
import { PublicFeedClient } from "./_components/public-feed-client";
import { feedPageQuerySchema } from "@/lib/feed/validation";

export default async function FeedPage({ params, searchParams }: Readonly<{ params: Promise<{ locale: string }>; searchParams: Promise<{ visibility?: string }> }>) {
  const { locale } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/feed/preview`);

  const parsed = feedPageQuerySchema.safeParse({ cursor: null, visibility: (await searchParams).visibility });
  const visibility = parsed.success ? parsed.data.visibility : "all";
  const initialPage = await loadFeedPage(null, visibility);

  return <PublicFeedClient key={`${user.id}-${visibility}`} initialPage={initialPage} initialVisibility={visibility} aside={<Suspense fallback={<Skeleton className="hidden h-60 rounded-2xl lg:block lg:col-span-4" />}><FeedAside /></Suspense>} />;
}

async function FeedAside() { return <DesktopAside weeklyRhythm={await loadFeedWeeklyRhythm()} />; }
