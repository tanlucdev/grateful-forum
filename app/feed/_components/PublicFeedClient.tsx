"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadMoreFeed } from "@/lib/api/feed";
import type { FeedPage } from "@/lib/feed/types";
import {
  DesktopAside,
  DesktopFooter,
  MobileFeedEnd,
  MobileReflectionBanner,
  MobileWritePrompt,
  WritePrompt,
} from "./feed-shell";
import { DesktopFeedCard, FeedEmptyState, FeedSentinel, MobileFeedCard } from "./feed-cards";
import { toDisplayItem, type DisplayItem } from "./feed-data";

export function PublicFeedClient({
  initialPage,
}: Readonly<{ initialPage: FeedPage }>) {
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

  const feedItems: DisplayItem[] = items.map(toDisplayItem);
  const status = error || (loading ? "Đang tải thêm..." : done && items.length ? "Bạn đã xem hết." : "");
  const showMobileEnd = !loading && !error && done && items.length > 0;
  const sentinelStatus = showMobileEnd ? "" : status;

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f4fbf8] font-[family-name:var(--font-quicksand)] text-[#161d1b]">
      <main className="min-h-svh overflow-x-hidden md:mx-auto md:max-w-[1200px] md:px-6 md:pt-20">
        <section className="flex w-full min-w-0 flex-col gap-5 overflow-hidden px-5 pt-4 md:hidden">
          <MobileReflectionBanner />
          <MobileWritePrompt />
          <div className="flex flex-col gap-4">
            {feedItems.length ? feedItems.map((item) => (
              <MobileFeedCard item={item} key={item.id} />
            )) : <FeedEmptyState />}
          </div>
          <FeedSentinel refEl={sentinelRef} status={sentinelStatus} />
          {showMobileEnd ? <MobileFeedEnd status={items.length ? "" : "Chưa có chia sẻ công khai."} /> : null}
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
                {feedItems.length ? feedItems.map((item) => (
                  <DesktopFeedCard item={item} key={item.id} />
                )) : <FeedEmptyState />}
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
