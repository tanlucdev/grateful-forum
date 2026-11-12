"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useState } from "react";

import { motionDuration, motionEaseIn } from "@/lib/motion";
import { MaterialSymbol } from "@/components/ui/material-symbol";

import { journalSpreads, journalSpreadsEn } from "../landing-data";
import { Reveal, SectionHeader, Spine, landingEase, softPress, useLandingReducedMotion } from "../motion-primitives";

const sheetDuration = motionDuration.panel;

const notebookCopy = {
  vi: {
    sectionTitle: "Xem lại những điều bạn từng biết ơn",
    sectionEyebrow: "Hành trình cá nhân",
    sectionCopy: "Mỗi bài viết riêng trở thành một phần lịch sử cá nhân để bạn xem lại những điều từng làm mình biết ơn.",
    history: "Lịch sử lời biết ơn của bạn",
    previous: "Trang trước",
    next: "Trang kế",
    personalRecord: "Bản ghi cá nhân",
    promptTitle: "Gợi ý viết hôm nay:",
    prompt: "Hãy gửi một tin nhắn cảm ơn người bạn yêu quý vì đã luôn hiện diện trong đời bạn.",
    privatePost: "Bài viết riêng",
    review: "Xem lại",
    stampTop: "TÂM",
    stampBottom: "AN",
  },
  en: {
    sectionTitle: "Review what you once felt grateful for",
    sectionEyebrow: "Personal path",
    sectionCopy: "Each private post becomes part of your personal history, ready when you want to revisit what once mattered.",
    history: "Your gratitude history",
    previous: "Previous",
    next: "Next",
    personalRecord: "Personal record",
    promptTitle: "Writing prompt:",
    prompt: "Send a thank-you message to someone dear who has kept showing up in your life.",
    privatePost: "Private post",
    review: "Review",
    stampTop: "CALM",
    stampBottom: "HEART",
  },
} as const;

const sheetVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.985,
    x: direction > 0 ? 22 : -22,
    y: 4,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
  },
  exit: (direction: number) => ({
    opacity: 0.42,
    scale: 0.992,
    x: direction > 0 ? -14 : 14,
    y: 5,
    transition: { duration: motionDuration.exit, ease: motionEaseIn },
  }),
} as const;

const curlVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 12 : -12,
  }),
  center: (direction: number) => ({
    opacity: [0, 0.82, 0],
    x: [direction > 0 ? 12 : -12, 0, 0],
  }),
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -10 : 10,
  }),
} as const;

const flatSheetVariants = {
  enter: { opacity: 1, scale: 1, x: 0, y: 0 },
  center: { opacity: 1, scale: 1, x: 0, y: 0 },
  exit: { opacity: 0, scale: 1, x: 0, y: 0 },
} as const;

const flatCurlVariants = {
  enter: { opacity: 0, x: 0 },
  center: { opacity: 0, x: 0 },
  exit: { opacity: 0, x: 0 },
} as const;

export function NotebookSection() {
  const locale = useLocale() as "vi" | "en";
  const copy = notebookCopy[locale];
  const spreads = locale === "en" ? journalSpreadsEn : journalSpreads;
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useLandingReducedMotion();
  const spread = spreads[page];

  const goToPage = (nextPage: number) => {
    setDirection(nextPage > page ? 1 : -1);
    setPage(nextPage);
  };

  return (
    <Reveal>
      <section className="w-full scroll-mt-24 py-16 lg:scroll-mt-28 lg:py-24" id="journal-flipbook">
        <div className="mx-auto max-w-md px-4 lg:max-w-7xl lg:px-margin-desktop">
          <SectionHeader copy={copy.sectionCopy} eyebrow={copy.sectionEyebrow} title={copy.sectionTitle} />
          <div className="relative mx-auto max-w-5xl rounded-[36px] border-2 border-white/80 bg-gradient-to-br from-[#e4eee7] via-[#dde8e1] to-[#d6e3db] p-3 shadow-[0_24px_60px_rgba(26,47,43,0.08)] transition-transform duration-(--motion-feedback) hover:-translate-y-1 sm:p-7 lg:p-9">
            <div className="absolute -top-3 right-16 z-30 flex h-14 w-6 items-end justify-center rounded-b-md bg-gradient-to-b from-[#9cf5c0] via-primary to-[#005231] pb-1.5 shadow-[0_4px_12px_rgba(0,109,67,0.3)] sm:right-28"><span className="h-1.5 w-1.5 rounded-full bg-surface-white" /></div>
            <div className="relative grid overflow-hidden rounded-2xl border border-[#e2d8c9] bg-[#faf6ef] shadow-2xl" style={{ perspective: "1600px" }}>
              <Spine />
              <AnimatePresence initial={false} mode="sync" custom={direction}>
                <motion.div
                  animate="center"
                  className="col-start-1 row-start-1 grid grid-cols-1 md:grid-cols-2"
                  custom={direction}
                  exit="exit"
                  initial="enter"
                  key={page}
                  style={{ transformStyle: "preserve-3d" }}
                  transition={{ duration: reduceMotion ? 0.01 : sheetDuration, ease: landingEase }}
                  variants={reduceMotion ? flatSheetVariants : sheetVariants}
                >
                  <NotebookLeft copy={copy} entry={spread.left} />
                  <NotebookRight copy={copy} entry={spread.right} />
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 z-30 hidden w-1/2 border border-[#eadfce] bg-gradient-to-r from-white/80 via-[#f6f1e7] to-[#977448]/20 shadow-[0_24px_46px_rgba(50,38,24,0.20)] md:block"
                    custom={direction}
                    animate="center"
                    exit="exit"
                    initial="enter"
                    transition={{ duration: reduceMotion ? 0.01 : sheetDuration, ease: landingEase }}
                    variants={reduceMotion ? flatCurlVariants : curlVariants}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="landing-zen-glass-card mx-auto mt-8 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl p-4 shadow-xs sm:flex-row">
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="flex items-center gap-1.5 text-xs font-bold text-text-deep"><MaterialSymbol className="text-[16px] text-primary" name="auto_stories" /> {copy.history}</span>
                <div className="mt-1 flex gap-1">{spreads.map((item, index) => <span className={`h-1.5 w-5 rounded-full ${index === page ? "bg-primary" : "bg-surface-container-high"}`} key={item.left.page} />)}</div>
              </div>
              <div className="flex gap-2">
                <motion.button className="flex items-center gap-1.5 rounded-xl border border-surface-container-high bg-surface-white px-4 py-2 text-xs font-bold text-on-surface shadow-xs hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-45" disabled={page === 0} onClick={() => goToPage(Math.max(0, page - 1))} type="button" {...softPress(Boolean(reduceMotion))}><MaterialSymbol className="text-[16px]" name="arrow_back" /> {copy.previous}</motion.button>
                <motion.button className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-on-primary shadow-xs hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-45" disabled={page === spreads.length - 1} onClick={() => goToPage(Math.min(spreads.length - 1, page + 1))} type="button" {...softPress(Boolean(reduceMotion))}>{copy.next} <MaterialSymbol className="text-[16px]" name="arrow_forward" /></motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function NotebookLeft({ copy, entry }: Readonly<{ copy: (typeof notebookCopy)[keyof typeof notebookCopy]; entry: (typeof journalSpreads)[number]["left"] }>) {
  return (
    <div className="hidden flex-col justify-between bg-gradient-to-r from-[#fdfbf7] to-[#f6f1e7] p-6 md:flex sm:p-8 lg:p-9">
      <div className="landing-tape pointer-events-none absolute -top-3 left-8 z-20 flex -rotate-2 items-center gap-1.5 rounded-sm border border-primary/20 bg-[#a7f3d0]/80 px-3.5 py-1 text-[11px] font-bold text-primary shadow-sm backdrop-blur-xs sm:left-12">
        <span className="text-xs">🌿</span>
        <span>{copy.personalRecord}</span>
      </div>
      <div>
        <div className="mb-4 border-b border-[#ebdcca] pb-3 pr-12 pt-2.5">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-secondary">{entry.day}</span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-on-primary shadow-xs">📅 {entry.day}</span>
            <span className="rounded-full bg-primary-fixed/50 px-2 py-0.5 text-[10px] font-bold text-primary">🌱 {entry.season}</span>
          </div>
        </div>
        <div className="mb-3.5 flex items-center gap-3 rounded-2xl border border-[#ece2d3] bg-white p-2 shadow-sm">
          <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl border border-primary/10 bg-gradient-to-br from-surface-container to-accent-mint/40 text-2xl shadow-inner">☕</div>
          <div className="flex flex-col pr-2 text-xs">
            <span className="flex items-center gap-1 text-[13px] font-bold text-text-deep">☕ {entry.place}</span>
            <span className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">{entry.note}</span>
          </div>
        </div>
        <p className="mb-4 text-xs italic leading-relaxed text-text-deep/90 sm:text-[12px]">&ldquo;{entry.quote}&rdquo;</p>
        <div className="mb-3 flex items-start gap-2.5 rounded-2xl border border-primary/15 bg-accent-mint/35 p-3 text-xs text-text-deep shadow-xs">
            <span className="shrink-0 text-lg">🌱</span>
            <div className="flex-1">
              <span className="flex items-center justify-between text-[11px] font-bold text-primary">
                <span>{copy.promptTitle}</span>
                <MaterialSymbol className="text-[14px]" name="check_circle" />
              </span>
            <p className="mt-0.5 text-[11px] font-medium leading-snug">&ldquo;{copy.prompt}&rdquo;</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#ebdcca] pt-3.5 text-xs">
        <div className="flex items-center gap-1.5">{entry.gratitude.map((item) => <span className="rounded-md border border-primary/10 bg-white/90 px-2 py-0.5 text-[10px] font-bold text-primary" key={item}>{item}</span>)}</div>
        <div className="flex items-center gap-3 text-[11px] font-semibold text-on-surface-variant">
          <span className="flex items-center gap-1 text-primary"><MaterialSymbol className="text-[14px]" name="lock" /> {copy.privatePost}</span>
          <span className="ml-1 font-bold text-[#b5a796]">{copy.review}</span>
        </div>
      </div>
    </div>
  );
}

function NotebookRight({ copy, entry }: Readonly<{ copy: (typeof notebookCopy)[keyof typeof notebookCopy]; entry: (typeof journalSpreads)[number]["right"] }>) {
  return (
    <div className="relative flex flex-col justify-between bg-gradient-to-l from-[#fdfbf7] to-[#f6f1e7] p-6 sm:p-8 lg:p-9">
      <div className="absolute right-5 top-4 z-10 flex h-[52px] w-[52px] rotate-6 flex-col items-center justify-center rounded-full border-2 border-white/60 bg-gradient-to-br from-[#c84b4f] to-[#9b2a2e] p-2 text-white shadow-lg">
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-dashed border-white/70">
          <span className="text-[9px] font-bold leading-none tracking-widest">{copy.stampTop}</span>
          <span className="mt-0.5 text-[9px] font-bold leading-none tracking-widest">{copy.stampBottom}</span>
        </div>
      </div>
      <div>
        <div className="mb-4 border-b border-[#ebdcca] pb-3 pr-12 pt-2.5">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-secondary">{entry.title}</span>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-on-primary shadow-xs">📅 {entry.date}</span>
            <span className="rounded-full bg-primary-fixed/50 px-2 py-0.5 text-[10px] font-bold text-primary">🌱 {entry.badge}</span>
          </div>
        </div>
        <div className="mb-3.5 flex items-center gap-3 rounded-2xl border border-[#ece2d3] bg-white p-2 shadow-sm">
          <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl border border-primary/10 bg-gradient-to-br from-surface-container to-accent-mint/40 text-2xl shadow-inner">☕</div>
          <div className="flex flex-col pr-2 text-xs">
            <span className="flex items-center gap-1 text-[13px] font-bold text-text-deep">☕ {entry.photo}</span>
            <span className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">{entry.desc}</span>
          </div>
        </div>
        <p className="mb-4 text-xs italic leading-relaxed text-text-deep/90 sm:text-[12px]">&ldquo;{entry.quote}&rdquo;</p>
        <div className="mb-3 flex items-start gap-2.5 rounded-2xl border border-primary/15 bg-accent-mint/35 p-3 text-xs text-text-deep shadow-xs">
          <span className="shrink-0 text-lg">🌱</span>
          <div className="flex-1">
            <span className="flex items-center justify-between text-[11px] font-bold text-primary">
          <span>{copy.promptTitle}</span>
              <MaterialSymbol className="text-[14px]" name="check_circle" />
            </span>
            <p className="mt-0.5 text-[11px] font-medium leading-snug">&ldquo;{copy.prompt}&rdquo;</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#ebdcca] pt-3.5 text-xs">
        <div className="flex items-center gap-1.5">{entry.tags.map((tag) => <span className="rounded-md border border-primary/10 bg-white/90 px-2 py-0.5 text-[10px] font-bold text-primary" key={tag}>{tag}</span>)}</div>
        <div className="flex items-center gap-3 text-[11px] font-semibold text-on-surface-variant">
          <span className="flex items-center gap-1 text-primary"><MaterialSymbol className="text-[14px]" name="lock" /> {copy.privatePost}</span>
          <span className="ml-1 font-bold text-[#b5a796]">{copy.review}</span>
        </div>
      </div>
    </div>
  );
}
