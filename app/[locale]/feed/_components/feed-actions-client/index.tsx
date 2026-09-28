"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Textarea } from "@/components/ui/textarea";
import { deleteFeedBookmark, deleteFeedReaction, saveFeedBookmark, saveFeedReaction } from "@/lib/api/feed";
import { reportEntry } from "@/lib/api/reports";
import { applyViewerReaction, toggleBookmark } from "@/lib/feed/engagement-state";
import type { FeedReactionType } from "@/lib/feed/validation";
import type { AppLocale } from "@/i18n/routing";
import type { DisplayItem } from "../feed-data";

const reactionOptions: { type: FeedReactionType; publicLabel: string; anonymousLabel: string; icon: string }[] = [
  { type: "empathy", publicLabel: "Đồng cảm", anonymousLabel: "Ôm lấy bạn", icon: "volunteer_activism" },
  { type: "healing_energy", publicLabel: "Gửi năng lượng lành", anonymousLabel: "Cùng cố gắng nhé", icon: "auto_awesome" },
  { type: "refreshing", publicLabel: "Tưới mát", anonymousLabel: "Tưới mát", icon: "psychiatry" },
];

const actionCopy = {
  vi: {
    reactionSaveError: "Không thể lưu phản ứng.",
    bookmarkSaveError: "Không thể lưu bài viết.",
    reportSuccess: "Đã gửi báo cáo.",
    reportError: "Không thể gửi báo cáo.",
    options: "Tùy chọn bài viết",
    unbookmark: "Bỏ lưu bài viết",
    bookmark: "Lưu truyền cảm hứng",
    reportPost: "Báo cáo bài viết",
    reportHelp: "Cho tụi mình biết điều gì chưa phù hợp.",
    reason: "Lý do",
    placeholder: "Spam, nội dung không an toàn, thông tin riêng tư...",
    cancel: "Hủy",
    sending: "Đang gửi...",
    submit: "Gửi báo cáo",
    reactions: reactionOptions,
  },
  en: {
    reactionSaveError: "Could not save reaction.",
    bookmarkSaveError: "Could not save post.",
    reportSuccess: "Report sent.",
    reportError: "Could not send report.",
    options: "Post options",
    unbookmark: "Remove saved post",
    bookmark: "Save inspiration",
    reportPost: "Report post",
    reportHelp: "Tell us what does not feel right.",
    reason: "Reason",
    placeholder: "Spam, unsafe content, private information...",
    cancel: "Cancel",
    sending: "Sending...",
    submit: "Send report",
    reactions: [
      { type: "empathy", publicLabel: "Empathy", anonymousLabel: "Holding space", icon: "volunteer_activism" },
      { type: "healing_energy", publicLabel: "Healing energy", anonymousLabel: "Keep going", icon: "auto_awesome" },
      { type: "refreshing", publicLabel: "Refresh", anonymousLabel: "Refresh", icon: "psychiatry" },
    ],
  },
} as const;

export function MindfulActionsClient({ compact = false, floatingMenu = false, item }: Readonly<{ compact?: boolean; floatingMenu?: boolean; item: DisplayItem }>) {
  const locale = useLocale() as AppLocale;
  const copy = actionCopy[locale];
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
      setStatus(error instanceof Error ? error.message : copy.reactionSaveError);
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
      setStatus(error instanceof Error ? error.message : copy.bookmarkSaveError);
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
      setStatus(copy.reportSuccess);
    } catch (error) {
      setStatusKind("error");
      setStatus(error instanceof Error ? error.message : copy.reportError);
    } finally {
      setReporting(false);
    }
  }

  const actionMenu = (
    <div className={floatingMenu ? "absolute right-5 top-8 z-20 md:right-7 md:top-10" : "relative ml-auto"}>
      <DropdownMenu onOpenChange={setMenuOpen} open={menuOpen}>
        <DropdownMenuTrigger asChild>
          <Button aria-label={copy.options} className="rounded-full bg-card/85 shadow-xs backdrop-blur" size="icon-xs" type="button" variant="outline">
            <MaterialSymbol className="text-[12px]" name="more_vert" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36 rounded-lg p-1">
          <DropdownMenuItem asChild>
            <button
              className="flex w-full items-center gap-1 rounded-md px-1.5 py-1 text-left text-[10px] font-bold leading-4"
              onClick={() => {
                setMenuOpen(false);
                void bookmark();
              }}
              type="button"
            >
              <MaterialSymbol className="text-[12px]" name={bookmarked ? "bookmark_added" : "bookmark"} />
              <span>{bookmarked ? copy.unbookmark : copy.bookmark}</span>
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild variant="destructive">
            <button
              className="flex w-full items-center gap-1 rounded-md px-1.5 py-1 text-left text-[10px] font-bold leading-4"
              onClick={() => {
                setMenuOpen(false);
                setReportOpen(true);
                setStatus("");
              }}
              type="button"
            >
              <MaterialSymbol className="text-[12px]" name="flag" />
              <span>{copy.reportPost}</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <>
      {floatingMenu ? actionMenu : null}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {copy.reactions.slice(0, compact ? 2 : 3).map((reaction) => (
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
          <p className={`basis-full text-xs font-semibold ${statusKind === "success" ? "text-primary" : "text-destructive"}`} role="status">
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
          locale={locale}
        />
      ) : null}
    </>
  );
}

function ReportDialog({
  locale,
  onClose,
  onSubmit,
  reason,
  saving,
  setReason,
  status,
}: Readonly<{
  locale: AppLocale;
  onClose: () => void;
  onSubmit: () => void;
  reason: string;
  saving: boolean;
  setReason: (value: string) => void;
  status: string;
}>) {
  const copy = actionCopy[locale];

  return (
    <Dialog onOpenChange={(open) => { if (!open) onClose(); }} open>
      <DialogContent className="max-w-md rounded-3xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/15">
              <MaterialSymbol className="text-[18px]" name="flag" />
            </span>
            <div className="min-w-0">
              <DialogHeader>
                <DialogTitle className="text-base leading-6">{copy.reportPost}</DialogTitle>
              </DialogHeader>
              <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{copy.reportHelp}</p>
            </div>
          </div>
        </div>
        <Label className="mt-5 block" htmlFor="feed-report-reason">
          {copy.reason}
        </Label>
        <Textarea
          className="mt-2 min-h-32 resize-none rounded-2xl bg-muted/40 p-3.5 text-sm leading-5"
          id="feed-report-reason"
          onChange={(event) => setReason(event.target.value)}
          placeholder={copy.placeholder}
          value={reason}
        />
        {status ? (
          <p className="mt-2 text-sm font-semibold text-destructive" role="status">
            {status}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          <Button onClick={onClose} type="button" variant="outline">
            {copy.cancel}
          </Button>
          <Button
            disabled={saving || reason.trim().length < 3}
            onClick={onSubmit}
            type="button"
          >
            {saving ? copy.sending : copy.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
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
      className={`flex max-w-full items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 ${
        active
          ? "bg-accent text-accent-foreground ring-1 ring-ring/30"
          : "bg-card text-muted-foreground ring-1 ring-border hover:bg-muted hover:text-primary hover:ring-ring/20"
      }`}
      onClick={onClick}
      type="button"
    >
      <MaterialSymbol className="text-base" name={icon} />
      <span className="truncate">{label}</span>
      <span className="rounded-full bg-muted px-1.5 text-[11px] font-bold text-primary">{count}</span>
    </button>
  );
}
