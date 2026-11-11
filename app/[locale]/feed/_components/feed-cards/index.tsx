"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
/* eslint-disable @next/next/no-img-element */
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { getStickerLabel } from "@/lib/entries/stickers";
import type { DisplayItem } from "../feed-data";
import { toneClasses } from "../feed-data";
import { MindfulActionsClient } from "../feed-actions-client";
import { FeedEntryPreviewClient } from "../feed-entry-preview-client";

const feedCardCopy = {
  vi: {
    anonymous: "Chia sẻ ẩn danh",
    member: "Thành viên gieo hạt",
    seedQuietly: "🌸 Lặng lẽ gieo hạt",
    smallMoment: "🌾 Khoảnh khắc nhỏ",
    gratefulToday: "☀️ Biết ơn hôm nay",
    emptyTitle: "Chưa có chia sẻ công khai",
    emptyDescription: "Các bài viết public hoặc anonymous sẽ xuất hiện tại đây.",
    fallbackTertiary: "Chồi non sau mưa",
    fallbackDefault: "Góc nhỏ bình yên",
  },
  en: {
    anonymous: "Anonymous share",
    member: "Community member",
    seedQuietly: "🌸 Quietly planted",
    smallMoment: "🌾 Small moment",
    gratefulToday: "☀️ Grateful today",
    emptyTitle: "No public shares yet",
    emptyDescription: "Public or anonymous posts will appear here.",
    fallbackTertiary: "Fresh sprout after rain",
    fallbackDefault: "A peaceful corner",
  },
} as const;

export function MobileFeedCard({ item, locale, priorityImage = false, readOnly = false }: Readonly<{ item: DisplayItem; locale: AppLocale; priorityImage?: boolean; readOnly?: boolean }>) {
  return (
    <article className="relative w-full min-w-0 [overflow-wrap:anywhere] rounded-3xl border border-border bg-card p-4 pb-2 shadow-card">
      <Tape locale={locale} tone={item.tone} />
      <div className="mt-2 flex items-start justify-between gap-3 pr-8">
        <div className="flex w-full min-w-0 items-center gap-3">
          <Avatar item={item} />
          <div className="min-w-0 flex-1">
            <Author item={item} mobile />
            <p className="truncate text-[11px] font-medium leading-[14px] text-muted-foreground">
              {item.time} • {item.detail}
            </p>
          </div>
        </div>
      </div>
      <EntryBody item={item} locale={locale} mobile priorityImage={priorityImage} />
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Tags item={item} locale={locale} />
        {readOnly ? <FeedReactionSummary item={item} /> : <MindfulActionsClient item={item} compact floatingMenu />}
      </div>
    </article>
  );
}

export function DesktopFeedCard({ item, locale, priorityImage = false, readOnly = false }: Readonly<{ item: DisplayItem; locale: AppLocale; priorityImage?: boolean; readOnly?: boolean }>) {
  const tone = toneClasses(item.tone);
  const copy = feedCardCopy[locale];

  return (
    <article className="relative w-full min-w-0 [overflow-wrap:anywhere] rounded-3xl border border-border bg-card p-7 pb-3 shadow-card transition-shadow hover:shadow-md">
      <Tape locale={locale} tone={item.tone} />
      <div className="mt-2 flex flex-col items-start justify-between gap-3 pr-9 xl:flex-row xl:gap-4">
        <div className="flex w-full min-w-0 items-center gap-3">
          <Avatar item={item} />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Author item={item} />
              <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tone.badge}`}>
                {item.isAnonymous ? copy.anonymous : copy.member}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {item.time} • {item.detail}
            </p>
          </div>
        </div>
      </div>
      <EntryBody item={item} locale={locale} priorityImage={priorityImage} />
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Tags item={item} locale={locale} />
        {readOnly ? <FeedReactionSummary item={item} /> : <MindfulActionsClient item={item} floatingMenu />}
      </div>
    </article>
  );
}

function EntryBody({ item, locale, mobile = false, priorityImage = false }: Readonly<{ item: DisplayItem; locale: AppLocale; mobile?: boolean; priorityImage?: boolean }>) {
  if (item.entryKind === "handwritten" && item.handwritingPreviewUrl) {
    return <Link aria-label={item.detail} className="mt-4 block overflow-hidden rounded-2xl border border-border bg-[#fffdf8] p-2 shadow-sm" href={`/entries/${item.id}`}><img alt="" className="aspect-[4/3] w-full rounded-xl object-cover" src={item.handwritingPreviewUrl} /></Link>;
  }
  const hasMetadata = item.metadata.gratitudes.length || item.metadata.reflection || item.metadata.quote || item.metadata.imageUrl;

  if (!hasMetadata) {
    const content = <p className="whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-foreground">{item.content}</p>;
    return mobile ? <FeedEntryPreviewClient key={item.id}>{content}</FeedEntryPreviewClient> : <div className="mt-4">{content}</div>;
  }

  const content = (
    <div className={`${mobile ? "gap-2" : "gap-4"} flex flex-col`}>
      {item.metadata.quote ? (
        <p className={`${mobile ? "text-sm" : "text-[15px]"} whitespace-pre-wrap border-l-2 border-accent pl-4 italic leading-relaxed text-foreground`}>
          “{item.metadata.quote}”
        </p>
      ) : null}
      {item.metadata.gratitudes.length ? (
        <ul className={mobile ? "space-y-2" : "space-y-2.5"}>
          {item.metadata.gratitudes.map((text, index) => (
            <li className={mobile ? "flex min-w-0 items-start gap-2" : "flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-muted/50 p-3.5"} key={`${index}-${text}`}>
              <span className={mobile ? "w-5 shrink-0 text-sm font-semibold leading-relaxed text-primary" : "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground"}>
                {index + 1}{mobile ? "." : null}
              </span>
              <p className="min-w-0 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {text}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
      {item.metadata.reflection ? (
        <p className={`${mobile ? "text-sm" : "text-[15px] font-medium"} whitespace-pre-wrap leading-relaxed text-foreground`}>
          {item.metadata.reflection}
        </p>
      ) : null}
    </div>
  );

  return (
    <>
      {mobile ? <FeedEntryPreviewClient key={item.id}>{content}</FeedEntryPreviewClient> : <div className="mt-4">{content}</div>}
      {item.metadata.imageUrl || !item.metadata.gratitudes.length ? <div className="mt-3"><Polaroid item={item} locale={locale} mobile={mobile} priorityImage={priorityImage} /></div> : null}
    </>
  );
}

function Polaroid({ item, locale, mobile, priorityImage }: Readonly<{ item: DisplayItem; locale: AppLocale; mobile: boolean; priorityImage: boolean }>) {
  const imageUrl = item.metadata.imageUrl;
  const fallback = item.tone === "tertiary" ? "/stitch/feed/succulent.jpg" : "/stitch/feed/breakfast.jpg";
  const copy = feedCardCopy[locale];
  const caption = item.metadata.space || (item.tone === "tertiary" ? copy.fallbackTertiary : copy.fallbackDefault);

  return (
    <div className="flex justify-center sm:justify-start">
      <div className={`${mobile ? "max-w-[260px]" : "max-w-sm"} w-full rounded-xl border border-border bg-card p-[10px] pb-6 shadow-card`}>
        <div
          className={`${mobile ? "h-40" : "aspect-[4/3]"} relative overflow-hidden rounded-lg bg-muted bg-cover bg-center`}
          style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
        >
          {imageUrl ? null : (
            <Image alt="" className="object-cover" fill loading={priorityImage ? "eager" : undefined} sizes={mobile ? "260px" : "384px"} src={fallback} />
          )}
          <span className="absolute bottom-2 left-2 rounded bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            📷 {caption}
          </span>
        </div>
        <p className="pt-2 text-center font-serif text-sm italic text-muted-foreground">“{caption}”</p>
      </div>
    </div>
  );
}

export function Avatar({ item }: Readonly<{ item: DisplayItem }>) {
  if (item.avatarUrl) {
    const avatar = (
      <span
        aria-hidden="true"
        className="block h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${item.avatarUrl})` }}
      />
    );

    return item.profileHref ? (
      <Link aria-label={item.authorName} className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border bg-accent" href={item.profileHref}>
        {avatar}
      </Link>
    ) : (
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-accent">{avatar}</div>
    );
  }

  return item.initial ? (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-accent text-sm font-bold text-accent-foreground">
      {item.initial}
    </div>
  ) : (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-lg text-primary">
      🍃
    </div>
  );
}

export function Author({ item, mobile = false }: Readonly<{ item: DisplayItem; mobile?: boolean }>) {
  const className = `${mobile ? "text-[13px] leading-[18px]" : "text-sm leading-5"} truncate font-bold text-foreground ${
    item.isAnonymous ? "italic" : ""
  }`;

  if (item.profileHref) {
    return (
      <Link className={`${className} relative block max-w-full min-w-11 after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2`} href={item.profileHref}>
        {item.authorName}
      </Link>
    );
  }

  return <p className={className}>{item.authorName}</p>;
}

export function FeedSentinel({
  refEl,
  status,
}: Readonly<{
  refEl: React.RefObject<HTMLDivElement | null>;
  status: string;
}>) {
  return (
    <>
      <div className="h-6" ref={refEl} />
      <p className="pb-4 text-center text-sm font-medium text-muted-foreground" role="status">
        {status}
      </p>
    </>
  );
}

export function FeedEmptyState({ locale }: Readonly<{ locale: AppLocale }>) {
  const copy = feedCardCopy[locale];

  return (
    <section className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card px-5 py-10 text-center shadow-card">
      <MaterialSymbol className="text-2xl text-primary" name="auto_stories" />
      <div className="space-y-1">
        <p className="text-sm font-bold leading-5 text-foreground">{copy.emptyTitle}</p>
        <p className="text-xs leading-4 text-muted-foreground">{copy.emptyDescription}</p>
      </div>
    </section>
  );
}

function Tape({ locale, tone }: Readonly<{ locale: AppLocale; tone: DisplayItem["tone"] }>) {
  const toneClass = toneClasses(tone).tape;
  const copy = feedCardCopy[locale];
  const label = tone === "tertiary" ? copy.seedQuietly : tone === "mint" ? copy.smallMoment : copy.gratefulToday;

  return (
    <div className={`absolute -top-2.5 left-8 flex h-6 w-32 items-center justify-center text-[11px] font-bold tracking-wider [clip-path:polygon(3%_0%,97%_0%,100%_50%,97%_100%,3%_100%,0%_50%)] ${toneClass}`}>
      {label}
    </div>
  );
}

function Tags({ item, locale }: Readonly<{ item: DisplayItem; locale: AppLocale }>) {
  const tags = [item.metadata.mood, getStickerLabel(item.metadata.sticker, locale), item.metadata.space].filter(Boolean);

  if (!tags.length) {
    return null;
  }

  return (
    <div className="flex min-w-0 basis-40 grow flex-wrap gap-2">
      {tags.map((label) => (
        <span className="max-w-full truncate rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground" key={label}>
          #{String(label).replace(/\s+/g, "_").toLowerCase()}
        </span>
      ))}
    </div>
  );
}

function FeedReactionSummary({ item }: Readonly<{ item: DisplayItem }>) {
  const t = useTranslations("feed");
  const locale = useLocale();
  const total = Object.values(item.reactions).reduce((sum, count) => sum + count, 0);
  if (!total) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground" title={t("favorite.like")}>
      <MaterialSymbol className="text-base" name="favorite" strokeWidth={1.8} />
      <span className="sr-only">{t("favorite.like")}: </span>
      <span className="tabular-nums">{new Intl.NumberFormat(locale).format(total)}</span>
    </p>
  );
}
