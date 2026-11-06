"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";

import { LocaleSwitcher } from "@/components/navigation/locale-switcher";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { localizedLoginHref, loginHref } from "@/lib/auth/redirects";

import { moods, moodsEn, navItems, navItemsEn } from "../landing-data";
import { LiveDot, MoodButton, ShimmerCTA, softPress, tapLift, useLandingReducedMotion } from "../motion-primitives";

const SECTION_MARKER_RATIO = 0.38;

const landingTopCopy = {
  vi: {
    tagline: "Lan tỏa lòng biết ơn",
    login: "Đăng nhập",
    badge: "Cộng đồng biết ơn mỗi ngày",
    titleStart: "Nơi lòng biết ơn được",
    titleAccent: "viết ra và lan tỏa",
    description: "Đọc những điều biết ơn từ mọi người, viết lời cảm ơn của bạn hôm nay, chọn chia sẻ với cộng đồng hoặc giữ riêng để xem lại sau này.",
    explore: "Khám phá cộng đồng",
    write: "Viết lời biết ơn",
    timeline: "Dòng thời gian biết ơn",
    sampleLabel: "Một lời biết ơn từ cộng đồng",
    today: "Hôm nay",
    sampleQuote: "Biết ơn người lạ đã nhường chỗ trên chuyến xe sáng nay. Một cử chỉ nhỏ làm cả hành trình nhẹ nhàng hơn.",
    empathize: "Đồng cảm với lời biết ơn này",
    publicShare: "Chia sẻ công khai",
  },
  en: {
    tagline: "Spreading gratitude",
    login: "Sign in",
    badge: "A daily gratitude community",
    titleStart: "A place where gratitude is",
    titleAccent: "written and shared",
    description: "Read what others are grateful for, write your own thank-you note today, then share it with the community or keep it private for later.",
    explore: "Explore the community",
    write: "Write gratitude",
    timeline: "Gratitude timeline",
    sampleLabel: "A gratitude note from the community",
    today: "Today",
    sampleQuote: "Grateful for the stranger who offered me a seat this morning. One small gesture made the whole ride softer.",
    empathize: "Relate to this gratitude",
    publicShare: "Public share",
  },
} as const;

export function LandingHeader() {
  const locale = useLocale() as "vi" | "en";
  const t = useTranslations("landing");
  const copy = landingTopCopy[locale];
  const localizedNavItems = locale === "en" ? navItemsEn : navItems;
  const [activeNav, setActiveNav] = useState(0);
  const [hoveredNav, setHoveredNav] = useState<number | null>(null);
  const reduceMotion = useLandingReducedMotion();
  const visibleNav = hoveredNav ?? activeNav;

  useEffect(() => {
    const sections = navItems
      .map((item, index) => ({ element: document.getElementById(item.href.slice(1)), index }))
      .filter((section): section is { element: HTMLElement; index: number } => Boolean(section.element));

    if (!sections.length) return;

    let frame = 0;

    const updateActiveNav = () => {
      frame = 0;
      const marker = window.innerHeight * SECTION_MARKER_RATIO;
      const nextActive = sections.reduce((current, section) => (section.element.getBoundingClientRect().top <= marker ? section.index : current), sections[0].index);

      setActiveNav((current) => (current === nextActive ? current : nextActive));
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveNav);
    };

    updateActiveNav();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [localizedNavItems]);

  return (
    <header className="sticky top-0 z-50 border-b border-card/60 bg-background/85 px-4 py-3 shadow-sm backdrop-blur-xl lg:fixed lg:left-0 lg:right-0 lg:w-full lg:px-0 lg:py-0">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 lg:h-20 lg:px-margin-desktop">
        <Link className="flex shrink-0 items-center gap-3" href="#home">
          <Image alt="" className="h-9 w-9 object-cover lg:h-10 lg:w-10 " height={40} src="/stitch/landing/mascot.png" width={40} />
          <div className="sr-only sm:not-sr-only sm:flex sm:flex-col">
            <span className="text-lg font-bold leading-tight tracking-tight text-primary lg:text-xl">Grateful Forum</span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-primary lg:text-on-surface-variant">{copy.tagline}</span>
          </div>
        </Link>
        <nav className="relative hidden items-center gap-1.5 rounded-2xl border border-card/80 bg-card/70 p-1 shadow-sm xl:flex" onMouseLeave={() => setHoveredNav(null)}>
          {localizedNavItems.map(({ href, label }, index) => (
            <motion.a
              className={`relative whitespace-nowrap rounded-xl px-2.5 py-2 text-sm font-bold transition-colors ${
                visibleNav === index ? "text-primary" : "text-on-surface-variant"
              }`}
              aria-current={activeNav === index ? "location" : undefined}
              href={href}
              key={href}
              onClick={() => setActiveNav(index)}
              onMouseEnter={() => setHoveredNav(index)}
              {...softPress(Boolean(reduceMotion))}
            >
              {visibleNav === index ? (
                <motion.span
                  className="absolute inset-0 rounded-xl bg-surface-white shadow-xs"
                  layoutId="landing-nav-indicator"
                />
              ) : null}
              <span className="relative">{label}</span>
            </motion.a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <LocaleSwitcher />
          <Link aria-label={t("preview")} className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:text-sm" href="/feed/preview">
            {t("previewShort")}
          </Link>
          <ShimmerCTA className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/30 bg-accent/50 px-3.5 py-1.5 text-xs font-bold text-primary shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 lg:rounded-full lg:px-5 lg:py-2.5 lg:text-sm" href={loginHref("/feed", locale)}>
            <span className="sr-only sm:not-sr-only">{copy.login}</span>
            <MaterialSymbol className="text-[18px]" name="eco" />
          </ShimmerCTA>
        </div>
      </div>
    </header>
  );
}

export function HeroSection() {
  const locale = useLocale() as "vi" | "en";
  const copy = landingTopCopy[locale];
  const localizedMoods = locale === "en" ? moodsEn : moods;
  const [selectedMood, setSelectedMood] = useState(0);
  const reduceMotion = useLandingReducedMotion();
  return (
    <section className="mx-auto grid scroll-mt-24 max-w-md grid-cols-1 gap-6 px-4 pb-12 pt-6 text-center lg:scroll-mt-28 lg:max-w-7xl lg:grid-cols-12 lg:gap-10 lg:px-margin-desktop lg:pb-24 lg:pt-8 lg:text-left" id="home">
      <div className="flex flex-col items-center lg:col-span-7 lg:items-start">
        <div className="relative mb-4 inline-flex items-center gap-2 overflow-hidden rounded-full border border-primary/20 bg-primary-fixed/50 px-3.5 py-1.5 text-xs font-bold text-primary">
          <span aria-hidden="true" className="landing-badge-shine pointer-events-none absolute -inset-y-1 left-[-55%] w-1/2 -skew-x-12" />
          <span className="relative">🌱</span>
          <span className="relative">{copy.badge}</span>
          <LiveDot />
        </div>
        <h1 className="mx-auto mb-3 max-w-[12ch] text-balance text-[26px] font-extrabold leading-tight tracking-tight text-text-deep sm:text-3xl lg:mx-0 lg:max-w-none lg:text-[54px] lg:font-bold lg:leading-[1.15]">
          {copy.titleStart}<br /><span className="text-primary">{copy.titleAccent}</span>
        </h1>
        <p className="mx-auto mb-6 max-w-xs text-sm font-medium leading-relaxed text-on-surface-variant lg:mx-0 lg:mb-8 lg:max-w-xl lg:text-lg">
          {copy.description}
        </p>
        <div className="mb-6 flex w-full flex-col gap-2.5 px-2 sm:flex-row lg:mb-8 lg:w-auto lg:px-0">
          <ShimmerCTA className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-gradient-start to-gradient-end px-6 py-3.5 text-sm font-bold text-on-primary shadow-[var(--primary-shadow-md)] transition-all hover:-translate-y-0.5 active:scale-95 lg:w-auto lg:text-base" href="/feed/preview">
            <span>{copy.explore}</span>
            <MaterialSymbol className="text-[20px]" name="arrow_forward" />
          </ShimmerCTA>
          <motion.a className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-surface-container-high bg-surface-white px-5 py-3.5 text-sm font-bold text-text-deep hover:border-primary/40 hover:bg-surface-container-low lg:w-auto lg:text-base" href={localizedLoginHref("/write", locale)} {...tapLift(Boolean(reduceMotion))}>
            <MaterialSymbol className="text-[20px] text-primary" name="edit_note" />
            <span>{copy.write}</span>
          </motion.a>
        </div>

      </div>
      <div className="relative text-left lg:col-span-5">
        <div className="landing-zen-glass-emerald landing-float-gentle relative w-full max-w-full overflow-hidden rounded-3xl p-4 lg:p-7">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image alt="" className="landing-mascot-breathe h-12 w-12 rounded-2xl object-cover shadow-sm" height={48} src="/stitch/landing/mascot.png" width={48} />
              <div>
                <h3 className="text-base font-bold text-text-deep">{copy.timeline}</h3>
                <span className="text-xs font-semibold text-primary">{copy.sampleLabel}</span>
              </div>
            </div>
            <span className="rounded-xl bg-white/80 px-2.5 py-1 text-xs font-bold text-on-surface-variant shadow-xs">{copy.today}</span>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {localizedMoods.map(({ icon, label }, index) => <MoodButton key={label} active={selectedMood === index} icon={icon} label={label} onClick={() => setSelectedMood(index)} />)}
          </div>
          <div className="mb-4 rounded-2xl border border-surface-container-high bg-surface-white/95 p-4 shadow-xs">
            <p className="text-sm italic leading-relaxed text-text-deep">&ldquo;{copy.sampleQuote}&rdquo;</p>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-primary/10 pt-2.5 text-[11px] font-medium text-on-surface-variant">
            <span className="flex min-w-0 items-center gap-1 truncate font-bold text-primary"><MaterialSymbol className="text-[14px]" name="favorite" fill /> {copy.empathize}</span>
            <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-primary">{copy.publicShare}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
