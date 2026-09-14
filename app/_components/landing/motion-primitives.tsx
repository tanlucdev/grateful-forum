"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

import { MaterialSymbol } from "@/components/ui/material-symbol";

export const landingEase = [0.16, 1, 0.3, 1] as const;

export function useLandingReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return reduceMotion;
}

export function tapLift(reduceMotion = false) {
  return reduceMotion
    ? { transition: { duration: 0.01 } }
    : {
        transition: { duration: 0.28, ease: landingEase },
        whileHover: { y: -2 },
        whileTap: { scale: 0.98, y: 1 },
      };
}

export function softPress(reduceMotion = false) {
  return reduceMotion
    ? { transition: { duration: 0.01 } }
    : {
        transition: { duration: 0.22, ease: landingEase },
        whileHover: { y: -1 },
        whileTap: { scale: 0.97, y: 1 },
      };
}

export function activeChip(reduceMotion = false) {
  return reduceMotion
    ? { transition: { duration: 0.01 } }
    : {
        transition: { duration: 0.26, ease: landingEase },
      };
}

export function Reveal({
  children,
  className = "",
}: Readonly<{ children: ReactNode; className?: string }>) {
  const reduceMotion = useLandingReducedMotion();

  return (
    <motion.div
      className={`landing-reveal ${className}`.trim()}
      initial={false}
      transition={reduceMotion ? { duration: 0.01 } : { duration: 0.45, ease: "easeOut" }}
      viewport={{ amount: 0.26, once: true }}
      whileInView={reduceMotion ? { opacity: 1 } : { y: 0 }}
    >
      {children}
    </motion.div>
  );
}

export function ProgressBar({
  className = "bg-primary",
  delay = 0,
  value,
}: Readonly<{ className?: string; delay?: number; value: number }>) {
  return (
    <motion.div
      className={`${className} h-full rounded-full`}
      initial={{ scaleX: 0 }}
      style={{ transformOrigin: "left center" }}
      transition={{ delay, duration: 0.7, ease: "easeOut" }}
      viewport={{ amount: 0.4, once: true }}
      whileInView={{ scaleX: value }}
    />
  );
}

export function LiveDot() {
  return (
    <motion.span
      className="h-1.5 w-1.5 rounded-full bg-primary"
      animate={{ opacity: [1, 0.4, 1] }}
      transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
    />
  );
}

export function ShimmerCTA({
  children,
  className = "",
  href,
}: Readonly<{ children: ReactNode; className?: string; href: string }>) {
  const reduceMotion = useLandingReducedMotion();

  return (
    <motion.a className={`group relative overflow-hidden ${className}`} href={href} {...tapLift(Boolean(reduceMotion))}>
      <span className="relative z-30 inline-flex items-center gap-2">{children}</span>
      <span aria-hidden="true" className="landing-cta-shine pointer-events-none absolute -inset-y-2 left-[-55%] z-20 w-1/2 -skew-x-12" />
    </motion.a>
  );
}

export function SectionHeader({ copy, eyebrow, title }: Readonly<{ copy: string; eyebrow?: string; title: string }>) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow ? <span className="mb-2 inline-flex rounded-full border border-emerald-200/70 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary shadow-xs backdrop-blur-md">{eyebrow}</span> : null}
      <h2 className="mb-2 text-2xl font-bold text-text-deep sm:text-3xl lg:text-4xl">{title}</h2>
      <p className="text-sm leading-relaxed text-on-surface-variant sm:text-base">{copy}</p>
    </div>
  );
}

export function LiftCard({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  const reduceMotion = useLandingReducedMotion();

  return (
    <motion.div className={`landing-zen-glass-card group relative flex flex-col justify-between overflow-hidden rounded-3xl p-7 ${className}`} {...tapLift(Boolean(reduceMotion))}>
      <div className="pointer-events-none absolute inset-0 opacity-0 shadow-[0_20px_45px_-10px_rgba(0,109,67,0.15)] transition-opacity group-hover:opacity-100" />
      {children}
    </motion.div>
  );
}

export function CardTop({
  children,
  icon,
  iconClass = "",
  status,
  statusClass,
  statusIcon,
}: Readonly<{
  children: ReactNode;
  icon: string;
  iconClass?: string;
  status: string;
  statusClass: string;
  statusIcon: string;
}>) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9cf5c0] to-[#6ee7b7] text-primary shadow-[0_4px_12px_rgba(0,109,67,0.15)]">
          {icon.startsWith("🌸") ? <span className={iconClass}>{icon}</span> : <MaterialSymbol className={iconClass} name={icon} />}
        </div>
        <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-xs ${statusClass}`}>
          <MaterialSymbol className="text-[13px]" name={statusIcon} />
          {status}
        </span>
      </div>
      {children}
    </div>
  );
}

export function ProgressBlock({ label, progress, value }: Readonly<{ label: string; progress: number; value: string }>) {
  return (
    <div className="mb-4 rounded-2xl border border-emerald-100/80 bg-white/90 p-4 shadow-inner">
      <div className="mb-2 flex items-center justify-between text-xs text-on-surface-variant">
        <span className="flex items-center gap-1 font-bold text-text-deep"><MaterialSymbol className="text-[15px] text-primary" name="vpn_key" /> {label}</span>
        <span className="font-semibold text-primary">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-white">
        <ProgressBar value={progress} />
      </div>
    </div>
  );
}

export function CardFooter({ copy, icon, iconFill = false, textClass = "text-primary" }: Readonly<{ copy: string; icon: string; iconFill?: boolean; textClass?: string }>) {
  return (
    <div className={`flex items-center justify-between border-t border-surface-container pt-4 text-xs font-bold ${textClass}`}>
      <span>{copy}</span>
      <MaterialSymbol className="text-[18px]" fill={iconFill} name={icon} />
    </div>
  );
}

export function Metric({ icon, title, value }: Readonly<{ icon: string; title: string; value: string }>) {
  return (
    <div className="landing-zen-glass-card flex items-center gap-2.5 rounded-2xl px-4 py-2.5 shadow-xs">
      <span className="landing-mascot-breathe text-xl">{icon}</span>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-text-deep">{title}</span>
        <span className="text-[10px] text-on-surface-variant">{value}</span>
      </div>
    </div>
  );
}

export function Spine() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-20 hidden w-10 -translate-x-1/2 flex-col items-center justify-between bg-gradient-to-r from-black/10 via-transparent to-black/10 py-6 md:flex">
      <div className="flex h-full w-px flex-col items-center justify-around border-l-2 border-dashed border-[#cbbfb0]/80">
        {Array.from({ length: 5 }).map((_, index) => (
          <span className="h-2.5 w-2.5 rounded-full border border-[#b8ab97] bg-[#d7cebf] shadow-inner" key={index} />
        ))}
      </div>
    </div>
  );
}

export function MoodButton({
  active,
  icon,
  label,
  onClick,
}: Readonly<{ active: boolean; icon: string; label: string; onClick: () => void }>) {
  const reduceMotion = useLandingReducedMotion();

  return (
    <motion.button
      className={`relative flex min-h-10 min-w-0 flex-row items-center justify-center gap-1 overflow-hidden rounded-xl px-3 py-2 text-center text-xs font-bold sm:flex-col sm:rounded-2xl sm:p-2.5 ${active ? "text-on-primary" : "border border-emerald-100 bg-white/85 text-text-deep shadow-xs"}`}
      onClick={onClick}
      type="button"
      {...softPress(Boolean(reduceMotion))}
    >
      {active ? <motion.span className="absolute inset-0 rounded-2xl bg-primary shadow-xs" layoutId="mood-indicator" {...activeChip(Boolean(reduceMotion))} /> : null}
      <span className="relative text-base sm:text-lg">{icon}</span>
      <span className="relative max-w-full truncate">{label}</span>
    </motion.button>
  );
}

export function TestimonialCard({
  avatar,
  name,
  quote,
  tag,
  time,
}: Readonly<{
  avatar: string;
  name: string;
  quote: string;
  tag: string;
  time: string;
}>) {
  const reduceMotion = useLandingReducedMotion();

  return (
    <motion.div className="landing-zen-glass-card group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6" {...tapLift(Boolean(reduceMotion))}>
      <div className="pointer-events-none absolute inset-0 opacity-0 shadow-[0_18px_42px_rgba(26,47,43,0.10)] transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-mint text-xs font-bold text-primary">{avatar}</div>
            <div>
              <span className="block text-xs font-bold text-text-deep">{name}</span>
              <span className="text-[10px] text-on-surface-variant">{time}</span>
            </div>
          </div>
          <span className="rounded-full bg-primary-fixed/40 px-2 py-0.5 text-[10px] font-bold text-primary">{tag}</span>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-text-deep">&ldquo;{quote}&rdquo;</p>
      </div>
      <div className="relative flex items-center justify-between border-t border-surface-container pt-3">
        <motion.span className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80" {...softPress(Boolean(reduceMotion))}>
          <MaterialSymbol className="text-[16px]" fill name="favorite" /> Đồng cảm
        </motion.span>
        <motion.span className="inline-flex items-center gap-1 text-xs font-medium text-on-surface-variant hover:text-primary" {...softPress(Boolean(reduceMotion))}>
          <MaterialSymbol className="text-[15px]" name="spa" /> Gửi lời cảm ơn
        </motion.span>
      </div>
    </motion.div>
  );
}
