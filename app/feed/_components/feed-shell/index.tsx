"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { getCompanionTimeCopy } from "./companion-time";
import { dailyReflectionQuotes, getDailyReflectionQuote } from "./daily-reflection-quotes";

const subscribeToCompanionTime = () => () => {};
const getClientHour = () => new Date().getHours();
const getServerHour = () => 8;
const getClientDailyReflectionQuote = () => getDailyReflectionQuote();
const getServerDailyReflectionQuote = () => dailyReflectionQuotes[0];

function useCompanionTimeCopy() {
  const hour = useSyncExternalStore(
    subscribeToCompanionTime,
    getClientHour,
    getServerHour,
  );

  return getCompanionTimeCopy(hour);
}

function useDailyReflectionQuote() {
  return useSyncExternalStore(
    subscribeToCompanionTime,
    getClientDailyReflectionQuote,
    getServerDailyReflectionQuote,
  );
}

export function MobileReflectionBanner() {
  const copy = useCompanionTimeCopy();

  return (
    <section className="overflow-hidden rounded-[22px] border border-border bg-card p-3 shadow-card">
      <div className="flex items-center gap-2.5">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
          <Image
            alt="Bé Mầm"
            className="h-full w-full object-cover"
            height={44}
            src="/stitch/landing/mascot.png"
            width={44}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase leading-3 tracking-wider text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <p>Bé Mầm · {copy.label}</p>
          </div>
          <p className="mt-0.5 truncate text-sm font-bold leading-5 text-foreground">{copy.greeting}</p>
          <p className="truncate text-xs font-medium leading-4 text-muted-foreground">{copy.nudge}</p>
        </div>
      </div>
    </section>
  );
}

export function MobileWritePrompt() {
  return (
    <section className="relative flex items-center justify-between gap-3 overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-card">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-accent to-secondary-container" />
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-muted text-primary">
          <MaterialSymbol className="text-[18px]" fill name="edit_note" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold leading-5 text-foreground">
            Bạn đang biết ơn điều gì?
          </h2>
          <p className="truncate text-[11px] font-medium leading-[14px] text-muted-foreground">
            Gieo một điều lành cho ngày hôm nay
          </p>
        </div>
      </div>
      <Link
        className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-primary px-3 text-xs font-bold leading-4 text-primary-foreground"
        href="/write"
      >
        Viết
        <MaterialSymbol className="text-base" name="arrow_forward" />
      </Link>
    </section>
  );
}

export function WritePrompt() {
  return (
    <section className="group relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-card">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-accent to-secondary-container" />
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted text-primary">
          <MaterialSymbol className="text-[22px]" fill name="psychiatry" />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            className="block rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground hover:border-ring/40 hover:bg-muted"
            href="/write"
          >
            Hôm nay điều giản dị gì đã sưởi ấm trái tim bạn? Nhấn để ghi lại...
          </Link>
          <div className="mt-3 flex flex-col items-start justify-between gap-3 border-t border-border pt-3 text-xs xl:flex-row xl:items-center">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 font-medium text-primary">
                <span>✨</span>
                72 Sticker Bé Mầm
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary-container/40 px-2.5 py-1 font-medium text-primary">
                <span>📷</span>
                Đính kèm ảnh kỷ niệm
              </span>
              <span className="hidden items-center gap-1.5 rounded-lg bg-accent/40 px-2.5 py-1 font-medium text-accent-foreground lg:inline-flex">
                <span>🍵</span>
                Viết tự do hoặc theo 3 điều
              </span>
            </div>
            <Link
              className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
              href="/write"
            >
              <span>Viết ngay</span>
              <MaterialSymbol className="text-sm" name="arrow_forward" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MobileFeedEnd({ status }: Readonly<{ status: string }>) {
  return (
    <section className="flex flex-col items-center justify-center gap-2 p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/30">
        <Image
          alt="Bé Mầm nghỉ ngơi"
          className="h-10 w-10 object-contain"
          height={40}
          src="/stitch/feed/mascot-rest.jpg"
          width={40}
        />
      </div>
      <p className="text-sm font-bold leading-5 text-foreground">
        {status || "Bạn đã đọc hết các chia sẻ mới"}
      </p>
      <p className="max-w-60 text-[11px] font-medium leading-[14px] text-muted-foreground">
        Hãy hít thở một hơi thật sâu và mang theo sự an yên này vào ngày của bạn nhé.
      </p>
    </section>
  );
}

export function DesktopAside() {
  const copy = useCompanionTimeCopy();
  const dailyQuote = useDailyReflectionQuote();

  return (
    <aside className="flex flex-col gap-6 md:col-span-5 lg:col-span-4">
      <section className="overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-start gap-3">
          <Image
            alt="Mascot Mầm"
            className="h-16 w-16 shrink-0 rounded-2xl border border-border object-cover"
            height={64}
            src="/stitch/landing/mascot.png"
            width={64}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-bold uppercase leading-4 tracking-wider text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Bé Mầm
              </span>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-primary">
                {copy.label}
              </span>
            </div>
            <p className="mt-1 text-base font-bold leading-6 text-foreground">{copy.greeting}</p>
            <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{copy.nudge}</p>
          </div>
        </div>
        <Link className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90" href="/write">
          <MaterialSymbol className="text-base" name="edit_note" />
          Viết trang nhật ký hôm nay
        </Link>
      </section>
      <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span>🌱</span>
            Nhịp điệu tuần này
          </h3>
          <Link className="text-xs font-bold text-primary hover:underline" href="/calendar">
            Vườn hoa 365
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Duy trì thói quen viết để tâm trí thêm vững vàng:</p>
        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
            <div className="flex flex-col items-center gap-1.5" key={day}>
              <span className={`text-[10px] font-semibold ${index === 3 ? "text-primary" : "text-muted-foreground"}`}>
                {day}
              </span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                  index < 3
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : index === 3
                      ? "bg-accent text-primary ring-2 ring-ring ring-offset-2"
                      : "bg-muted text-muted-foreground/60"
                }`}
              >
                {index < 2 ? "🌸" : index === 2 ? "🌷" : index === 3 ? "✎" : "·"}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>
            Đã tưới mát: <strong className="text-primary">18 ngày</strong>
          </span>
          <span className="font-semibold text-primary">Tỷ lệ: 82%</span>
        </div>
      </section>
      <section className="relative rounded-3xl border border-border bg-card p-6 shadow-card">
        <span className="absolute -top-2.5 right-6 flex h-5 w-20 items-center justify-center bg-accent text-[9px] font-bold text-accent-foreground [clip-path:polygon(3%_0%,97%_0%,100%_50%,97%_100%,3%_100%,0%_50%)]">
          Trích dẫn
        </span>
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          <span>🌿</span>
          Gieo Vào Tâm Thức
        </p>
        <blockquote className="mt-3 font-serif text-[15px] italic leading-relaxed text-foreground">
          “{dailyQuote.text}”
        </blockquote>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
          <span className="font-medium">{dailyQuote.source}</span>
          <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-primary">
            Mỗi sớm mai
          </span>
        </div>
      </section>
      <section className="space-y-2 rounded-2xl border border-border bg-card/80 p-4 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5 font-bold text-foreground">
          <MaterialSymbol className="text-sm text-primary" name="verified_user" />
          Cam kết mạng xã hội an lành
        </p>
        <p className="leading-relaxed">
          Không thuật toán câu tương tác. Không hiển thị người theo dõi. Không gian riêng tư được bảo vệ.
        </p>
      </section>
    </aside>
  );
}

export function DesktopFooter() {
  return (
    <footer className="mt-auto hidden w-full border-t border-border bg-card/70 py-6 backdrop-blur-sm md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">BeGrateful</span>
          <span>•</span>
          <span>Nuôi dưỡng tâm hồn an yên mỗi ngày</span>
        </div>
        <div className="flex items-center gap-6">
          <Link className="hover:text-primary" href="/calendar">Vườn hoa 365</Link>
          <Link className="hover:text-primary" href="/profile?tab=moments">Huy hiệu</Link>
          <Link className="hover:text-primary" href="/feed">Cộng đồng</Link>
        </div>
        <p className="text-muted-foreground">
          © 2026 Grateful Forum. Lan tỏa lòng biết ơn mỗi ngày.
        </p>
      </div>
    </footer>
  );
}
