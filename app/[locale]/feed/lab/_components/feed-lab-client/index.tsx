"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowUpRight, Bookmark, Check, Heart, Leaf, PenLine, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";

const samples = [
  { id: "first", initials: "MA", likes: 12, hour: 8, minute: 30 },
  { id: "second", initials: null, likes: 8, hour: 7, minute: 15 },
  { id: "third", initials: "TN", likes: 24, hour: 18, minute: 45 },
  { id: "fourth", initials: "HN", likes: 6, hour: 16, minute: 20 },
] as const;
const control = "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

export function FeedLabClient() {
  const feed = useTranslations("feed");
  const t = (key: string) => feed(`lab.${key}`);
  const locale = useLocale();
  const [view, setView] = useState<"community" | "saved">("community");
  const [filter, setFilter] = useState<"all" | "text" | "photos">("all");
  const [saved, setSaved] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const visible = samples.filter(({ id }) => (view !== "saved" || saved.includes(id)) && (filter === "all" || (filter === "photos" ? id === "third" : id !== "third")));
  const number = new Intl.NumberFormat(locale);
  const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

  function toggle(set: typeof setSaved, id: string) {
    set((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-4 text-foreground selection:bg-accent selection:text-accent-foreground sm:px-6 lg:pt-7">
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 border-b border-border pb-3 sm:mb-7">
        <p className="text-sm font-semibold">{t("label")}</p>
        <Link className={`${control} -mr-3 text-primary hover:bg-accent/50`} href="/feed"><ArrowLeft aria-hidden="true" size={16} />{t("original")}</Link>
        <p className="col-span-2 text-xs leading-5 text-muted-foreground">{t("notice")}</p>
      </div>

      <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,720px)_minmax(0,1fr)] lg:gap-12">
        <div className="min-w-0">
          <header className="mb-4 max-w-xl sm:mb-7">
            <h1 className="max-w-[22ch] text-2xl leading-snug font-bold tracking-tight sm:text-3xl">{t("title")}</h1>
            <p className="mt-3 hidden text-sm leading-7 text-muted-foreground sm:block sm:text-base">{t("description")}</p>
          </header>

          <Link className="group mb-5 flex min-w-0 items-center gap-4 rounded-2xl bg-accent/65 p-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:mb-8 sm:p-5" href="/write">
            <Image alt="" className="hidden shrink-0 rounded-full sm:block" height={56} src="/stitch/feed/mascot.jpg" width={56} />
            <span className="min-w-0 flex-1">
              <span className="block text-base leading-6 font-semibold">{t("prompt")}</span>
              <span className="mt-1 hidden text-sm leading-6 text-muted-foreground sm:block">{t("promptHelp")}</span>
            </span>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors group-hover:bg-primary-hover"><PenLine aria-hidden="true" size={20} /></span>
          </Link>

          <div className="mb-5 space-y-3">
            <div aria-label={t("viewFilters")} className="flex gap-5 border-b border-border" role="group">
              {(["community", "saved"] as const).map((value) => (
                <button aria-pressed={view === value} className={`flex min-h-12 min-w-11 items-center gap-2 border-b-2 px-1 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${view === value ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"}`} key={value} onClick={() => setView(value)} type="button">
                  {value === "saved" ? <Bookmark aria-hidden="true" size={16} /> : null}{t(value)}
                  {value === "saved" && saved.length ? <span className="rounded-md bg-accent px-1.5 text-xs tabular-nums">{number.format(saved.length)}</span> : null}
                </button>
              ))}
            </div>
            <div aria-label={t("contentFilters")} className="flex flex-wrap gap-1" role="group">
              {(["all", "text", "photos"] as const).map((value) => <button aria-pressed={filter === value} className={`${control} ${filter === value ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`} key={value} onClick={() => setFilter(value)} type="button">{filter === value ? <Check aria-hidden="true" size={14} /> : null}{t(value)}</button>)}
            </div>
          </div>

          <section aria-label={t(view)} className="space-y-5">
            {visible.map((item) => {
              const anonymous = !item.initials;
              const photo = item.id === "third";
              const isLiked = liked.includes(item.id);
              const isSaved = saved.includes(item.id);
              return (
                <article className="min-w-0 rounded-2xl border border-border bg-card px-4 pt-5 pb-2 [overflow-wrap:anywhere] sm:px-7 sm:pt-6 sm:pb-3" key={item.id}>
                  <header className="mb-5 flex items-center gap-3">
                    <div aria-hidden="true" className={`flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${anonymous ? "bg-muted text-muted-foreground" : "bg-accent text-accent-foreground"}`}>{item.initials || <Leaf size={20} />}</div>
                    <div className="min-w-0">
                      <h2 className="text-sm leading-6 font-bold">{anonymous ? t("anonymous") : t(`samples.${item.id}.name`)}</h2>
                      <p className="flex flex-wrap items-center gap-x-1.5 text-xs leading-5 text-muted-foreground">
                        <span>{t(item.id === "first" || item.id === "second" ? "today" : "yesterday")}</span>
                        <span aria-hidden="true">·</span><span>{time.format(new Date(Date.UTC(2026, 10, 11, item.hour, item.minute)))}</span>
                        <span aria-hidden="true">·</span><span>{t(anonymous ? "anonymousLabel" : "public")}</span>
                      </p>
                    </div>
                  </header>
                  <div className="space-y-4 text-base leading-8">
                    {item.id === "fourth" ? <blockquote className="mb-5 rounded-xl bg-muted px-4 py-4"><p className="mb-1 text-xs font-semibold text-muted-foreground">{t("quoteLabel")}</p><p>“{t("samples.fourth.quote")}”</p></blockquote> : null}
                    <p className="whitespace-pre-wrap">{t(`samples.${item.id}.body`)}</p>
                    {item.id === "second" ? <ol className="list-decimal space-y-3 pl-6 marker:font-semibold marker:text-primary">{(["one", "two", "three"] as const).map((key) => <li className="pl-1" key={key}>{t(`samples.second.${key}`)}</li>)}</ol> : null}
                    {photo ? <figure className="mt-5"><Image alt={t("photoAlt")} className="max-h-80 w-full rounded-xl object-cover" height={480} sizes="(min-width: 1024px) 640px, 90vw" src="/stitch/feed/succulent.jpg" width={640} /><figcaption className="mt-2 text-xs leading-5 text-muted-foreground">{t("samples.third.space")}</figcaption></figure> : null}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md bg-muted px-2.5 py-1.5">{t(`samples.${item.id}.mood`)}</span>
                    {item.id === "first" ? <span>{t("samples.first.space")}</span> : null}
                  </div>
                  <footer className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-1.5">
                    <button aria-label={t(isLiked ? "unlike" : "like")} aria-pressed={isLiked} className={`${control} -ml-2 ${isLiked ? "text-primary" : "text-muted-foreground"} hover:bg-muted`} onClick={() => toggle(setLiked, item.id)} type="button"><Heart aria-hidden="true" className={isLiked ? "fill-primary" : ""} size={18} /><span className="tabular-nums">{number.format(item.likes + Number(isLiked))}</span></button>
                    <button aria-label={t(isSaved ? "unsave" : "save")} aria-pressed={isSaved} className={`${control} -mr-2 ${isSaved ? "text-primary" : "text-muted-foreground"} hover:bg-muted`} onClick={() => toggle(setSaved, item.id)} type="button"><Bookmark aria-hidden="true" className={isSaved ? "fill-accent" : ""} size={18} /></button>
                  </footer>
                </article>
              );
            })}
            {!visible.length ? <div className="rounded-2xl border border-dashed border-border px-5 py-12 text-center"><Bookmark aria-hidden="true" className="mx-auto mb-3 text-primary" size={24} /><h2 className="font-semibold">{t("emptyTitle")}</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-muted-foreground">{t("emptyBody")}</p><button className={`${control} mt-4 text-primary hover:bg-muted`} onClick={() => { setView("community"); setFilter("all"); }} type="button">{t("reset")}</button></div> : <p className="px-4 pt-4 text-center text-xs leading-6 text-muted-foreground">{t("end")}</p>}
          </section>
        </div>

        <aside className="hidden min-w-0 lg:block">
          <div className="sticky top-28 pt-2">
            <Image alt="" className="mb-6 rounded-2xl" height={104} src="/stitch/feed/mascot-rest.jpg" width={104} />
            <h2 className="text-xl leading-8 font-bold">{t("asideTitle")}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{t("asideBody")}</p>
            <Link className={`${control} mt-5 -ml-3 justify-start text-primary hover:bg-accent/50`} href="/write">{t("asideLink")}<ArrowUpRight aria-hidden="true" className="shrink-0" size={16} /></Link>
            <div className="mt-8 flex items-start gap-2 border-t border-border pt-5 text-xs leading-6 text-muted-foreground"><ShieldCheck aria-hidden="true" className="mt-1 shrink-0" size={16} /><p>{t("notice")}</p></div>
          </div>
        </aside>
      </div>
    </main>
  );
}
