import { Link } from "@/i18n/navigation";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { useTranslations } from "next-intl";
import { ProfileEditModalButton } from "../profile-modals-client";
import { ProfileJournalBook } from "../profile-journal-book";
import type { ProfileView } from "../profile-view";

export function MobileProfile({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <div className="min-h-svh md:hidden">
      <main className="relative w-full overflow-hidden px-5 pb-8 pt-6">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-accent/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 top-10 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
        <ProfileBrief view={view} />
        <WeeklyRhythm view={view} />
        <div data-tour="profile-mobile-entries"><MobileTabs view={view} /><MobileControls /></div>
        <ProfileJournalBook key={`${view.pagination.start}-${view.requestedEntry}-${view.initialEdge}`} mobile view={view} />
      </main>
    </div>
  );
}

function ProfileBrief({ view }: Readonly<{ view: ProfileView }>) {
  const t = useTranslations("profile");
  return (
    <section className="relative z-10 flex flex-col gap-3 rounded-xl bg-card/85 p-4 shadow-sm backdrop-blur-md">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <div className="relative shrink-0">
          <div className="h-16 w-16 rounded-full bg-accent p-1 shadow-sm">
            <span className="block h-full w-full overflow-hidden rounded-full bg-card bg-cover bg-center" style={{ backgroundImage: `url(${view.avatarMobile})` }} />
          </div>
          <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground shadow-sm">
            <MaterialSymbol className="text-xs" fill name="spa" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="min-w-0 [overflow-wrap:anywhere] text-xl font-semibold leading-7 text-foreground">{view.displayName}</h1>
            <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-accent/60 px-2 py-0.5 text-[10px] font-semibold text-primary">
              <MaterialSymbol className="text-xs" fill name="eco" />
              {t("rank")}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs leading-4 text-muted-foreground">{view.bio || t("defaultBio")}</p>
        </div>
        <div data-tour="profile-mobile-edit"><ProfileEditModalButton variant="icon" view={view} /></div>
      </div>
      <div className="flex items-center justify-between gap-1.5 pt-1">
        <MobileStat value={view.entryCount} label={t("mobile.entries")} tone="primary" />
        <MobileStat value={view.streak} label={t("mobile.streak")} suffix="🔥" tone="tertiary" />
        <MobileStat value={14} label={t("mobile.companion")} suffix="🌱" tone="secondary" />
      </div>
    </section>
  );
}

function MobileStat({
  label,
  suffix,
  tone,
  value,
}: Readonly<{ label: string; suffix?: string; tone: "primary" | "secondary" | "tertiary"; value: number }>) {
  const color = tone === "primary" ? "text-primary" : tone === "secondary" ? "text-[var(--leaf-deep)]" : "text-[var(--fire)]";

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg bg-muted/70 px-2 py-1.5 text-center">
      <div className={`flex items-center gap-0.5 text-lg font-bold leading-6 ${color}`}>
        <span>{value}</span>
        {suffix ? <span className="text-[13px] leading-none">{suffix}</span> : null}
      </div>
      <span className="truncate text-[10px] leading-[14px] text-muted-foreground">{label}</span>
    </div>
  );
}

function WeeklyRhythm({ view }: Readonly<{ view: ProfileView }>) {
  const t = useTranslations("profile");
  const activeCount = view.weeklyRhythm.filter((day) => day.active).length;

  return (
    <section data-tour="profile-mobile-rhythm" className="relative z-10 mt-3 flex flex-col gap-2 rounded-xl bg-card p-3.5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <MaterialSymbol className="text-lg text-primary" fill name="potted_plant" />
          <span className="text-xs font-semibold text-foreground">{t("rhythm.title")}</span>
        </div>
        <span className="text-[10px] font-medium text-primary">{t("rhythm.active", { count: activeCount })}</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5 pt-1">
        {view.weeklyRhythm.map((day) => (
          <div className={`${day.active ? "bg-accent/30" : "bg-muted opacity-60"} flex flex-col items-center gap-1 rounded-lg py-1.5`} key={day.date}>
            <span className={`text-[10px] ${day.isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>{day.label}</span>
            <span aria-label={t("a11y.rhythmDay", { day: day.label, count: day.count })} className={`${day.active ? "bg-primary text-primary-foreground" : day.isToday ? "bg-card text-primary ring-1 ring-primary/35" : "bg-input text-muted-foreground"} flex h-6 w-6 items-center justify-center rounded-full text-[12px]`} title={day.date}>
              {day.active ? (day.count > 2 ? "🌸" : day.count === 2 ? "🌿" : "🌱") : "·"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MobileTabs({ view }: Readonly<{ view: ProfileView }>) {
  const t = useTranslations("profile");
  return (
    <div className="relative z-10 -mx-1 mt-4 flex gap-2 overflow-x-auto py-1">
      <Link className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-muted px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm" href="/profile?tab=all">{t("tabs.all", { count: view.entryCount })}</Link>
      <button className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-[var(--leaf-deep)] px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm" type="button">
        <MaterialSymbol className="text-base" name="auto_stories" />
        {t("tabs.journal")}
      </button>
      <Link className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-muted px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm" href="/profile?tab=public">{t("tabs.public", { count: view.publicCount })}</Link>
      <button className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-muted px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm" type="button">
        {t("tabs.moments", { count: 4 })}
      </button>
    </div>
  );
}

function MobileControls() {
  const t = useTranslations("profile");
  return (
    <div className="relative z-10 mt-2 flex flex-wrap items-center justify-between gap-2">
      <div className="flex shrink-0 items-center rounded-xl bg-muted p-1 shadow-sm">
        <button aria-label={t("a11y.grid")} className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground" title={t("a11y.grid")} type="button">
          <MaterialSymbol className="text-lg" name="grid_view" />
        </button>
        <button aria-label={t("a11y.list")} className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground" title={t("a11y.list")} type="button">
          <MaterialSymbol className="text-lg" name="stream" />
        </button>
        <button aria-label={t("a11y.journal")} className="flex h-11 w-11 items-center justify-center rounded-lg bg-card text-primary shadow-sm" title={t("a11y.journal")} type="button">
          <MaterialSymbol className="text-lg" name="auto_stories" />
        </button>
      </div>
      <div className="flex min-w-0 gap-1.5 overflow-x-auto">
        {[t("filters.all"), "#giadinh", "#congviec", "#thiennhien"].map((tag, index) => (
          <span className={`${index === 0 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"} shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-medium shadow-sm`} key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
