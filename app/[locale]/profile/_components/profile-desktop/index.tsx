import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Link } from "@/i18n/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { ProfileEditModalButton } from "../profile-modals-client";
import { Avatar, MilestoneCard, Pill } from "../profile-desktop-cards";
import { ProfileDesktopTabs } from "../profile-desktop-tabs-client";
import type { ProfileView } from "../profile-view";

export function DesktopProfile({
  initialTab,
  view,
}: Readonly<{ initialTab: "all" | "public" | "moments"; view: ProfileView }>) {
  return (
    <div className="hidden min-h-svh flex-col md:flex">
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6">
        <div className="flex w-full flex-col space-y-8 py-8">
          <DesktopHero view={view} />
          <ProfileDesktopTabs initialTab={initialTab} view={view} />
          <MilestoneCard view={view} />
          <RhythmCard view={view} />
        </div>
      </main>
      <DesktopFooter />
    </div>
  );
}

function DesktopHero({ view }: Readonly<{ view: ProfileView }>) {
  const t = useTranslations("profile");
  const number = new Intl.NumberFormat(useLocale());
  return (
    <section className="relative overflow-hidden rounded-xl bg-card p-6 shadow-sm lg:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-accent/30 blur-2xl" />
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-5">
            <div className="relative shrink-0">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shadow-md">
                <Avatar className="h-full w-full" src={view.avatarDesktop} />
              </div>
              <span className="absolute -bottom-1 -right-1 flex rounded-full bg-primary p-1 text-primary-foreground shadow-sm">
                <MaterialSymbol className="text-sm" fill name="eco" />
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col space-y-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h1 className="min-w-0 [overflow-wrap:anywhere] text-2xl font-semibold leading-8 text-foreground">
                  {view.displayName}
                </h1>
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium leading-[14px] text-primary">
                  {t(`soulTitles.${view.soulTitle}`)}
                </span>
              </div>
              {view.bio ? <p className="max-w-md [overflow-wrap:anywhere] text-sm leading-6 text-muted-foreground">{view.bio}</p> : null}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <Pill icon="spa" text={t("stats.entries", { count: number.format(view.entryCount) })} />
                <Pill icon="local_fire_department" text={t("stats.streak", { count: number.format(view.streak) })} tone="fire" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 xl:shrink-0" data-tour="profile-desktop-edit"><Link className="inline-flex min-h-11 items-center rounded-xl bg-muted px-4 text-sm font-semibold text-primary" href="/write?tour=first-entry">{t("onboarding.replay")}</Link><ProfileEditModalButton view={view} /></div>
        </div>
        <WeeklyRhythm view={view} />
      </div>
    </section>
  );
}

function WeeklyRhythm({ view }: Readonly<{ view: ProfileView }>) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const activeCount = view.weeklyRhythm.filter((day) => day.active).length;
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });

  return (
    <div data-tour="profile-desktop-rhythm" className="flex flex-col gap-4 border-t border-primary/10 pt-5 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/60 text-primary">
          <MaterialSymbol className="text-base" fill name="potted_plant" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-foreground">{t("rhythm.title")}</span>
            <span className="rounded-full bg-accent/50 px-2 py-0.5 text-[11px] font-bold text-[var(--leaf-deep)]">{t("rhythm.active", { count: activeCount })}</span>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{activeCount ? t("rhythm.written", { count: activeCount }) : t("rhythm.none")}</p>
        </div>
      </div>
      <div className="grid w-full shrink-0 grid-cols-7 gap-1.5 md:w-72 lg:w-80">
        {view.weeklyRhythm.map((day) => (
          <div className={`${day.active ? "bg-accent/35" : "bg-muted opacity-70"} flex flex-col items-center gap-1 rounded-lg py-1.5`} key={day.date}>
            <span className={`text-[10px] ${day.isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>{weekday.format(new Date(`${day.date}T12:00:00Z`))}</span>
            <span aria-label={t("a11y.rhythmDay", { day: weekday.format(new Date(`${day.date}T12:00:00Z`)), count: day.count })} className={`${day.active ? "bg-primary text-primary-foreground" : day.isToday ? "bg-card text-primary ring-1 ring-primary/35" : "bg-input text-muted-foreground"} flex h-6 w-6 items-center justify-center rounded-full text-[12px]`} title={new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(`${day.date}T12:00:00Z`))}>
              {day.active ? (day.count > 2 ? "🌸" : day.count === 2 ? "🌿" : "🌱") : "·"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RhythmCard({ view }: Readonly<{ view: ProfileView }>) {
  const t = useTranslations("profile");
  const format = useFormatter();
  const locale = useLocale();
  return (
    <section className="flex flex-col items-start justify-between gap-4 rounded-xl bg-card p-6 shadow-sm lg:flex-row lg:items-center">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-primary">
          <MaterialSymbol fill name="calendar_month" />
        </span>
        <div>
          <h3 className="text-xl font-semibold leading-7 text-foreground">{t("monthRhythm.title")}</h3>
          <p className="text-xs font-medium leading-4 text-muted-foreground">
            {t("monthRhythm.description", {
              count: view.monthlyRhythm.activeDays,
              total: view.monthlyRhythm.totalDays,
              rate: format.number(view.monthlyRhythm.completionRate, { style: "percent", maximumFractionDigits: 0 }),
            })}
          </p>
        </div>
      </div>
      <div aria-label={t("rhythm.title")} className="flex shrink-0 items-center gap-1.5" role="group">
        {view.weeklyRhythm.map((day) => (
          <span
            aria-label={t("a11y.rhythmDay", { day: format.dateTime(new Date(`${day.date}T12:00:00Z`), { dateStyle: "medium", timeZone: "UTC" }), count: day.count })}
            aria-current={day.isToday ? "date" : undefined}
            className={`flex h-6 w-6 shrink-0 items-center justify-center whitespace-nowrap rounded-md text-[10px] ${day.active ? "bg-primary font-bold text-primary-foreground" : "bg-input text-muted-foreground"}`}
            key={day.date}
          >
            {format.dateTime(new Date(`${day.date}T12:00:00Z`), { weekday: locale === "vi" ? "narrow" : "short", timeZone: "UTC" })}
          </span>
        ))}
      </div>
    </section>
  );
}

function DesktopFooter() {
  const t = useTranslations("profile");
  return (
    <footer className="mt-auto w-full bg-muted py-8 shadow-sm">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6">
        <div className="flex flex-wrap items-center gap-2">
          <MaterialSymbol className="text-xl text-primary" name="eco" />
          <span className="text-xl font-semibold leading-7 text-primary">Grateful Forum</span>
          <span className="ml-2 text-[11px] font-medium leading-[14px] text-muted-foreground">
            {t("footer.tagline")}
          </span>
        </div>
        <div className="text-xs font-medium leading-4 text-muted-foreground">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
