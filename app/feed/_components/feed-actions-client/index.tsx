"use client";

import { useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { deleteFeedBookmark, deleteFeedReaction, saveFeedBookmark, saveFeedReaction } from "@/lib/api/feed";
import { applyViewerReaction, toggleBookmark } from "@/lib/feed/engagement-state";
import type { FeedReactionType } from "@/lib/feed/validation";
import type { DisplayItem } from "../feed-data";

const reactionOptions: { type: FeedReactionType; publicLabel: string; anonymousLabel: string; icon: string }[] = [
  { type: "empathy", publicLabel: "Đồng cảm", anonymousLabel: "Ôm lấy bạn", icon: "volunteer_activism" },
  { type: "healing_energy", publicLabel: "Gửi năng lượng lành", anonymousLabel: "Cùng cố gắng nhé", icon: "auto_awesome" },
  { type: "refreshing", publicLabel: "Tưới mát", anonymousLabel: "Tưới mát", icon: "psychiatry" },
];

export function MindfulActionsClient({ compact = false, item }: Readonly<{ compact?: boolean; item: DisplayItem }>) {
  const [reactions, setReactions] = useState(item.reactions);
  const [viewerReaction, setViewerReaction] = useState(item.viewerReaction);
  const [bookmarked, setBookmarked] = useState(item.viewerBookmarked);
  const [status, setStatus] = useState("");

  async function react(type: FeedReactionType) {
    const previous = { reactions, viewerReaction };
    const nextReaction = viewerReaction === type ? null : type;
    const optimistic = applyViewerReaction(reactions, viewerReaction, nextReaction);
    setReactions(optimistic.reactions);
    setViewerReaction(optimistic.viewerReaction);
    setStatus("");

    try {
      const state = nextReaction ? await saveFeedReaction(item.id, nextReaction) : await deleteFeedReaction(item.id);
      setReactions(state.reactions);
      setViewerReaction(state.viewerReaction);
    } catch (error) {
      setReactions(previous.reactions);
      setViewerReaction(previous.viewerReaction);
      setStatus(error instanceof Error ? error.message : "Không thể lưu phản ứng.");
    }
  }

  async function bookmark() {
    const previous = bookmarked;
    const next = toggleBookmark(bookmarked);
    setBookmarked(next);
    setStatus("");

    try {
      const state = next ? await saveFeedBookmark(item.id) : await deleteFeedBookmark(item.id);
      setBookmarked(state.bookmarked);
    } catch (error) {
      setBookmarked(previous);
      setStatus(error instanceof Error ? error.message : "Không thể lưu bài viết.");
    }
  }

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0f4f2] pt-4 text-xs">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {reactionOptions.slice(0, compact ? 2 : 3).map((reaction) => (
          <Reaction
            active={viewerReaction === reaction.type}
            count={reactions[reaction.type]}
            icon={item.isAnonymous && reaction.type === "healing_energy" ? "psychiatry" : reaction.icon}
            key={reaction.type}
            label={item.isAnonymous ? reaction.anonymousLabel : reaction.publicLabel}
            onClick={() => void react(reaction.type)}
          />
        ))}
      </div>
      <button
        aria-pressed={bookmarked}
        className={`flex items-center gap-1 text-xs font-semibold ${bookmarked ? "text-[#00a86b]" : "text-[#6b7a74] hover:text-[#00a86b]"}`}
        onClick={() => void bookmark()}
        type="button"
      >
        <MaterialSymbol className="text-base" name={bookmarked ? "bookmark_added" : "bookmark"} />
        <span className="hidden sm:inline">{bookmarked ? "Đã lưu" : "Lưu truyền cảm hứng"}</span>
      </button>
      {status ? (
        <p className="basis-full text-xs font-semibold text-red-600" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}

function Reaction({
  active,
  count,
  icon,
  label,
  onClick,
}: Readonly<{
  active: boolean;
  count: number;
  icon: string;
  label: string;
  onClick: () => void;
}>) {
  return (
    <button
      aria-pressed={active}
      className={`flex max-w-full items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-medium shadow-[0_1px_2px_rgba(26,47,43,0.04)] ${
        active
          ? "border-[#86efac] bg-[#dcfce7] text-[#0e5f3c]"
          : "border-[#e5eee9] bg-white text-[#4a5752] hover:border-[#bbf7d0] hover:bg-[#f0fdf4] hover:text-[#0e5f3c]"
      }`}
      onClick={onClick}
      type="button"
    >
      <MaterialSymbol className="text-base" name={icon} />
      <span className="truncate">{label}</span>
      <span className="rounded-full bg-emerald-50 px-1.5 text-[11px] font-bold text-emerald-800">{count}</span>
    </button>
  );
}
