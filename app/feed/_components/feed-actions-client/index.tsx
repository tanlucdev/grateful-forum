"use client";

import { useState } from "react";
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
      <DropdownMenu onOpenChange={setMenuOpen} open={menuOpen}>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Tùy chọn bài viết" className="rounded-full bg-card/85 shadow-xs backdrop-blur" size="icon-sm" type="button" variant="outline">
            <MaterialSymbol className="text-[14px]" name="more_vert" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5">
          <DropdownMenuItem asChild>
            <button
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold"
              onClick={() => {
                setMenuOpen(false);
                void bookmark();
              }}
              type="button"
            >
              <MaterialSymbol className="text-[16px]" name={bookmarked ? "bookmark_added" : "bookmark"} />
              <span>{bookmarked ? "Bỏ lưu bài viết" : "Lưu truyền cảm hứng"}</span>
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild variant="destructive">
            <button
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold"
              onClick={() => {
                setMenuOpen(false);
                setReportOpen(true);
                setStatus("");
              }}
              type="button"
            >
              <MaterialSymbol className="text-[16px]" name="flag" />
              <span>Báo cáo bài viết</span>
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
        />
      ) : null}
    </>
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
    <Dialog onOpenChange={(open) => { if (!open) onClose(); }} open>
      <DialogContent className="max-w-md rounded-3xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/15">
              <MaterialSymbol className="text-[18px]" name="flag" />
            </span>
            <div className="min-w-0">
              <DialogHeader>
                <DialogTitle className="text-base leading-6">Báo cáo bài viết</DialogTitle>
              </DialogHeader>
              <p className="mt-0.5 text-sm leading-5 text-muted-foreground">Cho tụi mình biết điều gì chưa phù hợp.</p>
            </div>
          </div>
        </div>
        <Label className="mt-5 block" htmlFor="feed-report-reason">
          Lý do
        </Label>
        <Textarea
          className="mt-2 min-h-32 resize-none rounded-2xl bg-muted/40 p-3.5 text-sm leading-5"
          id="feed-report-reason"
          onChange={(event) => setReason(event.target.value)}
          placeholder="Spam, nội dung không an toàn, thông tin riêng tư..."
          value={reason}
        />
        {status ? (
          <p className="mt-2 text-sm font-semibold text-destructive" role="status">
            {status}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
          <Button onClick={onClose} type="button" variant="outline">
            Hủy
          </Button>
          <Button
            disabled={saving || reason.trim().length < 3}
            onClick={onSubmit}
            type="button"
          >
            {saving ? "Đang gửi..." : "Gửi báo cáo"}
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
