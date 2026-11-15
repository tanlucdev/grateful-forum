"use client";

import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ProfileSavedPostsClient } from "../profile-saved-posts-client";
import { ProfileJournalBook } from "../profile-journal-book";
import { MomentsTab } from "../profile-moments-tab";
import { AllTab, PublicTab } from "../profile-public-tab";
import type { ProfileView } from "../profile-view";

type Tab = "all" | "public" | "moments" | "saved";
type LayoutMode = "grid" | "journal" | "list";

export function ProfileDesktopTabs({
  initialTab,
  view,
  mobile = false,
}: Readonly<{ initialTab: Tab; view: ProfileView; mobile?: boolean }>) {
  const t = useTranslations("profile");
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const tab = initialTab;
  function setTab(value: Tab) {
    const next = new URLSearchParams(search.toString());
    next.set("tab", value); next.delete("cursor"); next.delete("entry"); next.delete("edge"); next.delete("savedPage");
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
    <section className="@container flex flex-col space-y-4">
      <div data-tour={mobile ? "profile-mobile-entries" : "profile-desktop-entries"} className="flex min-w-0 flex-col gap-1">
        <div className="grid min-w-0 grid-cols-2 @min-[28rem]:grid-cols-4 border-b border-primary/10 @min-[36rem]:flex">
          <DesktopTab active={tab === "all"} count={view.entryCount} label={t("desktopTabs.all")} onClick={() => setTab("all")} />
          <DesktopTab active={tab === "public"} count={view.publicCount} label={t("desktopTabs.public")} onClick={() => setTab("public")} />
          <DesktopTab active={tab === "saved"} label={t("saved.title")} onClick={() => setTab("saved")} />
          <DesktopTab active={tab === "moments"} label={t("desktopTabs.moments")} onClick={() => setTab("moments")} />
        </div>
        {tab !== "moments" && tab !== "saved" ? <ListControls layout={layout} onChange={setLayout} /> : null}
      </div>
      {tab === "saved" ? (
        <ProfileSavedPostsClient data={view.saved} error={view.savedError} key={search.toString()} />
      ) : tab === "moments" ? (
        <MomentsTab layout={layout === "journal" ? "list" : layout} />
      ) : layout === "journal" ? (
        <ProfileJournalBook mobile={mobile} key={`${view.requestedEntry}-${tab}`} view={{ ...view, entries }} />
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
}: Readonly<{ active?: boolean; count?: number; label: string; onClick?: () => void }>) {
  const format = useFormatter();
  return (
    <Button variant="ghost"
      aria-pressed={active}
      className={`relative inline-flex h-auto min-h-11 min-w-0 items-center justify-center gap-1 rounded-none px-1.5 py-2 text-xs font-semibold transition-colors @min-[36rem]:px-4 ${active ? "text-primary after:absolute after:inset-x-1.5 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary" : "text-muted-foreground hover:text-foreground"}`}
      onClick={onClick}
      type="button"
    >
      <span className="min-w-0 whitespace-normal text-center leading-4">{label}</span>
      {count !== undefined ? <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
        {format.number(count)}
      </span> : null}
    </Button>
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
    <div className="ml-auto inline-flex shrink-0 gap-0.5">
      <Button variant="ghost" size="icon"
        aria-pressed={layout === "grid"}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-lg p-0 transition-colors ${layout === "grid" ? "bg-accent text-primary" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => onChange("grid")}
        aria-label={t("a11y.grid")}
        type="button"
      >
        <MaterialSymbol className="text-[18px]" name="grid_view" strokeWidth={1.6} />
      </Button>
      <Button variant="ghost" size="icon"
        aria-pressed={layout === "list"}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-lg p-0 transition-colors ${layout === "list" ? "bg-accent text-primary" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => onChange("list")}
        aria-label={t("a11y.list")}
        type="button"
      >
        <MaterialSymbol className="text-[18px]" name="stream" strokeWidth={1.6} />
      </Button>
      <Button variant="ghost" size="icon"
        aria-pressed={layout === "journal"}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-lg p-0 transition-colors ${layout === "journal" ? "bg-accent text-primary" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => onChange("journal")}
        aria-label={t("a11y.journal")}
        type="button"
      >
        <MaterialSymbol className="text-[18px]" name="auto_stories" strokeWidth={1.6} />
      </Button>
    </div>
  );
}
