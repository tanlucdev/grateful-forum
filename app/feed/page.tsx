import { PublicFeed } from "@/components/feed/public-feed";
import { loadFeedPage } from "@/lib/feed/load-feed";

export default async function FeedPage() {
  const initialPage = await loadFeedPage();

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-2xl px-4 pt-6 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          Public feed
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Gratitude from the community.
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
          Named entries open the author profile. Anonymous entries stay quiet.
        </p>
      </div>
      <PublicFeed initialPage={initialPage} />
    </main>
  );
}
