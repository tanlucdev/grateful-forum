"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { CalendarOverview } from "@/lib/calendar/dto";

export function HeroActions({ overview }: Readonly<{ overview: CalendarOverview }>) {
  const t = useTranslations("calendar");
  return (
    <section className="grid gap-5 pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:items-end">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
          <MaterialSymbol className="text-base text-primary" name="calendar_today" />
          <span>{t("hero.tracker")}</span>
          <span>•</span>
          <span className="font-semibold text-primary">{t("hero.rhythmJournal")}</span>
        </div>
        <h1 className="mt-1.5 text-[32px] font-bold leading-10 text-foreground">{t("hero.title")}</h1>
        <p className="mt-1 max-w-2xl text-base leading-6 text-muted-foreground">{t("hero.description")}</p>
      </div>
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-secondary/75 p-1.5 shadow-sm">
        <FilterPills filters={overview.filters} />
        <Link className="flex h-12 items-center justify-center gap-2 rounded-[14px] bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[var(--primary-shadow-md)] hover:bg-[var(--primary-hover)]" href="/write">
          <MaterialSymbol className="text-lg" name="edit_note" />
          {t("actions.writeToday")}
        </Link>
      </div>
    </section>
  );
}

export function FilterPills({ compact = false, filters }: Readonly<{ compact?: boolean; filters: CalendarOverview["filters"] }>) {
  const t = useTranslations("calendar");
  return (
    <nav
      aria-label={t("a11y.filters")}
      className={`${compact ? "mt-4 text-[11px]" : "text-sm"} flex min-h-12 items-center gap-1 rounded-[14px] bg-secondary p-1 font-semibold text-muted-foreground`}
      data-tour={compact ? "calendar-mobile-filter" : "calendar-desktop-filter"}
    >
      {filters.map((item) => (
        <Link
          aria-current={item.active ? "page" : undefined}
          className={`${compact ? "flex-1 px-1.5 py-2" : "flex-1 px-3 py-2.5"} rounded-[10px] text-center leading-5 outline-offset-2 ${
            item.active ? "bg-card text-primary shadow-sm" : "hover:bg-card/55 hover:text-foreground"
          }`}
          href={item.href}
          key={item.key}
        >
          {item.key === "year" ? t("filters.year", { year: new URLSearchParams(item.href.split("?")[1]).get("year") ?? "" }) : t(`filters.${item.key}`)}
        </Link>
      ))}
    </nav>
  );
}

export function DesktopFooter() {
  const t = useTranslations("calendar");
  return (
    <footer className="w-full bg-muted/60 py-8 shadow-sm">
      <div className="flex w-full flex-col items-center justify-between gap-4 px-6 text-center text-muted-foreground sm:flex-row sm:text-left lg:px-16">
        <div><p className="text-xl font-semibold text-primary">Grateful Forum</p><p>{t("footer.tagline")}</p></div>
        <div className="text-xs">{t("footer.copyright")}</div>
      </div>
    </footer>
  );
}
