"use client";

import Image from "next/image";
import { useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { ProfileView } from "../profile-view";

export function ProfileShareModalButton({ view }: Readonly<{ view: ProfileView }>) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(view.shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <>
      <button
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-card px-4 py-3 text-sm font-semibold leading-5 text-foreground transition-colors hover:bg-muted sm:w-auto"
        onClick={() => setOpen(true)}
        type="button"
      >
        <MaterialSymbol className="text-base" name="share" />
        <span>Chia sẻ</span>
      </button>
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm sm:p-6">
          <div aria-hidden="true" className="absolute inset-0 cursor-default" onClick={() => setOpen(false)} role="presentation" />
          <div className="relative z-10 my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 pb-4 pt-6">
              <div className="flex items-center gap-2">
                <MaterialSymbol className="text-xl text-primary" name="share" />
                <h3 className="text-[18px] font-bold leading-7 text-foreground">Chia sẻ khoảnh khắc biết ơn</h3>
              </div>
              <button
                aria-label="Đóng"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-input hover:text-foreground"
                onClick={() => setOpen(false)}
                title="Đóng"
                type="button"
              >
                <MaterialSymbol className="text-base" name="close" />
              </button>
            </div>
            <div className="space-y-6 p-6">
              <div className="relative overflow-hidden rounded-[24px] border border-border/30 bg-gradient-to-br from-background via-muted to-accent/60 p-6 text-center shadow-sm">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-xl" />
                <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-accent/30 blur-xl" />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-card/80 px-3 py-1 text-[11px] font-semibold leading-[14px] text-primary shadow-sm backdrop-blur-sm">
                    <MaterialSymbol className="text-sm" fill name="nest_eco_leaf" />
                    Đồng hành 14 ngày
                  </span>
                  <div className="my-1 flex h-28 w-28 items-center justify-center">
                    <Image alt="Bé Mầm Mascot" className="h-full w-full object-contain drop-shadow-md" height={112} src="/stitch/profile/share-mascot.jpg" unoptimized width={112} />
                  </div>
                  <p className="mt-2 max-w-xs text-[16px] font-semibold leading-6 text-foreground">
                    “Mầm đang lớn lên từng ngày nhờ những suy nghĩ tích cực của bạn! 🌱”
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 border-t border-primary/10 pt-3 text-[12px] leading-4 text-muted-foreground">
                    <span className="font-semibold text-foreground">{view.displayName}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MaterialSymbol className="text-xs text-primary" fill name="spa" />
                      {view.entryCount} điều biết ơn đã ghi
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[12px] font-semibold leading-4 text-muted-foreground">Sao chép liên kết</label>
                <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted p-1.5">
                  <div className="flex min-w-0 flex-1 items-center gap-2 px-2 text-[12px] font-mono leading-4 text-muted-foreground">
                    <MaterialSymbol className="text-sm text-muted-foreground" name="link" />
                    <span className="truncate">{view.shareUrl}</span>
                  </div>
                  <button
                    className="inline-flex items-center gap-1 rounded-lg bg-card px-4 py-2 text-[12px] font-semibold leading-4 text-foreground shadow-sm transition-colors hover:bg-input"
                    onClick={copyLink}
                    type="button"
                  >
                    <MaterialSymbol className="text-sm" name="content_copy" />
                    <span>{copied ? "Đã chép" : "Chép"}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold leading-5 text-primary-foreground shadow-md transition-all hover:bg-[var(--leaf-deep)]" type="button">
                    <MaterialSymbol className="text-base" name="rss_feed" />
                    <span>Chia sẻ lên Feed</span>
                  </button>
                  <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/50 bg-card px-4 py-3 text-sm font-medium leading-5 text-foreground shadow-sm transition-colors hover:bg-muted" type="button">
                    <MaterialSymbol className="text-base" name="download" />
                    <span>Tải ảnh kỷ niệm</span>
                  </button>
                </div>
                <div className="flex items-center justify-center gap-4 pt-2">
                  <CircleShareButton title="Facebook" icon="public" />
                  <CircleShareButton title="Instagram Story" icon="photo_camera" />
                  <CircleShareButton title="Telegram" icon="send" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function CircleShareButton({ icon, title }: Readonly<{ icon: string; title: string }>) {
  return (
    <button
      className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground shadow-sm transition-colors hover:bg-input"
      title={title}
      type="button"
    >
      <MaterialSymbol className="text-lg" name={icon} />
    </button>
  );
}
