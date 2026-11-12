"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/navigation/locale-switcher";
import { loginHref } from "@/lib/auth/redirects";
import { toFeedPreview } from "@/lib/feed/access";
import type { FeedPage } from "@/lib/feed/types";
import type { AppLocale } from "@/i18n/routing";
import { DesktopFeedCard, FeedEmptyState, MobileFeedCard } from "../../../_components/feed-cards";
import { toDisplayItem } from "../../../_components/feed-data";

export function FeedPreviewClient({ initialPage }: Readonly<{ initialPage: FeedPage }>) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("feed");
  const common = useTranslations("common");
  const items = toFeedPreview(initialPage.items).items.map((item, index) => toDisplayItem(item, index, locale, {
    anonymous: t("anonymous"), anonymousShare: t("anonymousShare"), public: t("public"), publicShare: t("publicShare"),
    relative: { minute: (count) => t("relative.minute", { count }), hour: (count) => t("relative.hour", { count }), yesterday: t("relative.yesterday"), day: (count) => t("relative.day", { count }) },
  }));
  const action = "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
  return <div className="journal-write-theme app-garden-bg min-h-svh text-foreground">
    <header className="border-b border-border bg-card px-4 py-3 sm:px-6">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
        <Link className={`${action} hidden text-primary lg:inline-flex`} href="/"><Image alt="" className="mr-2 rounded-xl" height={32} src="/stitch/landing/mascot.png" width={32} />{t("preview.brand")}</Link>
        <LocaleSwitcher className="hidden lg:grid sm:ml-auto [&_a]:min-h-11 [&_a]:min-w-11" />
        <div className="col-span-2 flex flex-wrap items-center gap-2">
          <Link className={`${action} text-primary`} href={loginHref("/feed", locale)}>{common("navigation.signIn")}</Link>
          <Link className={`${action} bg-primary text-primary-foreground`} href={loginHref("/write", locale)}>{t("preview.write")}</Link>
        </div>
      </div>
    </header>
    <main className="mx-auto max-w-3xl space-y-7 px-4 py-6 sm:px-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">{t("preview.label")}</h1>
        <p className="text-muted-foreground">{t("preview.description")}</p>
      </section>
      {items.length ? <><div className="space-y-6 md:hidden">{items.map((item, index) => <MobileFeedCard item={item} key={item.id} locale={locale} priorityImage={index === 0} readOnly />)}</div><div className="hidden space-y-6 md:block">{items.map((item, index) => <DesktopFeedCard item={item} key={item.id} locale={locale} priorityImage={index === 0} readOnly />)}</div></> : <FeedEmptyState locale={locale} />}
      <section className="space-y-3 border-t border-border py-6 text-center">
        <h2 className="text-lg font-bold">{t("preview.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("preview.invitation")}</p>
        <Link className={`${action} bg-primary text-primary-foreground`} href={loginHref("/feed", locale)}>{t("preview.login")}</Link>
      </section>
    </main>
  </div>;
}
