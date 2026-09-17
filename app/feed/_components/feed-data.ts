import type { FeedItem } from "@/lib/feed/types";
import type { EntryMetadata } from "@/lib/entries/types";
import type { FeedReactionCounts } from "@/lib/feed/engagement-state";
import type { FeedReactionType } from "@/lib/feed/validation";

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

export function toDisplayItem(item: FeedItem, index: number): DisplayItem {
  const author = item.visibility !== "anonymous" ? item.author : null;
  const tone = (["primary", "tertiary", "mint"] as const)[index % 3];

  return {
    id: item.id,
    authorName: author ? author.displayName ?? "Grateful Forum" : "Ẩn danh",
    avatarUrl: author?.avatarUrl,
    category: item.visibility === "anonymous" ? "Ẩn danh" : "Công khai",
    content: item.content,
    detail: item.visibility === "anonymous" ? "Chia sẻ ẩn danh" : "Chia sẻ công khai",
    initial: author?.displayName?.trim().charAt(0).toUpperCase(),
    isAnonymous: !author,
    metadata: item.metadata,
    profileHref: author ? `/profile/${author.id}` : undefined,
    reactions: item.reactions,
    time: formatRelative(item.createdAt),
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

export function formatRelative(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  const hours = Math.round(diff / 3600000);
  const days = Math.round(diff / 86400000);

  if (minutes < 60) {
    return `${Math.max(1, minutes)} phút trước`;
  }

  if (hours < 24) {
    return `${hours} giờ trước`;
  }

  if (days === 1) {
    return "Hôm qua";
  }

  if (days < 7) {
    return `${days} ngày trước`;
  }

  return new Intl.DateTimeFormat("vi", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}
