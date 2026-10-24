"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import type { WeeklyRhythmDay } from "@/lib/profile/weekly-rhythm";
import { useSyncExternalStore } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { AppLocale } from "@/i18n/routing";
import { getCompanionTimeCopy } from "./companion-time";
import { dailyReflectionQuotes, getDailyReflectionQuote } from "./daily-reflection-quotes";

const subscribeToCompanionTime = () => () => {};
const getClientHour = () => new Date().getHours();
const getServerHour = () => 8;
const getServerDailyReflectionQuote = () => dailyReflectionQuotes[0];

const shellCopy = {
  vi: {
    mascotAlt: "Bé Mầm",
    mascotRestAlt: "Bé Mầm nghỉ ngơi",
    mascotName: "Bé Mầm",
    endTitle: "Bạn đã đọc hết các chia sẻ mới",
    endDescription: "Hãy hít thở một hơi thật sâu và mang theo sự an yên này vào ngày của bạn nhé.",
    quote: "Trích dẫn",
    quoteEyebrow: "Gieo Vào Tâm Thức",
    everyMorning: "Mỗi sớm mai",
    safeNetwork: "Cam kết mạng xã hội an lành",
    safeNetworkCopy: "Không thuật toán câu tương tác. Không hiển thị người theo dõi. Không gian riêng tư được bảo vệ.",
    footerTagline: "Nuôi dưỡng tâm hồn an yên mỗi ngày",
    footerGarden: "Vườn hoa 365",
    footerBadges: "Huy hiệu",
    footerCommunity: "Cộng đồng",
    copyright: "© 2026 Grateful Forum. Lan tỏa lòng biết ơn mỗi ngày.",
  },
  en: {
    mascotAlt: "Be Mam",
    mascotRestAlt: "Be Mam resting",
    mascotName: "Be Mam",
    endTitle: "You have read all new shares",
    endDescription: "Take one deep breath and carry this calm into your day.",
    quote: "Quote",
    quoteEyebrow: "Planting Inward",
    everyMorning: "Every morning",
    safeNetwork: "Gentle social promise",
    safeNetworkCopy: "No engagement traps. No follower counts. Protected private spaces.",
    footerTagline: "Nurturing a peaceful heart every day",
    footerGarden: "365 garden",
    footerBadges: "Badges",
    footerCommunity: "Community",
    copyright: "© 2026 Grateful Forum. Spreading gratitude every day.",
  },
} as const;

function useAppLocale() {
  return useLocale() as AppLocale;
}

function useCompanionTimeCopy() {
  const locale = useAppLocale();
  const hour = useSyncExternalStore(
    subscribeToCompanionTime,
    getClientHour,
    getServerHour,
  );

  return getCompanionTimeCopy(hour, locale);
}

function useDailyReflectionQuote() {
  const locale = useAppLocale();
  return useSyncExternalStore(
    subscribeToCompanionTime,
    () => getDailyReflectionQuote(new Date(), locale),
    getServerDailyReflectionQuote,
  );
}

export function MobileReflectionBanner() {
  const locale = useAppLocale();
  const baseCopy = shellCopy[locale];
  const copy = useCompanionTimeCopy();

  return (
    <section className="overflow-hidden rounded-[22px] border border-border bg-card p-3 shadow-card">
      <div className="flex items-center gap-2.5">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
          <Image
            alt={baseCopy.mascotAlt}
            className="h-full w-full object-cover"
            height={44}
            src="/stitch/landing/mascot.png"
            width={44}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase leading-3 tracking-wider text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <p>{baseCopy.mascotName} · {copy.label}</p>
          </div>
          <p className="mt-0.5 truncate text-sm font-bold leading-5 text-foreground">{copy.greeting}</p>
          <p className="truncate text-xs font-medium leading-4 text-muted-foreground">{copy.nudge}</p>
        </div>
      </div>
    </section>
  );
}

export function MobileFeedEnd({ status }: Readonly<{ status: string }>) {
  const copy = shellCopy[useAppLocale()];

  return (
    <section className="flex flex-col items-center justify-center gap-2 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/30">
        <Image
          alt={copy.mascotRestAlt}
          className="h-10 w-10 object-contain"
          height={40}
          src="/stitch/feed/mascot-rest.jpg"
          width={40}
        />
      </div>
      <p className="text-sm font-bold leading-5 text-foreground">
        {status || copy.endTitle}
      </p>
      <p className="max-w-60 text-[11px] font-medium leading-[14px] text-muted-foreground">
        {copy.endDescription}
      </p>
    </section>
  );
}

export function DesktopAside({ weeklyRhythm }: Readonly<{ weeklyRhythm: WeeklyRhythmDay[] }>) {
  const t = useTranslations("feed");
  const format = useFormatter();
  const activeDays = weeklyRhythm.filter((day) => day.active).length;
  const elapsedDays = weeklyRhythm.findIndex((day) => day.isToday) + 1;
  const rate = elapsedDays ? activeDays / elapsedDays : 0;
  const locale = useAppLocale();
  const baseCopy = shellCopy[locale];
  const copy = useCompanionTimeCopy();
  const dailyQuote = useDailyReflectionQuote();

  return (
    <aside className="flex flex-col gap-6 md:col-span-5 lg:col-span-4">
      <section className="overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-start gap-3">
          <Image
            alt={baseCopy.mascotAlt}
            className="h-16 w-16 shrink-0 rounded-2xl border border-border object-cover"
            height={64}
            src="/stitch/landing/mascot.png"
            width={64}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-bold uppercase leading-4 tracking-wider text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {baseCopy.mascotName}
              </span>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-primary">
                {copy.label}
              </span>
            </div>
            <p className="mt-1 text-base font-bold leading-6 text-foreground">{copy.greeting}</p>
            <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{copy.nudge}</p>
          </div>
        </div>
      </section>
      <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span>🌱</span>
            {t("rhythm.title")}
          </h3>
          <Link className="text-xs font-bold text-primary hover:underline" href="/calendar">
            {t("rhythm.garden")}
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t("rhythm.habit")}</p>
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
          {weeklyRhythm.map((day) => (
            <div className="flex flex-col items-center gap-1.5" key={day.date}>
              <span className={`text-[10px] font-semibold ${day.isToday ? "text-primary" : "text-muted-foreground"}`}>
                {format.dateTime(new Date(`${day.date}T12:00:00Z`), { weekday: "short", timeZone: "UTC" })}
              </span>
              <span
                aria-label={t("rhythm.day", { date: format.dateTime(new Date(`${day.date}T12:00:00Z`), { dateStyle: "medium", timeZone: "UTC" }), count: day.count })}
                aria-current={day.isToday ? "date" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                  day.active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : day.isToday
                      ? "bg-accent text-primary ring-2 ring-ring ring-offset-2"
                      : "bg-muted text-muted-foreground/60"
                }`}
              >
                {day.active ? "🌸" : day.isToday ? "✎" : "·"}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>
            {t("rhythm.watered")} <strong className="text-primary">{t("rhythm.days", { count: activeDays })}</strong>
          </span>
          <span className="font-semibold text-primary">{t("rhythm.rate", { rate: format.number(rate, { style: "percent", maximumFractionDigits: 0 }) })}</span>
        </div>
      </section>
      <section className="relative rounded-3xl border border-border bg-card p-6 shadow-card">
        <span className="absolute -top-2.5 right-6 flex h-5 w-20 items-center justify-center bg-accent text-[9px] font-bold text-accent-foreground [clip-path:polygon(3%_0%,97%_0%,100%_50%,97%_100%,3%_100%,0%_50%)]">
          {baseCopy.quote}
        </span>
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          <span>🌿</span>
          {baseCopy.quoteEyebrow}
        </p>
        <blockquote className="mt-3 font-serif text-[15px] italic leading-relaxed text-foreground">
          “{dailyQuote.text}”
        </blockquote>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
          <span className="font-medium">{dailyQuote.source}</span>
          <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-primary">
            {baseCopy.everyMorning}
          </span>
        </div>
      </section>
      <section className="space-y-2 rounded-2xl border border-border bg-card/80 p-4 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5 font-bold text-foreground">
          <MaterialSymbol className="text-sm text-primary" name="verified_user" />
          {baseCopy.safeNetwork}
        </p>
        <p className="leading-relaxed">
          {baseCopy.safeNetworkCopy}
        </p>
      </section>
    </aside>
  );
}

export function DesktopFooter() {
  const copy = shellCopy[useAppLocale()];

  return (
    <footer className="mt-auto hidden w-full border-t border-border bg-card/70 py-6 backdrop-blur-sm md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">BeGrateful</span>
          <span>•</span>
          <span>{copy.footerTagline}</span>
        </div>
        <div className="flex items-center gap-6">
          <Link className="hover:text-primary" href="/calendar">{copy.footerGarden}</Link>
          <Link className="hover:text-primary" href="/profile?tab=moments">{copy.footerBadges}</Link>
          <Link className="hover:text-primary" href="/feed">{copy.footerCommunity}</Link>
        </div>
        <p className="text-muted-foreground">
          {copy.copyright}
        </p>
      </div>
    </footer>
  );
}
