import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { RewardOverview as Overview } from "@/lib/rewards/dto";

export async function RewardOverview({ overview }: { overview: Overview }) {
  const t = await getTranslations("reward");
  const format = await getFormatter();
  const { badges, stats } = overview;
  const earned = stats.earnedBadges;
  const next = badges.filter((badge) => badge.status !== "earned").sort((a, b) => b.current / b.total - a.current / a.total || a.id - b.id)[0];

  return (
    <>
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <Link className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-secondary px-3 text-xs font-semibold text-muted-foreground hover:text-primary" href="/calendar">
            <MaterialSymbol className="text-lg" name="arrow_back" />{t("back")}
          </Link>
          <span className="rounded-full bg-accent px-3 py-2 font-semibold text-accent-foreground">{t("collection")}</span>
        </div>
        <div className="flex flex-col justify-between gap-2.5 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <h1 className="text-lg font-bold leading-6 text-text-deep lg:text-2xl lg:leading-8">{t("title")}</h1>
            <p className="mt-3 max-w-2xl text-xs leading-5 text-muted-foreground">{t("description")}</p>
            {stats.totalEntries === 0 ? <p className="mt-2 text-xs font-semibold text-primary">{t("empty")}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-2.5 self-start rounded-2xl bg-card px-3 py-2 shadow-xs lg:self-auto">
            <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent/50 p-2 text-[15px] text-primary"><MaterialSymbol className="text-[15px]" name="verified" /></span>
            <div><p className="text-xs text-muted-foreground">{t("levelLabel")}</p><p className="text-xs font-bold">{t(stats.earnedBadges >= 9 ? "levels.tree" : stats.earnedBadges >= 6 ? "levels.bloom" : stats.earnedBadges >= 1 ? "levels.sprout" : "levels.seed")}</p></div>
          </div>
        </div>
      </header>
      <section aria-label={t("collection")} className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col rounded-2xl bg-card p-[18px] shadow-card">
          <div className="mb-4 flex items-center justify-between gap-2"><h2 className="text-xs font-semibold text-muted-foreground">{t("stats.earned")}</h2><span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-secondary p-2 text-[15px] text-primary"><MaterialSymbol className="text-[15px]" name="military_tech" /></span></div>
          <p><strong className="text-2xl leading-8">{format.number(earned)}</strong> <span className="text-xs text-muted-foreground">{t("stats.flowers", { count: format.number(badges.length) })}</span></p>
          <progress aria-label={t("stats.earned")} className="mt-3 h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-accent [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary" max={badges.length} value={earned} />
          <div className="mt-2 flex justify-between gap-2 text-xs text-muted-foreground"><span>{t("stats.journey", { percent: format.number(earned / badges.length, { style: "percent" }) })}</span></div>
        </div>
        <div className="flex flex-col rounded-2xl bg-card p-[18px] shadow-card">
          <div className="mb-4 flex items-center justify-between gap-2"><h2 className="text-xs font-semibold text-muted-foreground">{t("stats.streak")}</h2><span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--fire-soft)] p-2 text-[15px] text-[var(--fire)]"><MaterialSymbol className="text-[15px]" name="local_fire_department" /></span></div>
          <p><strong className="text-2xl leading-8">{format.number(stats.currentStreak)}</strong> <span className="text-xs font-semibold">{t("stats.days")}</span></p>
          <p className="mt-1 text-xs text-muted-foreground">{t("stats.best", { count: format.number(stats.longestStreak) })}</p>
          <p className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground"><MaterialSymbol className="text-lg text-[var(--fire)]" name="wb_sunny" />{t("stats.warmth")}</p>
        </div>
        <div className="flex flex-col rounded-2xl bg-card p-[18px] shadow-card">
          <div className="mb-4 flex items-center justify-between gap-2"><h2 className="text-xs font-semibold text-muted-foreground">{t("stats.moments")}</h2><span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-accent p-2 text-[15px] text-primary"><MaterialSymbol className="text-[15px]" name="psychiatry" /></span></div>
          <p><strong className="text-2xl leading-8">{format.number(stats.totalEntries)}</strong> <span className="text-xs font-semibold">{t("stats.seeds")}</span></p>
          <p className="mt-1 text-xs text-muted-foreground">{t("stats.months", { count: format.number(stats.activeMonths) })}</p>
          <p className="mt-auto flex items-center gap-2 pt-4 text-xs font-semibold text-primary"><MaterialSymbol className="text-lg" name="check_circle" />{t("stats.positive")}</p>
        </div>
        <aside className="rounded-2xl bg-accent/35 p-[18px]">
          <div className="flex items-center gap-2.5"><Image alt="" className="rounded-2xl" height={33} src="/stitch/feed/mascot.jpg" width={33} /><div><h2 className="text-xs font-bold">{t("stats.whisper")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("stats.companion")}</p></div></div>
          <p className="mt-3 text-xs italic leading-6 text-muted-foreground">{next ? t("stats.next", { badge: t(`badges.${next.id}.title`), current: format.number(next.current), total: format.number(next.total) }) : t("stats.complete")}</p>
        </aside>
      </section>
    </>
  );
}
