"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale } from "next-intl";

import { loginHref } from "@/lib/auth/redirects";
import { MaterialSymbol } from "@/components/ui/material-symbol";

import { badgeData, badgeDataEn, feedCards, feedCardsEn } from "../landing-data";
import { Reveal, SectionHeader, ShimmerCTA, TestimonialCard, tapLift, useLandingReducedMotion } from "../motion-primitives";

const MARQUEE_GROUPS = 2;
const BADGE_MARQUEE_CYCLES = 2;
const COMMUNITY_MARQUEE_CYCLES = 3;

const bottomCopy = {
  vi: {
    badgesTitle: "Ghi nhận nhịp thực hành của bạn",
    badgesCopy: "Huy hiệu ghi nhận những cách bạn duy trì việc viết và lan tỏa lòng biết ơn. Đây là lời nhắc để tiếp tục, không phải cuộc đua.",
    communityTitle: "Dòng thời gian biết ơn",
    communityCopy: "Đọc những điều mọi người đang biết ơn, để một lời chia sẻ nhỏ tiếp tục lan sang ngày của bạn.",
    ctaEyebrow: "🌱 Tham gia lan tỏa",
    ctaTitle: "Viết một lời biết ơn để ngày hôm nay sáng hơn cho bạn và cho ai đó.",
    ctaCopy: "Bắt đầu bằng một điều nhỏ. Bạn có thể chia sẻ với cộng đồng hoặc giữ lại như một phần hành trình của riêng mình.",
    mascotTitle: "Bé Mầm vẫy tay chào",
    mascotCopy: "Chia sẻ khi bạn sẵn sàng",
    footerTagline: "• Nơi lòng biết ơn được lan tỏa mỗi ngày",
    practice: "Lịch thực hành",
    badges: "Huy hiệu",
    journey: "Hành trình cá nhân",
    privacy: "Bảo mật riêng tư",
    copyright: "Grateful Forum. Lan tỏa lòng biết ơn mỗi ngày.",
    write: "Viết lời biết ơn",
  },
  en: {
    badgesTitle: "Recognize your practice rhythm",
    badgesCopy: "Badges acknowledge the ways you keep writing and spreading gratitude. They are reminders to continue, not a race.",
    communityTitle: "Gratitude timeline",
    communityCopy: "Read what others are grateful for, and let one small share brighten your day.",
    ctaEyebrow: "🌱 Join the ripple",
    ctaTitle: "Write one gratitude note to brighten today for you and someone else.",
    ctaCopy: "Start with one small thing. Share it with the community or keep it as part of your own path.",
    mascotTitle: "Be Mam waves hello",
    mascotCopy: "Share when you are ready",
    footerTagline: "• Where gratitude spreads every day",
    practice: "Practice",
    badges: "Badges",
    journey: "Personal path",
    privacy: "Privacy",
    copyright: "Grateful Forum. Spreading gratitude every day.",
    write: "Write gratitude",
  },
} as const;

function repeatMarqueeItems<T>(items: readonly T[], cycles: number) {
  return Array.from({ length: cycles }, () => items).flat();
}

export function BadgesSection() {
  const locale = useLocale() as "vi" | "en";
  const copy = bottomCopy[locale];
  const marqueeBadges = repeatMarqueeItems(locale === "en" ? badgeDataEn : badgeData, BADGE_MARQUEE_CYCLES);
  const reduceMotion = useLandingReducedMotion();
  return (
    <Reveal>
      <section className="mx-auto w-full scroll-mt-24 py-16 lg:scroll-mt-28 lg:py-24" id="milestones">
        <div className="mx-auto max-w-md px-4 lg:max-w-7xl lg:px-margin-desktop">
          <SectionHeader copy={copy.badgesCopy} title={copy.badgesTitle} />
        </div>
        <div className="landing-badge-marquee-mask overflow-hidden">
          <div className="landing-badge-marquee flex w-max">
            {Array.from({ length: MARQUEE_GROUPS }).map((_, groupIndex) => (
              <div aria-hidden={groupIndex > 0} className="flex shrink-0 gap-3 pr-3 lg:gap-6 lg:pr-6" key={groupIndex}>
                {marqueeBadges.map((item, index) => (
                  <motion.div className={`landing-zen-glass-card relative flex w-[260px] shrink-0 flex-col items-center rounded-2xl p-3 text-center lg:w-[280px] lg:rounded-3xl lg:p-6 ${item.unlocked ? "" : "opacity-85"}`} key={`${item.title}-${groupIndex}-${index}`} {...tapLift(Boolean(reduceMotion))}>
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-xl shadow-xs lg:h-16 lg:w-16 lg:text-3xl">{item.icon}</div>
                    <span className={`mb-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase lg:text-[10px] ${item.unlocked ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"}`}>{item.status}</span>
                    <h3 className="text-xs font-bold text-text-deep lg:text-base">{item.title}</h3>
                    <p className="mb-4 mt-0.5 text-[10px] leading-snug text-on-surface-variant lg:text-xs">{item.copy}</p>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

export function CommunitySection() {
  const locale = useLocale() as "vi" | "en";
  const copy = bottomCopy[locale];
  const marqueeCards = repeatMarqueeItems(locale === "en" ? feedCardsEn : feedCards, COMMUNITY_MARQUEE_CYCLES);

  return (
    <Reveal>
      <section className="w-full scroll-mt-24 py-16 lg:scroll-mt-28" id="community">
        <div className="mx-auto max-w-md px-4 lg:max-w-7xl lg:px-margin-desktop">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="mb-1 text-2xl font-bold text-text-deep sm:text-3xl">{copy.communityTitle}</h2>
              <p className="text-sm text-on-surface-variant">{copy.communityCopy}</p>
            </div>
          </div>
        </div>
        <div className="landing-community-marquee-mask overflow-hidden">
          <div className="landing-community-marquee flex w-max">
            {Array.from({ length: MARQUEE_GROUPS }).map((_, groupIndex) => (
              <div aria-hidden={groupIndex > 0} className="flex shrink-0 gap-4 pr-4 lg:gap-6 lg:pr-6" key={groupIndex}>
                {marqueeCards.map((item, index) => (
                  <div className="w-[300px] shrink-0 sm:w-[360px] lg:w-[380px]" key={`${item.name}-${groupIndex}-${index}`}>
                    <TestimonialCard {...item} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

export function BottomCta() {
  const copy = bottomCopy[useLocale() as "vi" | "en"];

  return (
    <Reveal>
      <section className="mx-auto w-full max-w-md px-4 py-16 lg:max-w-7xl lg:px-margin-desktop lg:py-24">
        <div className="landing-zen-glass-emerald relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl p-8 md:flex-row lg:p-14">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-3 py-1 text-xs font-bold text-primary shadow-xs backdrop-blur-md">{copy.ctaEyebrow}</div>
            <h2 className="mb-3 text-2xl font-bold leading-tight text-text-deep sm:text-3xl lg:text-4xl">{copy.ctaTitle}</h2>
            <p className="mb-6 text-sm leading-relaxed text-on-surface-variant sm:text-base">{copy.ctaCopy}</p>
            <ShimmerButton label={copy.write} />
          </div>
          <div className="flex w-64 shrink-0 flex-col items-center rounded-2xl border border-white/80 bg-white/85 p-6 text-center shadow-xs backdrop-blur-md">
            <Image alt="" className="landing-mascot-breathe mb-2 h-16 w-16 rounded-2xl object-cover shadow-inner" height={64} src="/stitch/landing/mascot.png" width={64} />
            <span className="text-sm font-bold text-text-deep">{copy.mascotTitle}</span>
            <span className="mt-1 text-[11px] text-on-surface-variant">{copy.mascotCopy}</span>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

export function Footer() {
  const copy = bottomCopy[useLocale() as "vi" | "en"];

  return (
    <footer className="w-full border-t border-white/80 bg-white/60 py-10 backdrop-blur-md">
      <div className="mx-auto flex max-w-md flex-col items-center justify-between gap-6 px-4 lg:max-w-7xl lg:flex-row lg:px-margin-desktop">
        <div className="flex items-center gap-3">
          <Image alt="" className="h-8 w-8 rounded-xl" height={32} src="/stitch/landing/mascot.png" width={32} />
          <span className="text-sm font-bold text-text-deep">Grateful Forum</span>
          <span className="hidden text-xs text-on-surface-variant sm:inline">{copy.footerTagline}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-on-surface-variant">
          <a className="hover:text-primary" href="#garden-spotlight">{copy.practice}</a>
          <a className="hover:text-primary" href="#milestones">{copy.badges}</a>
          <a className="hover:text-primary" href="#journal-flipbook">{copy.journey}</a>
          <a className="hover:text-primary" href="#">{copy.privacy}</a>
        </div>
        <p className="text-xs text-on-surface-variant/80">{copy.copyright}</p>
      </div>
    </footer>
  );
}

function ShimmerButton({ label }: Readonly<{ label: string }>) {
  const locale = useLocale();
  return (
    <ShimmerCTA className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gradient-start to-gradient-end px-7 py-3.5 text-base font-bold text-on-primary shadow-md" href={loginHref("/write", locale)}>
      {label}
      <MaterialSymbol className="text-[20px]" name="edit_note" />
    </ShimmerCTA>
  );
}
