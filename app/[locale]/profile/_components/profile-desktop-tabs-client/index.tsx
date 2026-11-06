"use client";

import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ProfileJournalBook } from "../profile-journal-book";
import { MomentsTab } from "../profile-moments-tab";
import { AllTab, PublicTab } from "../profile-public-tab";
import type { ProfileView } from "../profile-view";

type Tab = "all" | "public" | "moments";
type LayoutMode = "grid" | "journal" | "list";

export function ProfileDesktopTabs({
  initialTab,
  view,
}: Readonly<{ initialTab: Tab; view: ProfileView }>) {
  const t = useTranslations("profile");
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const tab = initialTab;
  function setTab(value: Tab, layout?: LayoutMode) {
    const next = new URLSearchParams(search.toString());
    next.set("tab", value); if (layout) next.set("layout", layout); next.delete("cursor"); next.delete("entry"); next.delete("edge");
    router.push(`${pathname}?${next}`);
  }
  const requestedLayout = search.get("layout");
  const layout: LayoutMode = requestedLayout === "grid" || requestedLayout === "list" ? requestedLayout : "journal";
  function setLayout(value: LayoutMode) {
    const next = new URLSearchParams(search.toString()); next.set("layout", value);
    router.push(`${pathname}?${next}`);
  }
  const entries = tab === "public" ? view.entries.filter((entry) => entry.visibility === "public" || entry.visibility === "anonymous") : view.entries;

  return (
    <section className="flex flex-col space-y-4">
      <div data-tour="profile-desktop-entries" className="rounded-2xl border border-primary/10 bg-muted/80 p-2 xl:flex xl:items-center xl:gap-3">
        <div className="grid min-w-0 grid-cols-3 gap-1.5 xl:flex xl:flex-1 xl:flex-wrap">
          <DesktopTab active={tab === "all"} count={view.entryCount} label={t("desktopTabs.all")} onClick={() => setTab("all")} />
          <DesktopTab active={tab === "public"} count={view.publicCount} label={t("desktopTabs.public")} onClick={() => setTab("public")} />
          <DesktopTab active={tab === "moments"} count={0} label={t("desktopTabs.moments")} onClick={() => setTab("moments")} />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 pt-2 xl:mt-0 xl:shrink-0 xl:border-0 xl:pt-0">
          <button
            aria-pressed={layout === "journal" && tab !== "moments"}
            className={`inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm transition-all ${layout === "journal" && tab !== "moments" ? "bg-primary text-primary-foreground" : "bg-card/70 text-muted-foreground hover:text-primary"}`}
            onClick={() => {
              setTab("all", "journal");
            }}
            type="button"
          >
            <MaterialSymbol className="text-sm" name="auto_stories" />
            <span>{t("tabs.journal")}</span>
            <span className="rounded-md bg-card/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wider">{t("desktopTabs.new")}</span>
          </button>
          {tab === "moments" ? null : (
            <ListControls layout={layout} onChange={setLayout} />
          )}
        </div>
      </div>
      {tab === "moments" ? (
        <MomentsTab layout={layout === "journal" ? "list" : layout} />
      ) : layout === "journal" ? (
        <ProfileJournalBook key={`${view.requestedEntry}-${tab}`} view={{ ...view, entries }} />
      ) : tab === "public" ? (
        <PublicTab entries={entries} layout={layout} />
      ) : (
        <AllTab entries={entries} layout={layout} />
      )}
    </section>
  );
}

function DesktopTab({
  active = false,
  count,
  label,
  onClick,
}: Readonly<{ active?: boolean; count: number; label: string; onClick?: () => void }>) {
  return (
    <button
      aria-pressed={active}
      className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${active ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:bg-card/70 hover:text-foreground"}`}
      onClick={onClick}
      type="button"
    >
      <span className="min-w-0 text-center">{label}</span>
      <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
        {count}
      </span>
    </button>
  );
}

function ListControls({
  layout,
  onChange,
}: Readonly<{
  layout: LayoutMode;
  onChange: (layout: LayoutMode) => void;
}>) {
  const t = useTranslations("profile");
  return (
    <div className="ml-auto inline-flex shrink-0 rounded-xl border border-primary/10 bg-card/95 p-1 shadow-sm">
      <button
        aria-pressed={layout === "grid"}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-lg transition-all ${layout === "grid" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => onChange("grid")}
        title={t("a11y.grid")}
        type="button"
      >
        <MaterialSymbol className="text-lg" name="grid_view" strokeWidth={1.6} />
      </button>
      <button
        aria-pressed={layout === "list"}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-lg transition-all ${layout === "list" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => onChange("list")}
        title={t("a11y.list")}
        type="button"
      >
        <MaterialSymbol className="text-lg" name="stream" strokeWidth={1.6} />
      </button>
      <button
        aria-pressed={layout === "journal"}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-lg transition-all ${layout === "journal" ? "bg-accent text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => onChange("journal")}
        title={t("a11y.journal")}
        type="button"
      >
        <MaterialSymbol className="text-lg" name="auto_stories" strokeWidth={1.6} />
      </button>
    </div>
  );
}
