import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MaterialSymbol } from "@/components/ui/material-symbol";

export async function RewardStory() {
  const t = await getTranslations("reward");
  const format = await getFormatter();

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="flex flex-col justify-between rounded-3xl bg-card p-6 shadow-card lg:col-span-2 lg:p-8">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-full bg-secondary p-3 text-2xl text-primary"><MaterialSymbol className="text-2xl" name="psychiatry" /></span>
            <div><h2 className="text-xl font-semibold">{t("philosophy.title")}</h2><p className="mt-1 text-xs text-muted-foreground">{t("philosophy.subtitle")}</p></div>
          </div>
          <p className="my-6 max-w-prose text-base leading-8 text-muted-foreground">{t("philosophy.body")}</p>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-secondary p-4">
            <div className="flex items-center gap-3"><MaterialSymbol className="text-2xl text-primary" name="eco" /><div><p className="text-sm font-bold">{t("philosophy.seed")}</p><p className="mt-1 text-xs text-muted-foreground">{t("philosophy.steady")}</p></div></div>
            <div className="flex gap-2 text-xs font-semibold text-muted-foreground">{(["ease", "kindness", "lightness"] as const).map((key) => <span className="rounded-full bg-accent/50 px-3 py-2" key={key}>{t(`philosophy.${key}`)}</span>)}</div>
          </div>
        </section>
        <aside className="rounded-3xl bg-card p-6 shadow-card">
          <h2 className="mb-3 text-xs font-bold text-primary">{t("inspiration.title")}</h2>
          <Image alt={t("inspiration.alt")} className="aspect-[5/2] w-full rounded-xl object-cover" height={200} src="/stitch/reward/journal.jpg" width={500} />
          <blockquote className="my-4 text-sm italic leading-6 text-muted-foreground" lang="vi">{t("inspiration.quote")}</blockquote>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary p-3 text-xs"><span lang="vi">{t("inspiration.author")}</span><span className="flex items-center gap-1 text-primary"><MaterialSymbol className="text-sm" name="favorite" />{t("inspiration.empathy", { count: format.number(19) })}</span></div>
        </aside>
      </div>
      <section className="flex flex-col justify-between gap-6 rounded-3xl bg-accent/60 p-6 md:flex-row md:items-center lg:p-9">
        <div className="flex items-start gap-4"><span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-card p-3 text-[32px] text-primary"><MaterialSymbol className="text-[32px]" name="potted_plant" /></span><div className="max-w-xl"><h2 className="text-xl font-semibold">{t("cta.title")}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{t("cta.description")}</p></div></div>
        <Link className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[var(--primary-shadow-sm)] hover:bg-[var(--primary-hover)]" href="/write"><MaterialSymbol className="text-xl" name="edit_note" />{t("cta.write")}</Link>
      </section>
    </>
  );
}
