import Link from "next/link";
import type { JournalEntry } from "@/lib/profile/types";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ProfileAvatarMenu } from "./ProfileAvatarMenuClient";
import { ProfileEditModalButton } from "./ProfileModalsClient";
import {
  Avatar,
  DesktopTab,
  EntryActions,
  EntryImage,
  MilestoneCard,
  MilestoneMini,
  Pill,
  Tag,
} from "./ProfileDesktopCards";
import { formatRelative, profileAssets, type ProfileView } from "./profile-view";

export function DesktopProfile({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <div className="hidden min-h-svh flex-col bg-[#f4fbf8] md:flex">
      <DesktopHeader view={view} />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 pt-16">
        <div className="flex w-full flex-col space-y-8 py-8">
          <DesktopHero view={view} />
          <DesktopJournal view={view} />
          <MilestoneCard view={view} />
          <RhythmCard />
        </div>
      </main>
    </div>
  );
}

function DesktopHeader({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#f4fbf8]/85 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <Link className="flex items-center gap-2" href="/feed">
            <MaterialSymbol className="text-2xl text-[#006d43]" name="eco" />
            <span className="text-xl font-semibold leading-7 tracking-tight text-[#006d43]">
              BeGrateful
            </span>
          </Link>
          <span className="rounded-full bg-[#e8efec] px-2.5 py-1 text-[11px] font-medium leading-[14px] text-[#3d4a41] shadow-[0_1px_4px_rgba(26,47,43,0.04)]">
            Mầm
          </span>
        </div>
        <nav className="flex items-center gap-1.5 rounded-xl bg-[#eef5f2] p-1">
          <Link className="inline-flex h-10 items-center rounded-lg px-3.5 text-sm font-semibold leading-5 text-[#3d4a41]" href="/feed">
            Feed
          </Link>
          <Link className="inline-flex h-10 items-center rounded-lg px-3.5 text-sm font-semibold leading-5 text-[#3d4a41]" href="/write">
            Viết nhật ký
          </Link>
          <Link
            aria-current="page"
            className="inline-flex h-10 items-center rounded-lg bg-[#4ca374] px-3.5 text-sm font-semibold leading-5 text-[#00331d]"
            href="/profile"
          >
            Cá nhân
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffdad8]/60 px-3 py-1.5 text-xs font-medium leading-4 text-[#852229]">
            <MaterialSymbol className="text-lg text-[#a5393e]" fill name="local_fire_department" />
            {view.streak} ngày liên tiếp
          </span>
          <ProfileAvatarMenu view={view} />
        </div>
      </div>
    </header>
  );
}

function DesktopHero({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <section className="relative overflow-hidden rounded-xl bg-white p-8 shadow-sm">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#d1e9e0]/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-[#99f3b6]/30 blur-2xl" />
      <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-[#006d43] to-[#99f3b6] p-1 shadow-md">
              <Avatar className="h-full w-full" src={view.avatarDesktop} />
            </div>
            <span className="absolute -bottom-1 -right-1 flex rounded-full bg-[#006d43] p-1 text-white shadow-sm">
              <MaterialSymbol className="text-sm" fill name="eco" />
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold leading-8 text-[#161d1b]">
                {view.displayName}
              </h1>
              <span className="rounded-full bg-[#99f3b6] px-2.5 py-0.5 text-[11px] font-medium leading-[14px] text-[#0b7141]">
                Tâm Hồn An Yên
              </span>
            </div>
            <p className="max-w-md text-base leading-6 text-[#3d4a41]">{view.bio}</p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Pill icon="spa" text={`${view.entryCount} điều biết ơn đã ghi`} />
              <Pill icon="local_fire_department" text={`${view.streak} ngày liên tiếp`} tone="fire" />
              <Pill icon="nest_eco_leaf" text="Đồng hành cùng Bé Mầm 14 ngày" />
            </div>
          </div>
        </div>
        <div className="self-end md:self-center">
          <ProfileEditModalButton view={view} />
        </div>
      </div>
    </section>
  );
}

function DesktopJournal({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <section className="flex flex-col space-y-6">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-6">
          <DesktopTab active count={view.entryCount} label="Tất cả nhật ký" />
          <DesktopTab count={view.publicCount} label="Công khai" />
          <DesktopTab count={4} label="Bộ sưu tập khoảnh khắc" />
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-[#eef5f2] p-1">
          <button className="rounded-lg bg-white p-1.5 text-[#006d43] shadow-sm" title="Dạng lưới">
            <MaterialSymbol className="text-xl" name="grid_view" />
          </button>
          <button className="rounded-lg p-1.5 text-[#3d4a41]" title="Dạng danh sách">
            <MaterialSymbol className="text-xl" name="format_list_bulleted" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {view.entries.slice(0, 3).map((entry, index) => (
          <DesktopEntryCard entry={entry} index={index} key={entry.id} />
        ))}
      </div>
    </section>
  );
}

function DesktopEntryCard({
  entry,
  index,
}: Readonly<{ entry: JournalEntry; index: number }>) {
  const media =
    index === 0
      ? { image: profileAssets.coffeeDesktop, label: "Gia đình", labelAt: "top" }
      : index === 2
        ? { image: profileAssets.park, label: "Lofi Autumn", labelAt: "bottom" }
        : null;

  return (
    <article className="group flex flex-col justify-between rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${index === 1 ? "bg-[#80d99e]" : index === 2 ? "bg-[#bccabe]" : "bg-[#006d43]"}`} />
            <span className="text-xs font-medium leading-4 tracking-[0.04em] text-[#3d4a41]">
              {formatRelative(entry.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MaterialSymbol className={`text-lg ${index === 1 ? "text-indigo-400" : index === 2 ? "text-teal-600" : "text-amber-500"}`} fill name={index === 1 ? "bedtime" : index === 2 ? "air" : "wb_sunny"} />
            <button className="rounded-full p-1 text-[#3d4a41] transition-colors hover:text-[#161d1b]" title="Thêm tùy chọn">
              <MaterialSymbol className="text-base" name="more_horiz" />
            </button>
          </div>
        </div>
        {media ? <EntryImage {...media} /> : <MilestoneMini />}
        <p className="[display:-webkit-box] overflow-hidden text-base leading-6 text-[#161d1b] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {entry.content}
        </p>
        {index === 1 ? (
          <div className="flex flex-wrap gap-1.5 pt-2">
            <Tag text="#congviec" />
            <Tag text="#nỗlực" />
          </div>
        ) : null}
      </div>
      <EntryActions comments={index === 0 ? 2 : index === 2 ? 5 : 0} likes={index === 0 ? 14 : index === 2 ? 23 : 9} visibility={entry.visibility} />
    </article>
  );
}

function RhythmCard() {
  return (
    <section className="flex items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef5f2] text-[#006d43]">
          <MaterialSymbol fill name="calendar_month" />
        </span>
        <div>
          <h3 className="text-xl font-semibold leading-7 text-[#161d1b]">Nhịp điệu biết ơn</h3>
          <p className="text-xs font-medium leading-4 text-[#3d4a41]">
            Bạn đã hoàn thành 85% mục tiêu tháng 10
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] ${index < 3 ? "bg-[#006d43] font-bold text-white" : "bg-[#e3eae7] text-[#3d4a41]"}`}
            key={day}
          >
            {day}
          </span>
        ))}
      </div>
    </section>
  );
}
