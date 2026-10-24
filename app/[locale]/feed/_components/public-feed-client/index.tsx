"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { loadMoreFeed } from "@/lib/api/feed";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { LocaleSwitcher } from "@/components/navigation/locale-switcher";
import type { FeedPage } from "@/lib/feed/types";
import type { AppLocale } from "@/i18n/routing";
import {
  DesktopAside,
  DesktopFooter,
  MobileFeedEnd,
  MobileReflectionBanner,
} from "../feed-shell";
import { DesktopFeedCard, FeedEmptyState, FeedSentinel, MobileFeedCard } from "../feed-cards";
import { toDisplayItem, type DisplayItem } from "../feed-data";

type FeedFilter = "all" | "ordinary" | "polaroid";

const feedFilters: { key: FeedFilter; icon: string }[] = [
  { key: "all", icon: "spa" },
  { key: "ordinary", icon: "auto_stories" },
  { key: "polaroid", icon: "photo_library" },
];

export function PublicFeedClient({
  initialPage,
}: Readonly<{ initialPage: FeedPage }>) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("feed");
  const copy = {
    all: t("filters.all"), ordinary: t("filters.ordinary"), polaroid: t("filters.polaroid"),
    ordinaryEmptyTitle: t("empty.ordinaryTitle"), ordinaryEmptyDescription: t("empty.ordinaryDescription"),
    polaroidEmptyTitle: t("empty.polaroidTitle"), polaroidEmptyDescription: t("empty.polaroidDescription"),
    loading: t("loading"), done: t("done"), noPublic: t("noPublic"), eyebrow: t("eyebrow"),
    title: t("title"), description: t("description"), showAll: t("showAll"),
  };
  const [items, setItems] = useState(initialPage.items);
  const [cursor, setCursor] = useState(initialPage.nextCursor);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(!initialPage.nextCursor);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  useEffect(() => {
    const updateScrollTopVisibility = () => setShowScrollTop(window.scrollY > 640);

    updateScrollTopVisibility();
    window.addEventListener("scroll", updateScrollTopVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollTopVisibility);
  }, []);

  const filteredItems = items.filter((item) => {
    if (filter === "polaroid") {
      return Boolean(item.metadata.imageUrl);
    }

    if (filter === "ordinary") {
      return !item.metadata.imageUrl;
    }

    return true;
  });
  const displayCopy = {
    anonymous: t("anonymous"),
    anonymousShare: t("anonymousShare"),
    public: t("public"),
    publicShare: t("publicShare"),
    relative: {
      minute: (count: number) => t("relative.minute", { count }),
      hour: (count: number) => t("relative.hour", { count }),
      yesterday: t("relative.yesterday"),
      day: (count: number) => t("relative.day", { count }),
    },
  };
  const feedItems: DisplayItem[] = filteredItems.map((item, index) => toDisplayItem(item, index, locale, displayCopy));
  const status = error || (loading ? copy.loading : done && items.length ? copy.done : "");
  const showMobileEnd = !loading && !error && done && items.length > 0;
  const sentinelStatus = showMobileEnd ? "" : status;
  const filters = feedFilters.map((item) => ({ ...item, label: copy[item.key] }));
  const emptyState = filter === "all" ? <FeedEmptyState locale={locale} /> : <FilteredFeedEmptyState filter={filter} onReset={() => setFilter("all")} />;

  return (
    <div className="app-garden-bg w-screen max-w-[100vw] min-h-svh overflow-x-hidden font-[family-name:var(--font-quicksand)] text-foreground">
      <main className="w-full max-w-full min-h-svh overflow-x-hidden md:mx-auto md:max-w-7xl md:px-6">
        <section className="flex w-full max-w-full min-w-0 flex-col gap-5 overflow-hidden px-5 pt-5 md:hidden">
          <LocaleSwitcher className="self-end" />
          <MobileReflectionBanner />
          <div className="flex flex-col gap-4">
            {feedItems.length ? feedItems.map((item, index) => (
              <MobileFeedCard item={item} key={item.id} locale={locale} priorityImage={index === 0} />
            )) : emptyState}
          </div>
          <FeedSentinel refEl={sentinelRef} status={sentinelStatus} />
          {showMobileEnd ? <MobileFeedEnd status={items.length ? "" : copy.noPublic} /> : null}
        </section>

        <section className="hidden w-full py-8 md:block">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
            <div className="flex flex-col gap-6 md:col-span-7 lg:col-span-8">
              <div className="flex flex-col items-start justify-between gap-4 pb-3">
                <div className="flex w-full items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {copy.eyebrow}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                      {copy.title}
                    </h1>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {copy.description}
                    </p>
                  </div>
                  <LocaleSwitcher className="hidden shrink-0 md:grid lg:hidden" />
                </div>
                <div className="grid w-full grid-cols-1 items-center gap-1 rounded-[24px] border border-border bg-card/90 p-1 text-xs font-bold text-muted-foreground shadow-card backdrop-blur-md lg:grid-cols-3 lg:rounded-full">
                  {filters.map((item) => {
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
              <div className="flex flex-col gap-5">
                {feedItems.length ? feedItems.map((item, index) => (
                  <DesktopFeedCard item={item} key={item.id} locale={locale} priorityImage={index === 0} />
                )) : emptyState}
                <FeedSentinel refEl={sentinelRef} status={status} />
              </div>
            </div>
            <DesktopAside />
          </div>
        </section>
      </main>
      <DesktopFooter />
      {showScrollTop ? (
        <button
          aria-label={t("scrollToTop")}
          className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--primary-shadow-md)] outline-offset-4 transition hover:-translate-y-0.5 hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:translate-y-0 md:bottom-8 md:right-8"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
          title={t("scrollToTop")}
          type="button"
        >
          <MaterialSymbol className="text-2xl" name="keyboard_arrow_up" />
        </button>
      ) : null}
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
  const t = useTranslations("feed");
  const copy = filter === "ordinary"
    ? { title: t("empty.ordinaryTitle"), description: t("empty.ordinaryDescription") }
    : { title: t("empty.polaroidTitle"), description: t("empty.polaroidDescription") };

  return (
    <section className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card px-5 py-10 text-center shadow-card">
      <MaterialSymbol className="text-2xl text-primary" name={filter === "polaroid" ? "photo_library" : "auto_stories"} />
      <div className="space-y-1">
        <p className="text-sm font-bold leading-5 text-foreground">{copy.title}</p>
        <p className="text-xs leading-4 text-muted-foreground">{copy.description}</p>
      </div>
      <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold leading-5 text-primary-foreground" onClick={onReset} type="button">
        <MaterialSymbol className="text-sm" name="spa" />
        <span>{t("showAll")}</span>
      </button>
    </section>
  );
}
