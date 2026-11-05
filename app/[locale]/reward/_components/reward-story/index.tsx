import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { RewardOverview } from "@/lib/rewards/dto";

export async function RewardStory({ overview }: { overview: RewardOverview }) {
  const t = await getTranslations("reward");
  const format = await getFormatter();
  const next = overview.badges.filter((badge) => badge.status !== "earned")
    .sort((a, b) => b.current / b.total - a.current / a.total || a.id - b.id)[0];

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="flex flex-col justify-between rounded-2xl bg-card p-[18px] shadow-card lg:col-span-2 lg:p-6">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-full bg-secondary p-2 text-lg text-primary"><MaterialSymbol className="text-lg" name="psychiatry" /></span>
            <div><h2 className="text-[15px] font-semibold">{t("philosophy.title")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("philosophy.subtitle")}</p></div>
          </div>
          <p className="my-4 max-w-prose text-xs leading-6 text-muted-foreground">{t("philosophy.body")}</p>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary p-3">
            <div className="flex items-center gap-2.5"><MaterialSymbol className="text-lg text-primary" name="eco" /><div><p className="text-xs font-bold">{t("philosophy.seed")}</p><p className="mt-1 text-xs text-muted-foreground">{t("philosophy.steady")}</p></div></div>
            <div className="flex gap-1.5 text-xs font-semibold text-muted-foreground">{(["ease", "kindness", "lightness"] as const).map((key) => <span className="rounded-full bg-accent/50 px-2 py-1.5" key={key}>{t(`philosophy.${key}`)}</span>)}</div>
          </div>
        </section>
        <aside className="flex flex-col items-center justify-center rounded-2xl bg-card p-[18px] text-center shadow-card">
          <h2 className="text-[15px] font-semibold">{t(next ? "next.title" : "next.complete")}</h2>
          {next ? <>
            <Image alt="" className="my-3" height={84} src={`/stitch/reward/badge-${next.id}.svg`} width={84} />
            <h3 className="text-sm font-semibold">{t(`badges.${next.id}.title`)}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{t(`badges.${next.id}.condition`)}</p>
            <p className="mt-3 text-xs font-semibold text-primary">{t(`progressUnits.${next.unit}`, { current: format.number(next.current), total: format.number(next.total) })}</p>
          </> : <MaterialSymbol className="my-5 text-4xl text-primary" name="military_tech" />}
        </aside>
      </div>
      <section className="flex flex-col justify-between gap-4 rounded-2xl bg-accent/60 p-[18px] md:flex-row md:items-center lg:p-7">
        <div className="flex items-start gap-3"><span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-card p-2 text-2xl text-primary"><MaterialSymbol className="text-2xl" name="potted_plant" /></span><div className="max-w-xl"><h2 className="text-[15px] font-semibold">{t("cta.title")}</h2><p className="mt-1.5 text-xs leading-5 text-muted-foreground">{t("cta.description")}</p></div></div>
        <Link className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-[var(--primary-shadow-sm)] hover:bg-[var(--primary-hover)]" href="/write"><MaterialSymbol className="text-[15px]" name="edit_note" />{t("cta.write")}</Link>
      </section>
    </>
  );
}
