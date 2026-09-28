"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { DesktopFooter, FilterPills, HeroActions } from "../calendar-shell";
import { GardenDesktop, GardenMobile } from "../calendar-garden";
import { Badges, MascotWhisper, MonthCalendar, TodayMoments } from "../calendar-time";
import { MascotLevel, Metric } from "../calendar-stat";
import type { CalendarOverview } from "@/lib/calendar/dto";

export function CalendarScreen({ overview }: Readonly<{ overview: CalendarOverview }>) {
  return (
    <div className="min-h-dvh font-[family-name:var(--font-quicksand)] text-foreground">
      <DesktopCalendar overview={overview} />
      <MobileCalendar overview={overview} />
    </div>
  );
}

function DesktopCalendar({ overview }: Readonly<{ overview: CalendarOverview }>) {
  const t = useTranslations("calendar");
  const number = new Intl.NumberFormat(useLocale());
  return (
    <div className="hidden min-h-dvh md:block">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-10 pt-24 lg:px-16">
        <HeroActions overview={overview} />
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label={t("metrics.streak.label")} icon="local_fire_department" value={number.format(overview.stats.currentStreak)} unit={t("metrics.streak.unit")} hint={t("metrics.streak.hint", { count: number.format(overview.stats.longestStreak) })} tone="rose" progress={Math.min(overview.stats.currentStreak * 4, 100)} />
          <Metric label={t("metrics.entries.label")} icon="eco" value={number.format(overview.stats.totalEntries)} unit={t("metrics.entries.unit")} hint={t("metrics.entries.hint", { delta: `${overview.stats.entriesDeltaFromPreviousMonth >= 0 ? "+" : ""}${number.format(overview.stats.entriesDeltaFromPreviousMonth)}` })} tone="green" progress={Math.min(overview.stats.totalEntries, 100)} />
          <Metric label={t("metrics.rate.label")} icon="check_circle" value={number.format(overview.stats.monthCompletionRate)} unit="%" hint={t("metrics.rate.hint", { active: number.format(overview.stats.activeDaysThisMonth), total: number.format(overview.stats.daysElapsedInMonth) })} tone="teal" ring={`${number.format(overview.stats.activeDaysThisMonth)}/${number.format(overview.stats.daysElapsedInMonth)}`} />
          <MascotLevel mascot={overview.mascot} />
        </section>
        <GardenDesktop overview={overview} />
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <MonthCalendar desktop overview={overview} />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5">
            <TodayMoments desktop overview={overview} />
            <MascotWhisper desktop mascot={overview.mascot} />
          </div>
        </section>
        <Badges desktop badges={overview.badges} />
      </main>
      <DesktopFooter />
    </div>
  );
}

function MobileCalendar({ overview }: Readonly<{ overview: CalendarOverview }>) {
  const t = useTranslations("calendar");
  const number = new Intl.NumberFormat(useLocale());
  return (
    <div className="mx-0 flex min-h-dvh w-[100dvw] max-w-[420px] flex-col overflow-hidden shadow-2xl md:hidden">
      <div className="flex items-center justify-between px-6 pb-1 pt-2 text-xs font-semibold text-muted-foreground">
        <span>9:41</span>
        <span>● ◒ ▱</span>
      </div>
      <header className="px-5 pb-3 pt-3">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-primary">
          <span className="text-sm">📅</span>
          <span>{t("mobile.tracker")} • <strong>{t("mobile.rhythmJournal")}</strong></span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-accent text-xl shadow-sm">🌱</div>
            <div>
              <h1 className="text-xl font-bold leading-tight text-foreground">{t("mobile.title")}</h1>
              <p className="text-xs text-muted-foreground">{t("mobile.subtitle")}</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 shadow-sm">🔥 {t("mobile.streak", { count: number.format(overview.stats.currentStreak) })}</span>
        </div>
        <FilterPills compact filters={overview.filters} />
        <Link className="mt-3.5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--primary-shadow-md)]" href="/write">
          <MaterialSymbol className="text-lg" name="edit_note" />
          {t("actions.writeToday")}
        </Link>
      </header>
      <main className="mt-1 flex-1 space-y-5 px-4">
        <section className="grid grid-cols-2 gap-3">
          <Metric label={t("metrics.streak.label")} emoji="🔥" value={number.format(overview.stats.currentStreak)} unit={t("metrics.streak.unit")} hint={t("metrics.streak.mobileHint", { count: number.format(overview.stats.longestStreak) })} tone="rose" progress={Math.min(overview.stats.currentStreak * 4, 100)} mobile />
          <Metric label={t("metrics.entries.label")} emoji="🌱" value={number.format(overview.stats.totalEntries)} unit={t("metrics.entries.unit")} hint={t("metrics.entries.hint", { delta: `${overview.stats.entriesDeltaFromPreviousMonth >= 0 ? "+" : ""}${number.format(overview.stats.entriesDeltaFromPreviousMonth)}` })} tone="green" progress={Math.min(overview.stats.totalEntries, 100)} mobile />
          <Metric label={t("metrics.rate.label")} emoji="✓" value={number.format(overview.stats.monthCompletionRate)} unit="%" hint={t("metrics.rate.mobileHint", { active: number.format(overview.stats.activeDaysThisMonth) })} tone="teal" ring={`${number.format(overview.stats.activeDaysThisMonth)}/${number.format(overview.stats.daysElapsedInMonth)}`} mobile />
          <MascotLevel mascot={overview.mascot} mobile />
        </section>
        <GardenMobile overview={overview} />
        <MonthCalendar overview={overview} />
        <TodayMoments overview={overview} />
        <MascotWhisper mascot={overview.mascot} />
        <Badges badges={overview.badges} />
        <footer className="space-y-1 pb-6 pt-4 text-center text-muted-foreground">
          <p className="text-xs font-semibold text-[var(--leaf-deep)]">Grateful Forum</p>
          <p className="text-[11px] italic">“{t("footer.tagline")}”</p>
          <p className="pt-2 text-[10px] text-muted-foreground/70">{t("footer.copyright")}</p>
        </footer>
      </main>
    </div>
  );
}
