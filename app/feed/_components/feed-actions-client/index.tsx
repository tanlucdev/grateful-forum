"use client";

import { useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { deleteFeedBookmark, deleteFeedReaction, saveFeedBookmark, saveFeedReaction } from "@/lib/api/feed";
import { reportEntry } from "@/lib/api/reports";
import { applyViewerReaction, toggleBookmark } from "@/lib/feed/engagement-state";
import type { FeedReactionType } from "@/lib/feed/validation";
import type { DisplayItem } from "../feed-data";

const reactionOptions: { type: FeedReactionType; publicLabel: string; anonymousLabel: string; icon: string }[] = [
  { type: "empathy", publicLabel: "Đồng cảm", anonymousLabel: "Ôm lấy bạn", icon: "volunteer_activism" },
  { type: "healing_energy", publicLabel: "Gửi năng lượng lành", anonymousLabel: "Cùng cố gắng nhé", icon: "auto_awesome" },
  { type: "refreshing", publicLabel: "Tưới mát", anonymousLabel: "Tưới mát", icon: "psychiatry" },
];

export function MindfulActionsClient({ compact = false, floatingMenu = false, item }: Readonly<{ compact?: boolean; floatingMenu?: boolean; item: DisplayItem }>) {
  const [reactions, setReactions] = useState(item.reactions);
  const [viewerReaction, setViewerReaction] = useState(item.viewerReaction);
  const [bookmarked, setBookmarked] = useState(item.viewerBookmarked);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [status, setStatus] = useState("");
  const [statusKind, setStatusKind] = useState<"error" | "success">("error");

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
      setStatusKind("error");
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
      setStatusKind("error");
      setStatus(error instanceof Error ? error.message : "Không thể lưu bài viết.");
    }
  }

  async function submitReport() {
    setReporting(true);
    setStatus("");

    try {
      await reportEntry(item.id, reportReason);
      setReportReason("");
      setReportOpen(false);
      setStatusKind("success");
      setStatus("Đã gửi báo cáo.");
    } catch (error) {
      setStatusKind("error");
      setStatus(error instanceof Error ? error.message : "Không thể gửi báo cáo.");
    } finally {
      setReporting(false);
    }
  }

  const actionMenu = (
    <div className={floatingMenu ? "absolute right-5 top-8 z-20 md:right-7 md:top-10" : "relative ml-auto"}>
      <button
        aria-expanded={menuOpen}
        aria-label="Tùy chọn bài viết"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#52645b] shadow-[0_1px_4px_rgba(26,47,43,0.04)] ring-1 ring-[#e3eee8] backdrop-blur transition-colors hover:bg-white hover:text-[#006d43] hover:ring-[#cfe6da] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99f3b6] focus-visible:ring-offset-2"
        onClick={() => setMenuOpen((value) => !value)}
        type="button"
      >
        <MaterialSymbol className="text-[14px]" name="more_vert" />
      </button>
      {menuOpen ? (
        <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_18px_40px_rgba(26,47,43,0.13)] ring-1 ring-[#e3eee8]">
          <ActionMenuButton
            icon={bookmarked ? "bookmark_added" : "bookmark"}
            label={bookmarked ? "Bỏ lưu bài viết" : "Lưu truyền cảm hứng"}
            onClick={() => {
              setMenuOpen(false);
              void bookmark();
            }}
          />
          <ActionMenuButton
            danger
            icon="flag"
            label="Báo cáo bài viết"
            onClick={() => {
              setMenuOpen(false);
              setReportOpen(true);
              setStatus("");
            }}
          />
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      {floatingMenu ? actionMenu : null}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#eaf2ee] pt-4 text-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {reactionOptions.slice(0, compact ? 2 : 3).map((reaction) => (
            <Reaction
              active={viewerReaction === reaction.type}
              count={reactions[reaction.type]}
              icon={reaction.icon}
              key={reaction.type}
              label={item.isAnonymous ? reaction.anonymousLabel : reaction.publicLabel}
              onClick={() => void react(reaction.type)}
            />
          ))}
        </div>
        {floatingMenu ? null : actionMenu}
        {status && !reportOpen ? (
          <p className={`basis-full text-xs font-semibold ${statusKind === "success" ? "text-[#006d43]" : "text-red-600"}`} role="status">
            {status}
          </p>
        ) : null}
      </div>
      {reportOpen ? (
        <ReportDialog
          onClose={() => setReportOpen(false)}
          onSubmit={() => void submitReport()}
          reason={reportReason}
          saving={reporting}
          setReason={setReportReason}
          status={statusKind === "error" ? status : ""}
        />
      ) : null}
    </>
  );
}

function ActionMenuButton({
  danger = false,
  icon,
  label,
  onClick,
}: Readonly<{ danger?: boolean; icon: string; label: string; onClick: () => void }>) {
  return (
    <button
      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors ${
        danger ? "text-[#852229] hover:bg-[#fff4f3]" : "text-[#1c3b2c] hover:bg-[#f1f8f4]"
      }`}
      onClick={onClick}
      type="button"
    >
      <MaterialSymbol className="text-[16px]" name={icon} />
      <span>{label}</span>
    </button>
  );
}

function ReportDialog({
  onClose,
  onSubmit,
  reason,
  saving,
  setReason,
  status,
}: Readonly<{
  onClose: () => void;
  onSubmit: () => void;
  reason: string;
  saving: boolean;
  setReason: (value: string) => void;
  status: string;
}>) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#1a2f2b]/35 px-4 py-6 backdrop-blur-sm" role="presentation">
      <section
        aria-labelledby="feed-report-title"
        aria-modal="true"
        className="w-full max-w-md rounded-3xl bg-white p-5 shadow-[0_24px_70px_rgba(26,47,43,0.20)] ring-1 ring-[#dce8e2]"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff4f3] text-[#852229] ring-1 ring-[#f4d0ce]">
              <MaterialSymbol className="text-[18px]" name="flag" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-bold leading-6 text-[#1c3b2c]" id="feed-report-title">
                Báo cáo bài viết
              </h2>
              <p className="mt-0.5 text-sm leading-5 text-[#6b7a74]">Cho tụi mình biết điều gì chưa phù hợp.</p>
            </div>
          </div>
          <button
            aria-label="Đóng báo cáo"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7fbf9] text-[#52645b] ring-1 ring-[#e3eee8] transition-colors hover:bg-white hover:text-[#1c3b2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99f3b6]"
            onClick={onClose}
            type="button"
          >
            <MaterialSymbol className="text-[16px]" name="close" />
          </button>
        </div>
        <label className="mt-5 block text-sm font-bold text-[#1c3b2c]" htmlFor="feed-report-reason">
          Lý do
        </label>
        <textarea
          className="mt-2 min-h-32 w-full resize-none rounded-2xl bg-[#f8faf8] p-3.5 text-sm leading-5 text-[#1c3b2c] outline-none ring-1 ring-[#d5e2dc] transition focus:bg-white focus:ring-2 focus:ring-[#99f3b6]"
          id="feed-report-reason"
          onChange={(event) => setReason(event.target.value)}
          placeholder="Spam, nội dung không an toàn, thông tin riêng tư..."
          value={reason}
        />
        {status ? (
          <p className="mt-2 text-sm font-semibold text-red-600" role="status">
            {status}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          <button
            className="inline-flex min-h-10 items-center rounded-full bg-[#f7fbf9] px-4 text-sm font-bold text-[#1c3b2c] ring-1 ring-[#d5e2dc] transition-colors hover:bg-white"
            onClick={onClose}
            type="button"
          >
            Hủy
          </button>
          <button
            className="inline-flex min-h-10 items-center rounded-full bg-[#006d43] px-4 text-sm font-bold text-white shadow-[0_8px_18px_rgba(0,109,67,0.16)] transition-colors hover:bg-[#145C34] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={saving || reason.trim().length < 3}
            onClick={onSubmit}
            type="button"
          >
            {saving ? "Đang gửi..." : "Gửi báo cáo"}
          </button>
        </div>
      </section>
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
      className={`flex max-w-full items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium shadow-[0_1px_2px_rgba(26,47,43,0.04)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#99f3b6] focus-visible:ring-offset-2 ${
        active
          ? "bg-[#dcfce7] text-[#0e5f3c] ring-1 ring-[#86efac]"
          : "bg-white text-[#4a5752] ring-1 ring-[#e5eee9] hover:bg-[#f0fdf4] hover:text-[#0e5f3c] hover:ring-[#bbf7d0]"
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
