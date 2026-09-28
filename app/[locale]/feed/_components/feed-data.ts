import type { FeedItem } from "@/lib/feed/types";
import type { EntryMetadata } from "@/lib/entries/types";
import type { FeedReactionCounts } from "@/lib/feed/engagement-state";
import type { FeedReactionType } from "@/lib/feed/validation";
import type { AppLocale } from "@/i18n/routing";

export type FeedCopy = {
  anonymous: string;
  anonymousShare: string;
  public: string;
  publicShare: string;
  relative: { minute: (count: number) => string; hour: (count: number) => string; yesterday: string; day: (count: number) => string };
};

export type DisplayItem = {
  id: string;
  authorName: string;
  avatarUrl?: string | null;
  category: string;
  content: string;
  detail: string;
  metadata: EntryMetadata;
  initial?: string;
  isAnonymous: boolean;
  profileHref?: string;
  reactions: FeedReactionCounts;
  time: string;
  tone: "primary" | "tertiary" | "mint";
  viewerBookmarked: boolean;
  viewerReaction: FeedReactionType | null;
};

export function toDisplayItem(item: FeedItem, index: number, locale: AppLocale, copy: FeedCopy): DisplayItem {
  const author = item.visibility !== "anonymous" ? item.author : null;
  const tone = (["primary", "tertiary", "mint"] as const)[index % 3];
  const anonymous = copy.anonymous;

  return {
    id: item.id,
    authorName: author ? author.displayName ?? "Grateful Forum" : anonymous,
    avatarUrl: author?.avatarUrl,
    category: item.visibility === "anonymous" ? anonymous : copy.public,
    content: item.content,
    detail: item.visibility === "anonymous" ? copy.anonymousShare : copy.publicShare,
    initial: author?.displayName?.trim().charAt(0).toUpperCase(),
    isAnonymous: !author,
    metadata: item.metadata,
    profileHref: author ? `/profile/${author.id}` : undefined,
    reactions: item.reactions,
    time: formatRelative(item.createdAt, locale, copy),
    tone,
    viewerBookmarked: item.viewerBookmarked,
    viewerReaction: item.viewerReaction,
  };
}

export function toneClasses(tone: DisplayItem["tone"]) {
  if (tone === "tertiary") {
    return {
      badge: "border-[var(--fire-soft)] bg-[var(--fire-soft)]/40 text-[var(--fire)]",
      moodIcon: "🌙",
      tape: "bg-[var(--fire-soft)] text-[var(--fire)]",
    };
  }

  if (tone === "mint") {
    return {
      badge: "border-accent bg-accent/70 text-accent-foreground",
      moodIcon: "🍵",
      tape: "bg-accent text-accent-foreground",
    };
  }

  return {
    badge: "border-secondary-container bg-secondary-container/50 text-primary",
    moodIcon: "🌟",
    tape: "bg-secondary-container text-primary",
  };
}

export function formatRelative(value: string, locale: AppLocale, copy: FeedCopy) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  const hours = Math.round(diff / 3600000);
  const days = Math.round(diff / 86400000);

  if (minutes < 60) {
    return copy.relative.minute(Math.max(1, minutes));
  }

  if (hours < 24) {
    return copy.relative.hour(hours);
  }

  if (days === 1) {
    return copy.relative.yesterday;
  }

  if (days < 7) {
    return copy.relative.day(days);
  }

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}
