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
    <div
      className="w-screen max-w-[100vw] min-h-svh overflow-x-hidden bg-[#f4fbf8] bg-fixed font-[family-name:var(--font-quicksand)] text-[#1c3b2c]"
      style={{
        backgroundImage:
          "radial-gradient(at 15% 15%, rgba(220,252,231,.55) 0, transparent 48%), radial-gradient(at 85% 25%, rgba(254,243,199,.45) 0, transparent 40%), radial-gradient(at 50% 85%, rgba(230,246,240,.6) 0, transparent 55%)",
      }}
    >
      <main className="w-full max-w-full min-h-svh overflow-x-hidden md:mx-auto md:max-w-7xl md:px-6 md:pt-[92px]">
        <section className="flex w-full max-w-full min-w-0 flex-col gap-5 overflow-hidden px-5 pt-5 md:hidden">
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
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
            <div className="flex flex-col gap-6 md:col-span-7 lg:col-span-8">
              <div className="flex flex-col items-start justify-between gap-4 pb-3 xl:flex-row xl:items-end">
                <div>
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00a86b]">
                    <span className="h-2 w-2 rounded-full bg-[#00a86b]" />
                    Dòng Chảy Lành
                  </p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1c3b2c]">
                    Những hạt mầm được gieo hôm nay
                  </h1>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#6b7a74]">
                    Đọc một điều biết ơn của người khác để nhắc nhở chính mình về hạnh phúc bình dị.
                  </p>
                </div>
                <div className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-full border border-[#d5e2dc] bg-white/90 p-1 text-xs font-medium text-[#4a5752] shadow-[0_4px_20px_-2px_rgba(28,59,44,0.05)] backdrop-blur-md">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00a86b] px-3 py-1.5 text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    Tất cả hạt mầm
                  </span>
                  <span className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 xl:inline-flex">
                    <span className="text-[#00a86b]">✦</span>
                    Khoảnh khắc đời thường
                  </span>
                  <span className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 xl:inline-flex">
                    <span className="text-[#00a86b]">▣</span>
                    Có ảnh Polaroid
                  </span>
                </div>
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
