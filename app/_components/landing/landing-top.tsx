"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { loginHref } from "@/lib/auth/redirects";

import { moods, navItems } from "./landing-data";
import { LiveDot, MoodButton, ShimmerCTA, softPress, tapLift, useLandingReducedMotion } from "./motion-primitives";

export function LandingHeader() {
  const [hoveredNav, setHoveredNav] = useState(0);
  const reduceMotion = useLandingReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[#faf7f0]/85 px-4 py-3 shadow-[0_4px_20px_rgba(26,47,43,0.03)] backdrop-blur-xl lg:fixed lg:left-0 lg:right-0 lg:w-full lg:px-0 lg:py-0">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 lg:h-20 lg:max-w-7xl lg:px-margin-desktop">
        <Link className="flex shrink-0 items-center gap-3" href="#">
          <Image alt="" className="h-9 w-9 object-cover lg:h-10 lg:w-10 " height={40} src="/stitch/landing/mascot.png" width={40} />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight text-primary lg:text-xl">Grateful Forum</span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-primary lg:text-on-surface-variant">Lan tỏa lòng biết ơn</span>
          </div>
        </Link>
        <nav className="relative hidden items-center gap-1.5 rounded-2xl border border-white/80 bg-white/70 p-1 shadow-[0_2px_12px_rgba(0,0,0,0.03)] lg:flex">
          {navItems.map(({ href, label }, index) => (
            <motion.a
              className={`relative rounded-xl px-3.5 py-1.5 text-sm font-bold transition-colors ${
                hoveredNav === index ? "text-primary" : "text-on-surface-variant"
              }`}
              href={href}
              key={href}
              onMouseEnter={() => setHoveredNav(index)}
              {...softPress(Boolean(reduceMotion))}
            >
              {hoveredNav === index ? (
                <motion.span
                  className="absolute inset-0 rounded-xl bg-surface-white shadow-xs"
                  layoutId="landing-nav-indicator"
                />
              ) : null}
              <span className="relative">{label}</span>
            </motion.a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ShimmerCTA className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-50/60 px-3.5 py-1.5 text-xs font-bold text-primary shadow-[0_2px_8px_rgba(0,109,67,0.15)] transition-all hover:-translate-y-0.5 active:scale-95 lg:rounded-full lg:px-5 lg:py-2.5 lg:text-sm" href={loginHref("/feed")}>
            <span className="hidden min-[360px]:inline">Đăng nhập</span>
            <MaterialSymbol className="text-[18px]" name="eco" />
          </ShimmerCTA>
        </div>
      </div>
    </header>
  );
}

export function HeroSection() {
  const [selectedMood, setSelectedMood] = useState(0);
  const reduceMotion = useLandingReducedMotion();
  return (
    <section className="mx-auto grid max-w-md grid-cols-1 gap-6 px-4 pb-12 pt-6 text-center lg:max-w-7xl lg:grid-cols-12 lg:gap-10 lg:px-margin-desktop lg:pb-24 lg:pt-8 lg:text-left">
      <div className="flex flex-col items-center lg:col-span-7 lg:items-start">
        <div className="relative mb-4 inline-flex items-center gap-2 overflow-hidden rounded-full border border-primary/20 bg-primary-fixed/50 px-3.5 py-1.5 text-xs font-bold text-primary">
          <span aria-hidden="true" className="landing-badge-shine pointer-events-none absolute -inset-y-1 left-[-55%] w-1/2 -skew-x-12" />
          <span className="relative">🌱</span>
          <span className="relative">Cộng đồng biết ơn mỗi ngày</span>
          <LiveDot />
        </div>
        <h1 className="mx-auto mb-3 max-w-[12ch] text-balance text-[26px] font-extrabold leading-tight tracking-tight text-text-deep sm:text-3xl lg:mx-0 lg:max-w-none lg:text-[54px] lg:font-bold lg:leading-[1.15]">
          Nơi lòng biết ơn được<br /><span className="text-primary">viết ra và lan tỏa</span>
        </h1>
        <p className="mx-auto mb-6 max-w-xs text-sm font-medium leading-relaxed text-on-surface-variant lg:mx-0 lg:mb-8 lg:max-w-xl lg:text-lg">
          Đọc những điều biết ơn từ mọi người, viết lời cảm ơn của bạn hôm nay, chọn chia sẻ với cộng đồng hoặc giữ riêng để xem lại sau này.
        </p>
        <div className="mb-6 flex w-full flex-col gap-2.5 px-2 sm:flex-row lg:mb-8 lg:w-auto lg:px-0">
          <ShimmerCTA className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-gradient-start to-gradient-end px-6 py-3.5 text-sm font-bold text-on-primary shadow-[0_8px_24px_rgba(0,109,67,0.25)] transition-all hover:-translate-y-0.5 active:scale-95 lg:w-auto lg:text-base" href="/feed">
            <span>Khám phá cộng đồng</span>
            <MaterialSymbol className="text-[20px]" name="arrow_forward" />
          </ShimmerCTA>
          <motion.a className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-surface-container-high bg-surface-white px-5 py-3.5 text-sm font-bold text-text-deep hover:border-primary/40 hover:bg-surface-container-low lg:w-auto lg:text-base" href="/write" {...tapLift(Boolean(reduceMotion))}>
            <MaterialSymbol className="text-[20px] text-primary" name="edit_note" />
            <span>Viết lời biết ơn</span>
          </motion.a>
        </div>

      </div>
      <div className="relative text-left lg:col-span-5">
        <div className="landing-zen-glass-emerald landing-float-gentle relative w-full max-w-full overflow-hidden rounded-3xl p-4 lg:p-7">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image alt="" className="landing-mascot-breathe h-12 w-12 rounded-2xl object-cover shadow-sm" height={48} src="/stitch/landing/mascot.png" width={48} />
              <div>
                <h3 className="text-base font-bold text-text-deep">Dòng thời gian biết ơn</h3>
                <span className="text-xs font-semibold text-primary">Một lời biết ơn từ cộng đồng</span>
              </div>
            </div>
            <span className="rounded-xl bg-white/80 px-2.5 py-1 text-xs font-bold text-on-surface-variant shadow-xs">Hôm nay</span>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {moods.map(({ icon, label }, index) => <MoodButton key={label} active={selectedMood === index} icon={icon} label={label} onClick={() => setSelectedMood(index)} />)}
          </div>
          <div className="mb-4 rounded-2xl border border-surface-container-high bg-surface-white/95 p-4 shadow-xs">
            <p className="text-sm italic leading-relaxed text-text-deep">&ldquo;Biết ơn người lạ đã nhường chỗ trên chuyến xe sáng nay. Một cử chỉ nhỏ làm cả hành trình nhẹ nhàng hơn.&rdquo;</p>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-primary/10 pt-2.5 text-[11px] font-medium text-on-surface-variant">
            <span className="flex min-w-0 items-center gap-1 truncate font-bold text-primary"><MaterialSymbol className="text-[14px]" name="favorite" fill /> Đồng cảm với lời biết ơn này</span>
            <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-primary">Chia sẻ công khai</span>
          </div>
        </div>
      </div>
    </section>
  );
}
