"use client";

import { FeedPreviewClient } from "../../preview/_components/feed-preview-client";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { appendFeedPage, toFeedPreview } from "@/lib/feed/access";
import { ApiClientError } from "@/lib/api/fetch-json";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { loadMoreFeed } from "@/lib/api/feed";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FeedPage } from "@/lib/feed/types";
import type { FeedVisibilityFilter } from "@/lib/feed/validation";
import type { ReactNode } from "react";
import type { AppLocale } from "@/i18n/routing";
import {
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
  aside,
  initialVisibility = "all",
}: Readonly<{ initialPage: FeedPage; aside: ReactNode; initialVisibility?: FeedVisibilityFilter }>) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("feed");
  const router = useRouter();
  const pathname = usePathname();
  const [filterPending, startFilterTransition] = useTransition();
  const dailyPractice = <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{t.rich("dailyPractice", { strong: (chunks) => <strong className="font-bold text-primary">{chunks}</strong> })}</p>;
  const copy = {
    all: t("filters.all"), ordinary: t("filters.ordinary"), polaroid: t("filters.polaroid"),
    ordinaryEmptyTitle: t("empty.ordinaryTitle"), ordinaryEmptyDescription: t("empty.ordinaryDescription"),
    polaroidEmptyTitle: t("empty.polaroidTitle"), polaroidEmptyDescription: t("empty.polaroidDescription"),
    loading: t("loading"), done: t("done"), noPublic: t("noPublic"), eyebrow: t("eyebrow"),
    title: t("title"), description: t("description"), showAll: t("showAll"),
  };
  const [page, setPage] = useState(() => initialPage.requiresLogin ? toFeedPreview(initialPage.items) : initialPage);
  const { items, nextCursor: cursor, requiresLogin } = page;
  const done = !cursor;
  const accessRevision = useRef(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const restrictToPreview = useCallback(() => {
    accessRevision.current += 1;
    setPage((current) => toFeedPreview(current.items));
    setLoading(false);
    setError("");
    if (pathname !== "/feed/preview") {
      router.replace("/feed/preview");
      router.refresh();
    }
  }, [pathname, router]);

  useEffect(() => {
    if (!hasSupabaseEnv()) return;
    const supabase = createSupabaseBrowserClient();
    let active = true;
    const revalidate = () => {
      void supabase.auth.getUser().then(({ data, error }) => {
        if (active && (error || !data.user || data.user.is_anonymous)) restrictToPreview();
      }).catch(() => { if (active) restrictToPreview(); });
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session || session.user.is_anonymous) restrictToPreview();
    });
    window.addEventListener("focus", revalidate);
    window.addEventListener("pageshow", revalidate);
    return () => {
      active = false;
      subscription.unsubscribe();
      window.removeEventListener("focus", revalidate);
      window.removeEventListener("pageshow", revalidate);
    };
  }, [restrictToPreview]);

  const loadMore = useCallback(async () => {
    if (requiresLogin || !cursor || loading || done) {
      return;
    }

    const revision = accessRevision.current;
    setLoading(true);
    setError("");
    try {
      const nextPage = await loadMoreFeed(cursor, initialVisibility);
      if (revision !== accessRevision.current) return;
      if (nextPage.requiresLogin) {
        restrictToPreview();
        return;
      }
      setPage((current) => appendFeedPage(current, nextPage));
    } catch (loadError) {
      if (revision !== accessRevision.current) return;
      if (loadError instanceof ApiClientError && loadError.code === "auth_required") {
        restrictToPreview();
        return;
      }
      setError(t("loadError"));
    } finally {
      if (revision === accessRevision.current) setLoading(false);
    }
  }, [cursor, done, loading, requiresLogin, restrictToPreview, initialVisibility, t]);

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
  const status = error || (loading ? copy.loading : !requiresLogin && done && items.length ? copy.done : "");
  const showMobileEnd = !requiresLogin && !loading && !error && done && items.length > 0;
  const visibilityLabel = t(`filters.visibility${initialVisibility === "all" ? "All" : initialVisibility === "anonymous" ? "Anonymous" : "Public"}`);
  const filterControls = (
    <div className="@container w-full min-w-0">
      <div className="flex min-w-0 flex-col gap-2 @min-[38rem]:flex-row @min-[38rem]:items-center">
        <div aria-label={t("filters.content")} className="grid min-w-0 flex-1 grid-cols-3 gap-1 rounded-2xl border border-border/60 bg-card/90 p-1" role="group">
          {feedFilters.map((item) => (
            <button
              aria-pressed={filter === item.key}
              className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs! leading-4! font-semibold! outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ring ${filter === item.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-primary"}`}
              key={item.key}
              onClick={() => setFilter(item.key)}
              type="button"
            >
              <MaterialSymbol className="hidden shrink-0 text-base @min-[22rem]:inline-flex" name={item.icon} strokeWidth={1.8} />
              <span>{copy[item.key]}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-start @min-[38rem]:shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label={`${t("filters.visibility")}: ${visibilityLabel}`}
                className={`flex min-h-11 min-w-11 max-w-full items-center justify-center gap-2 rounded-full border border-border/60 px-3 text-xs! leading-4! font-medium! outline-none transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ring disabled:opacity-60 ${initialVisibility === "all" ? "bg-card/90 text-muted-foreground" : "bg-accent text-accent-foreground"}`}
                disabled={filterPending}
                type="button"
              >
                <MaterialSymbol className="text-base" name="tune" strokeWidth={1.8} />
                <span>{initialVisibility === "all" ? t("filters.visibility") : visibilityLabel}</span>
                <MaterialSymbol className="text-sm" name="keyboard_arrow_down" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52 rounded-xl p-1.5">
              <DropdownMenuLabel className="px-2 py-1.5">{t("filters.visibility")}</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                onValueChange={(value) => {
                  if (value === "all" || value === "anonymous" || value === "public") {
                    startFilterTransition(() => router.replace({ pathname: "/feed", query: { visibility: value } }, { scroll: false }));
                  }
                }}
                value={initialVisibility}
              >
                {(["all", "anonymous", "public"] as const).map((value) => (
                  <DropdownMenuRadioItem className="min-h-11 rounded-lg text-xs" key={value} value={value}>
                    {t(`filters.visibility${value === "all" ? "All" : value === "anonymous" ? "Anonymous" : "Public"}`)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
  const emptyState = filter === "all" ? <FeedEmptyState locale={locale} /> : <FilteredFeedEmptyState filter={filter} onReset={() => setFilter("all")} />;

  if (requiresLogin) return <FeedPreviewClient initialPage={page} />;

  return (
    <div aria-busy={filterPending} className="app-garden-bg w-full min-h-svh text-foreground">
      <main className="w-full max-w-full min-h-svh md:mx-auto md:max-w-7xl md:px-6">
        <section className="flex w-full max-w-full min-w-0 flex-col gap-5 px-5 pt-5 md:hidden">
          <MobileReflectionBanner />
          {dailyPractice}
          {filterControls}
          <div className="flex flex-col gap-4">
            {feedItems.length ? feedItems.map((item) => (
              <MobileFeedCard item={item} key={item.id} locale={locale} />
            )) : emptyState}
          </div>
          {showMobileEnd ? <MobileFeedEnd status={items.length ? "" : copy.noPublic} /> : null}
        </section>

        <section className="hidden w-full py-8 md:block">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
            <div className="flex min-w-0 flex-col gap-6 md:col-span-7 lg:col-span-8">
              <div className="flex flex-col items-start justify-between gap-4 pb-3">
                <div className="flex w-full items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {copy.eyebrow}
                    </p>
                    <h1 className="mt-2 text-2xl font-bold leading-snug tracking-tight text-foreground">
                      {copy.title}
                    </h1>
                    <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted-foreground">
                      {copy.description}
                    </p>
                  </div>
                </div>
                {dailyPractice}
                {filterControls}
              </div>
              <div className="flex flex-col gap-5">
                {feedItems.length ? feedItems.map((item) => (
                  <DesktopFeedCard item={item} key={item.id} locale={locale} />
                )) : emptyState}
              </div>
            </div>
            {aside}
          </div>
        </section>
        <FeedSentinel refEl={sentinelRef} status={status} />
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
      <button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-transparent bg-primary px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ring text-sm font-bold leading-5 text-primary-foreground" onClick={onReset} type="button">
        <MaterialSymbol className="text-sm" name="spa" />
        <span>{t("showAll")}</span>
      </button>
    </section>
  );
}
