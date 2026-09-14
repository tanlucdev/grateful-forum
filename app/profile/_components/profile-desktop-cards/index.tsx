import Link from "next/link";
import type { JournalEntry } from "@/lib/profile/types";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { type ProfileView, profileAssets, visibilityLabel } from "../profile-view";
import { ProfileShareModalButton } from "../profile-share-modal-client";

export function MilestoneCard({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <section className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-xl bg-gradient-to-r from-[#eef5f2] via-[#d1e9e0]/30 to-[#e8efec] p-8 shadow-sm md:flex-row">
      <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-[#99f3b6]/20 blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#80d8a5]/20 blur-3xl" />
      <div className="z-10 flex items-center gap-6 text-left">
        <div
          className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white bg-contain bg-center bg-no-repeat p-2 shadow-md"
          style={{ backgroundImage: `url(${profileAssets.mascot})` }}
        >
          <span className="absolute -right-1 -top-1 rounded-full bg-[#ffdad8] p-1 text-[#852229] shadow-sm">
            <MaterialSymbol className="text-xs" fill name="stars" />
          </span>
        </div>
        <div className="max-w-xl space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4ca374]/20 px-3 py-1 text-xs font-semibold leading-4 tracking-[0.04em] text-[#006d43]">
            <MaterialSymbol className="text-sm" fill name="military_tech" />
            Cột mốc 3 ngày
          </span>
          <h2 className="text-2xl font-semibold leading-8 text-[#1a2f2b]">
            Bé Mầm đang lớn dần cùng bạn!
          </h2>
          <p className="text-base leading-6 text-[#3d4a41]">
            Mầm đang lớn lên từng ngày nhờ những suy nghĩ tích cực của bạn! Hãy duy trì thói quen viết ít nhất 1 điều biết ơn mỗi ngày để mở khóa cấp độ Mầm Xanh nhé.
          </p>
        </div>
      </div>
      <div className="z-10 flex w-full items-center gap-3 sm:w-auto">
        <Link className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#006d43] to-[#006d3d] px-5 py-3 text-sm font-semibold leading-5 text-white shadow-md sm:w-auto" href="/write">
          <MaterialSymbol className="text-sm" name="edit_note" />
          Viết thêm hôm nay
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
      ? "bg-[#ffdad8]/70 text-[#852229] shadow-sm"
      : "bg-[#eef5f2] text-[#3d4a41]";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 ${className}`}>
      <MaterialSymbol className={`text-base ${tone === "fire" ? "text-[#a5393e]" : "text-[#006d43]"}`} fill name={icon} />
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
    <button className={`relative flex items-center gap-2 pb-3 text-xl font-semibold leading-7 transition-colors ${active ? "text-[#006d43]" : "text-[#3d4a41]"}`}>
      <span>{label}</span>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium leading-[14px] ${active ? "bg-[#006d43]/10 text-[#006d43]" : "bg-[#e8efec] text-[#3d4a41]"}`}>
        {count}
      </span>
      {active ? <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#006d43]" /> : null}
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
      className="relative h-44 overflow-hidden rounded-xl bg-[#e8efec] bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.01]"
      style={{ backgroundImage: `url(${image})` }}
    >
      <span className={`absolute ${labelAt === "top" ? "left-3 top-3" : "bottom-3 right-3"} inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium leading-[14px] text-[#161d1b] shadow-sm backdrop-blur-md`}>
        <MaterialSymbol className="text-xs text-[#006d43]" fill name={labelAt === "top" ? "favorite" : "headphones"} />
        {label}
      </span>
    </div>
  );
}

export function MilestoneMini() {
  return (
    <div className="space-y-2 rounded-xl bg-[#d1e9e0]/30 p-4">
      <div className="flex items-center gap-2 text-[#006d43]">
        <MaterialSymbol className="text-sm" fill name="task_alt" />
        <span className="text-xs font-semibold leading-4 tracking-[0.04em]">Cột mốc hoàn thành</span>
      </div>
      <p className="text-[11px] font-medium leading-[14px] text-[#3d4a41]">
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
    <div className="mt-4 flex items-center justify-between bg-white pt-5">
      <div className="flex items-center gap-3 text-[#3d4a41]">
        <SmallAction count={likes} icon="favorite" />
        <SmallAction count={comments} icon="chat_bubble" />
      </div>
      <span className={`rounded-md px-2 py-1 text-[11px] font-medium leading-[14px] ${visibility === "private" ? "bg-[#eef5f2] text-[#3d4a41]" : "bg-[#006d43]/10 text-[#006d43]"}`}>
        {visibilityLabel(visibility)}
      </span>
    </div>
  );
}

export function Avatar({ className, src }: Readonly<{ className: string; src: string }>) {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 rounded-full bg-[#e8efec] bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${src})` }}
    />
  );
}

export function Tag({ text }: Readonly<{ text: string }>) {
  return (
    <span className="rounded-lg bg-[#eef5f2] px-2.5 py-1 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
      {text}
    </span>
  );
}

function SmallAction({ count, icon }: Readonly<{ count: number; icon: string }>) {
  return (
    <button className="flex items-center gap-1 transition-colors hover:text-[#a5393e]">
      <MaterialSymbol className="text-lg" name={icon} />
      <span className="text-[11px] font-medium leading-[14px]">{count}</span>
    </button>
  );
}
