import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { badges } from "../badges";

export async function RewardOverview() {
  const t = await getTranslations("reward");
  const format = await getFormatter();
  const earned = badges.filter((badge) => badge.status === "earned").length;

  return (
    <>
      <header className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-secondary px-3 text-sm font-semibold text-muted-foreground hover:text-primary" href="/calendar">
            <MaterialSymbol className="text-lg" name="arrow_back" />{t("back")}
          </Link>
          <span className="rounded-full bg-accent px-3 py-2 font-semibold text-accent-foreground">{t("preview")}</span>
        </div>
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold leading-8 text-text-deep lg:text-[32px] lg:leading-10">{t("title")}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">{t("description")}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3 self-start rounded-2xl bg-card px-4 py-3 shadow-xs lg:self-auto">
            <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent/50 p-2 text-xl text-primary"><MaterialSymbol className="text-xl" name="verified" /></span>
            <div><p className="text-xs text-muted-foreground">{t("levelLabel")}</p><p className="text-sm font-bold">{t("level")}</p></div>
          </div>
        </div>
      </header>
      <section aria-label={t("preview")} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col rounded-3xl bg-card p-6 shadow-card">
          <div className="mb-5 flex items-center justify-between gap-2"><h2 className="text-xs font-semibold text-muted-foreground">{t("stats.earned")}</h2><span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-secondary p-2 text-xl text-primary"><MaterialSymbol className="text-xl" name="military_tech" /></span></div>
          <p><strong className="text-[32px] leading-10">{format.number(earned)}</strong> <span className="text-sm text-muted-foreground">{t("stats.flowers", { count: format.number(badges.length) })}</span></p>
          <progress aria-label={t("stats.earned")} className="mt-6 h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-accent [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary" max={badges.length} value={earned} />
          <div className="mt-2 flex justify-between gap-2 text-xs text-muted-foreground"><span>{t("stats.journey", { percent: format.number(earned / badges.length, { style: "percent" }) })}</span><span className="text-primary">{t("stats.season", { count: format.number(1) })}</span></div>
        </div>
        <div className="flex flex-col rounded-3xl bg-card p-6 shadow-card">
          <div className="mb-5 flex items-center justify-between gap-2"><h2 className="text-xs font-semibold text-muted-foreground">{t("stats.streak")}</h2><span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--fire-soft)] p-2 text-xl text-[var(--fire)]"><MaterialSymbol className="text-xl" name="local_fire_department" /></span></div>
          <p><strong className="text-[32px] leading-10">{format.number(14)}</strong> <span className="text-sm font-semibold">{t("stats.days")}</span></p>
          <p className="mt-1 text-xs text-muted-foreground">{t("stats.best", { count: format.number(28) })}</p>
          <p className="mt-auto flex items-center gap-2 pt-5 text-xs text-muted-foreground"><MaterialSymbol className="text-lg text-[var(--fire)]" name="wb_sunny" />{t("stats.warmth")}</p>
        </div>
        <div className="flex flex-col rounded-3xl bg-card p-6 shadow-card">
          <div className="mb-5 flex items-center justify-between gap-2"><h2 className="text-xs font-semibold text-muted-foreground">{t("stats.moments")}</h2><span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-accent p-2 text-xl text-primary"><MaterialSymbol className="text-xl" name="psychiatry" /></span></div>
          <p><strong className="text-[32px] leading-10">{format.number(128)}</strong> <span className="text-sm font-semibold">{t("stats.seeds")}</span></p>
          <p className="mt-1 text-xs text-muted-foreground">{t("stats.months", { count: format.number(4) })}</p>
          <p className="mt-auto flex items-center gap-2 pt-5 text-xs font-semibold text-primary"><MaterialSymbol className="text-lg" name="check_circle" />{t("stats.positive")}</p>
        </div>
        <aside className="rounded-3xl bg-accent/35 p-6">
          <div className="flex items-center gap-3"><Image alt="" className="rounded-2xl" height={44} src="/stitch/feed/mascot.jpg" width={44} /><div><h2 className="text-xs font-bold">{t("stats.whisper")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("stats.companion")}</p></div></div>
          <p className="mt-4 text-sm italic leading-6 text-muted-foreground">{t("stats.encouragement", { count: format.number(7) })}</p>
        </aside>
      </section>
    </>
  );
}
