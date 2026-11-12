"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { JournalEntry } from "@/lib/profile/types";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { type ProfileView, profileAssets, visibilityLabel } from "../profile-view";
import { ProfileShareModalButton } from "../profile-share-modal-client";

export function MilestoneCard({ view }: Readonly<{ view: ProfileView }>) {
  const t = useTranslations("profile");
  return (
    <section className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-xl bg-gradient-to-r from-muted via-accent/30 to-secondary p-6 shadow-sm lg:p-8 xl:flex-row">
      <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-accent/20 blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="z-10 flex items-center gap-6 text-left">
        <div
          className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-card bg-contain bg-center bg-no-repeat p-2 shadow-md"
          style={{ backgroundImage: `url(${profileAssets.mascot})` }}
        >
          <span className="absolute -right-1 -top-1 rounded-full bg-[var(--fire-soft)] p-1 text-[var(--fire)] shadow-sm">
            <MaterialSymbol className="text-xs" fill name="stars" />
          </span>
        </div>
        <div className="max-w-xl space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold leading-[14px] tracking-[0.04em] text-primary">
            <MaterialSymbol className="text-sm" fill name="military_tech" />
            {t("milestone.badge", { count: 3 })}
          </span>
          <h2 className="text-xl font-semibold leading-7 text-foreground">
            {t("milestone.title")}
          </h2>
          <p className="text-sm leading-5 text-muted-foreground">
            {t("milestone.description")}
          </p>
        </div>
      </div>
      <div className="z-10 grid w-full grid-cols-2 gap-3 sm:w-auto">
        <Link className="inline-flex min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-primary to-[var(--leaf-deep)] px-5 py-3 text-xs font-semibold leading-4 text-primary-foreground shadow-md" href="/write">
          <MaterialSymbol className="text-sm" name="edit_note" />
          {t("milestone.write")}
        </Link>
        <ProfileShareModalButton view={view} />
      </div>
    </section>
  );
}

export function Pill({
  icon,
  text,
  tone = "plain",
}: Readonly<{ icon: string; text: string; tone?: "plain" | "fire" }>) {
  const className =
    tone === "fire"
      ? "bg-[var(--fire-soft)]/70 text-[var(--fire)] shadow-sm"
      : "bg-muted text-muted-foreground";

  return (
    <span className={`inline-flex min-w-0 items-center gap-1.5 rounded-xl px-3 py-1.5 ${className}`}>
      <MaterialSymbol className={`text-base ${tone === "fire" ? "text-[var(--fire)]" : "text-primary"}`} fill name={icon} />
      <span className="text-xs font-medium leading-4 tracking-[0.04em]">{text}</span>
    </span>
  );
}

export function DesktopTab({
  active = false,
  count,
  label,
}: Readonly<{ active?: boolean; count: number; label: string }>) {
  return (
    <button className={`relative flex items-center gap-2 pb-3 text-xl font-semibold leading-7 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium leading-[14px] ${active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
        {count}
      </span>
      {active ? <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" /> : null}
    </button>
  );
}

export function EntryImage({
  image,
  label,
  labelAt,
}: Readonly<{ image: string; label: string; labelAt: string }>) {
  return (
    <div
      className="relative h-44 overflow-hidden rounded-xl bg-secondary bg-cover bg-center transition-transform duration-(--motion-feedback) group-hover:scale-[1.01]"
      style={{ backgroundImage: `url(${image})` }}
    >
      <span className={`absolute ${labelAt === "top" ? "left-3 top-3" : "bottom-3 right-3"} inline-flex items-center gap-1 rounded-full bg-card/80 px-2.5 py-1 text-[11px] font-medium leading-[14px] text-foreground shadow-sm backdrop-blur-md`}>
        <MaterialSymbol className="text-xs text-primary" fill name={labelAt === "top" ? "favorite" : "headphones"} />
        {label}
      </span>
    </div>
  );
}

export function MilestoneMini() {
  return (
    <div className="space-y-2 rounded-xl bg-accent/30 p-4">
      <div className="flex items-center gap-2 text-primary">
        <MaterialSymbol className="text-sm" fill name="task_alt" />
        <span className="text-xs font-semibold leading-4 tracking-[0.04em]">Cột mốc hoàn thành</span>
      </div>
      <p className="text-[11px] font-medium leading-[14px] text-muted-foreground">
        Đã gửi toàn bộ tài liệu dự án trước 18:00
      </p>
    </div>
  );
}

export function EntryActions({
  comments,
  likes,
  visibility,
}: Readonly<{ comments: number; likes: number; visibility: JournalEntry["visibility"] }>) {
  return (
    <div className="mt-4 flex items-center justify-between bg-card pt-5">
      <div className="flex items-center gap-3 text-muted-foreground">
        <SmallAction count={likes} icon="favorite" />
        <SmallAction count={comments} icon="chat_bubble" />
      </div>
      <span className={`rounded-md px-2 py-1 text-[11px] font-medium leading-[14px] ${visibility === "private" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
        {visibilityLabel(visibility)}
      </span>
    </div>
  );
}

export function Avatar({ className, src }: Readonly<{ className: string; src: string }>) {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 rounded-full bg-secondary bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}

export function Tag({ text }: Readonly<{ text: string }>) {
  return (
    <span className="rounded-lg bg-muted px-2.5 py-1 text-[11px] font-medium leading-[14px] text-muted-foreground">
      {text}
    </span>
  );
}

function SmallAction({ count, icon }: Readonly<{ count: number; icon: string }>) {
  return (
    <button className="flex items-center gap-1 transition-colors hover:text-[var(--fire)]">
      <MaterialSymbol className="text-lg" name={icon} />
      <span className="text-[11px] font-medium leading-[14px]">{count}</span>
    </button>
  );
}
