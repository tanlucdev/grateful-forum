"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Globe, UserRound } from "lucide-react";
import type { FeedItem, FeedPage } from "@/lib/feed/types";
import { ReportEntryButton } from "@/components/moderation/report-entry-button";

export function PublicFeed({ initialPage }: Readonly<{ initialPage: FeedPage }>) {
  const [items, setItems] = useState(initialPage.items);
  const [cursor, setCursor] = useState(initialPage.nextCursor);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(!initialPage.nextCursor);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (!cursor || loading || done) {
      return;
    }

    setLoading(true);
    const response = await fetch(`/api/feed?cursor=${encodeURIComponent(cursor)}`);
    const page = (await response.json()) as FeedPage;

    setItems((current) => [...current, ...page.items]);
    setCursor(page.nextCursor);
    setDone(!page.nextCursor);
    setLoading(false);
  }, [cursor, done, loading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || done || loading || !cursor) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void loadMore();
      }
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [cursor, done, loadMore, loading]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 pb-10 pt-4 sm:px-6">
      {items.map((item) => (
        <FeedCard key={item.id} item={item} />
      ))}
      <div ref={sentinelRef} className="h-10" />
      <p className="pb-6 text-center text-sm text-[var(--muted)]">
        {loading ? "Loading more..." : done ? "You reached the end." : ""}
      </p>
    </div>
  );
}

function FeedCard({ item }: Readonly<{ item: FeedItem }>) {
  const author = item.visibility !== "anonymous" ? item.author : null;
  const authorLabel = author ? author.displayName ?? "BeGrateful" : "Anonymous";
  const profileHref = author ? `/profile/${author.id}` : null;

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {profileHref ? (
              <Link
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--text)]"
                href={profileHref}
              >
                <UserRound className="h-4 w-4 text-[var(--accent)]" />
                {authorLabel}
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--text)]">
                <Globe className="h-4 w-4 text-[var(--accent)]" />
                {authorLabel}
              </span>
            )}
          </div>
          {author?.username ? (
            <p className="mt-1 text-xs text-[var(--muted)]">@{author.username}</p>
          ) : null}
        </div>
        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)]">
          {item.visibility}
        </span>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[var(--text)]">
        {item.content}
      </p>
      <ReportEntryButton entryId={item.id} />
    </article>
  );
}
