"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadMoreFeed } from "@/lib/api/feed";
import type { FeedPage } from "@/lib/feed/types";
import { DesktopAside, DesktopFooter, MobileHeader, WritePrompt } from "./feed-shell";
import { DesktopFeedCard, FeedSentinel, MobileFeedCard } from "./feed-cards";
import { sampleItems, toDisplayItem, type DisplayItem } from "./feed-data";

export function PublicFeedClient({ initialPage }: Readonly<{ initialPage: FeedPage }>) {
  const [items, setItems] = useState(initialPage.items);
  const [cursor, setCursor] = useState(initialPage.nextCursor);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(!initialPage.nextCursor);
  const [error, setError] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (!cursor || loading || done) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      const page = await loadMoreFeed(cursor);
      setItems((current) => [...current, ...page.items]);
      setCursor(page.nextCursor);
      setDone(!page.nextCursor);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load more entries.");
    } finally {
      setLoading(false);
    }
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

  const feedItems: DisplayItem[] = items.length ? items.map(toDisplayItem) : sampleItems;
  const status = error || (loading ? "Đang tải thêm..." : done && items.length ? "Bạn đã xem hết." : "");

  return (
    <div className="min-h-svh bg-[#eefcf9] text-[#111e1c] md:bg-[#f4fbf8] md:font-[family-name:var(--font-quicksand)]">
      <MobileHeader />
      <main className="min-h-svh pt-16 md:mx-auto md:max-w-[1200px] md:px-6">
        <section className="mx-auto flex w-full max-w-md flex-col gap-4 px-6 pb-[100px] pt-4 md:hidden">
          {feedItems.map((item) => (
            <MobileFeedCard item={item} key={item.id} />
          ))}
          <FeedSentinel refEl={sentinelRef} status={status} />
        </section>

        <section className="hidden w-full py-8 md:block">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-8">
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase leading-[14px] tracking-widest text-[#006d43]">
                  Khoảnh khắc hiện tại
                </p>
                <h1 className="text-[32px] font-bold leading-10 tracking-tight text-[#161d1b]">
                  Dòng thời gian biết ơn
                </h1>
                <p className="text-base leading-6 text-[#3d4a41]">
                  Những khoảnh khắc nhỏ bé, nuôi dưỡng bình yên mỗi ngày.
                </p>
              </div>
              <WritePrompt />
              <div className="flex flex-col gap-5">
                {feedItems.map((item) => (
                  <DesktopFeedCard item={item} key={item.id} />
                ))}
                <FeedSentinel refEl={sentinelRef} status={status} />
              </div>
            </div>
            <DesktopAside />
          </div>
        </section>
      </main>
      <DesktopFooter />
    </div>
  );
}
