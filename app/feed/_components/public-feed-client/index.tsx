"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadMoreFeed } from "@/lib/api/feed";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { FeedPage } from "@/lib/feed/types";
import {
  DesktopAside,
  DesktopFooter,
  MobileFeedEnd,
  MobileReflectionBanner,
  MobileWritePrompt,
  WritePrompt,
} from "../feed-shell";
import { DesktopFeedCard, FeedEmptyState, FeedSentinel, MobileFeedCard } from "../feed-cards";
import { toDisplayItem, type DisplayItem } from "../feed-data";

type FeedFilter = "all" | "ordinary" | "polaroid";

const feedFilters: { key: FeedFilter; label: string; icon: string }[] = [
  { key: "all", label: "Tất cả hạt mầm", icon: "spa" },
  { key: "ordinary", label: "Khoảnh khắc đời thường", icon: "auto_stories" },
  { key: "polaroid", label: "Có ảnh Polaroid", icon: "photo_library" },
];

const filterEmptyCopy: Record<Exclude<FeedFilter, "all">, { title: string; description: string }> = {
  ordinary: {
    title: "Chưa có khoảnh khắc đời thường",
    description: "Các chia sẻ không kèm ảnh Polaroid sẽ xuất hiện tại đây.",
  },
  polaroid: {
    title: "Chưa có ảnh Polaroid",
    description: "Các chia sẻ có ảnh đính kèm sẽ xuất hiện tại đây.",
  },
};

export function PublicFeedClient({
  initialPage,
}: Readonly<{ initialPage: FeedPage }>) {
  const [items, setItems] = useState(initialPage.items);
  const [cursor, setCursor] = useState(initialPage.nextCursor);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(!initialPage.nextCursor);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FeedFilter>("all");
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

  const filteredItems = items.filter((item) => {
    if (filter === "polaroid") {
      return Boolean(item.metadata.imageUrl);
    }

    if (filter === "ordinary") {
      return !item.metadata.imageUrl;
    }

    return true;
  });
  const feedItems: DisplayItem[] = filteredItems.map(toDisplayItem);
  const status = error || (loading ? "Đang tải thêm..." : done && items.length ? "Bạn đã xem hết." : "");
  const showMobileEnd = !loading && !error && done && items.length > 0;
  const sentinelStatus = showMobileEnd ? "" : status;
  const emptyState = filter === "all" ? <FeedEmptyState /> : <FilteredFeedEmptyState filter={filter} onReset={() => setFilter("all")} />;

  return (
    <div className="app-garden-bg w-screen max-w-[100vw] min-h-svh overflow-x-hidden font-[family-name:var(--font-quicksand)] text-foreground">
      <main className="w-full max-w-full min-h-svh overflow-x-hidden md:mx-auto md:max-w-7xl md:px-6 md:pt-[92px]">
        <section className="flex w-full max-w-full min-w-0 flex-col gap-5 overflow-hidden px-5 pt-5 md:hidden">
          <MobileReflectionBanner />
          <MobileWritePrompt />
          <div className="flex flex-col gap-4">
            {feedItems.length ? feedItems.map((item, index) => (
              <MobileFeedCard item={item} key={item.id} priorityImage={index === 0} />
            )) : emptyState}
          </div>
          <FeedSentinel refEl={sentinelRef} status={sentinelStatus} />
          {showMobileEnd ? <MobileFeedEnd status={items.length ? "" : "Chưa có chia sẻ công khai."} /> : null}
        </section>

        <section className="hidden w-full py-8 md:block">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
            <div className="flex flex-col gap-6 md:col-span-7 lg:col-span-8">
              <div className="flex flex-col items-start justify-between gap-4 pb-3">
                <div>
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Dòng Chảy Lành
                  </p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                    Những hạt mầm được gieo hôm nay
                  </h1>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Đọc một điều biết ơn của người khác để nhắc nhở chính mình về hạnh phúc bình dị.
                  </p>
                </div>
                <div className="grid w-full grid-cols-1 items-center gap-1 rounded-[24px] border border-border bg-card/90 p-1 text-xs font-bold text-muted-foreground shadow-card backdrop-blur-md lg:grid-cols-3 lg:rounded-full">
                  {feedFilters.map((item) => {
                    const active = item.key === filter;

                    return (
                      <button
                        aria-pressed={active}
                        className={`flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-full px-3 outline-offset-2 transition ${
                          active ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted hover:text-primary"
                        }`}
                        key={item.key}
                        onClick={() => setFilter(item.key)}
                        type="button"
                      >
                        <MaterialSymbol className={`shrink-0 text-base ${active ? "text-primary-foreground" : "text-primary"}`} name={item.icon} />
                        <span className="whitespace-nowrap">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <WritePrompt />
              <div className="flex flex-col gap-5">
                {feedItems.length ? feedItems.map((item, index) => (
                  <DesktopFeedCard item={item} key={item.id} priorityImage={index === 0} />
                )) : emptyState}
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

function FilteredFeedEmptyState({
  filter,
  onReset,
}: Readonly<{
  filter: Exclude<FeedFilter, "all">;
  onReset: () => void;
}>) {
  const copy = filterEmptyCopy[filter];

  return (
    <section className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card px-5 py-10 text-center shadow-card">
      <MaterialSymbol className="text-2xl text-primary" name={filter === "polaroid" ? "photo_library" : "auto_stories"} />
      <div className="space-y-1">
        <p className="text-sm font-bold leading-5 text-foreground">{copy.title}</p>
        <p className="text-xs leading-4 text-muted-foreground">{copy.description}</p>
      </div>
      <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold leading-5 text-primary-foreground" onClick={onReset} type="button">
        <MaterialSymbol className="text-sm" name="spa" />
        <span>Xem tất cả</span>
      </button>
    </section>
  );
}
