"use client";

import { useRef, useState } from "react";
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
import type { AppLocale } from "@/i18n/routing";
import type { DisplayItem } from "../feed-data";
import { FeedLikeClient } from "../feed-like-client";

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
  },
} as const;

export function MindfulActionsClient({ floatingMenu = false, item }: Readonly<{ compact?: boolean; floatingMenu?: boolean; item: DisplayItem }>) {
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

  const reacting = useRef(false);

  async function toggleReaction() {
    if (reacting.current) return;
    reacting.current = true;
    const previous = { reactions, viewerReaction };
    // ponytail: reuse empathy for likes; retain historical types until a DB migration.
    const nextReaction = viewerReaction ? null : "empathy";
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
    } finally {
      reacting.current = false;
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
          <Button aria-label={copy.options} className="min-h-11 min-w-11 rounded-full text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground" size="icon-xs" type="button" variant="ghost">
            <MaterialSymbol className="text-base" name="more_vert" strokeWidth={1.8} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 max-w-[calc(100vw-2rem)] rounded-xl p-1.5 shadow-sm" sideOffset={6}>
          <DropdownMenuItem
            className="min-h-11 gap-2.5 rounded-lg px-3 text-xs font-medium leading-4"
            onSelect={() => {
              setMenuOpen(false);
              void bookmark();
            }}
          >
            <MaterialSymbol className="text-base text-primary" name={bookmarked ? "bookmark_added" : "bookmark"} strokeWidth={1.8} />
            <span>{bookmarked ? copy.unbookmark : copy.bookmark}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="min-h-11 gap-2.5 rounded-lg px-3 text-xs font-medium leading-4"
            onSelect={() => {
              setMenuOpen(false);
              setReportOpen(true);
              setStatus("");
            }}
            variant="destructive"
          >
            <MaterialSymbol className="text-base" name="flag" strokeWidth={1.8} />
            <span>{copy.reportPost}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <>
      {floatingMenu ? actionMenu : null}
      <div className="flex max-w-full flex-wrap items-center gap-2 text-xs">
        <FeedLikeClient
          count={Object.values(reactions).reduce((sum, count) => sum + count, 0)}
          liked={viewerReaction !== null}
          onToggle={() => void toggleReaction()}
        />
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
