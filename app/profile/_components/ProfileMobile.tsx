import Link from "next/link";
import type { JournalEntry } from "@/lib/profile/types";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Avatar } from "./ProfileDesktopCards";
import { formatRelative, profileAssets, type ProfileView } from "./profile-view";

export function MobileProfile({ view }: Readonly<{ view: ProfileView }>) {
  return (
    <div className="min-h-svh bg-[#f4fbf8] md:hidden">
      <MobileHeader />
      <main className="relative w-full bg-[#f4fbf8] px-5 pb-24 pt-16">
        <section className="relative flex flex-col items-center pb-4 pt-8">
          <div className="pointer-events-none absolute inset-x-0 top-[-64px] z-0 h-64 rounded-b-[40px] bg-gradient-to-b from-[#006d43]/10 via-[#006d43]/5 to-transparent" />
          <div className="relative mb-4">
            <Avatar className="relative z-10 h-24 w-24 border-4 border-[#f4fbf8] shadow-[0_4px_12px_rgba(0,109,67,0.15)]" src={view.avatarMobile} />
            <button className="absolute bottom-0 right-0 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#dde4e1] text-[#3d4a41] shadow-sm">
              <MaterialSymbol className="text-[16px]" name="edit" />
            </button>
          </div>
          <h1 className="mb-1 text-[28px] font-bold leading-9 tracking-tight text-[#161d1b]">
            {view.displayName === "Minh Trần" ? "Minh Tran" : view.displayName}
          </h1>
          <p className="max-w-[280px] text-center text-base leading-6 text-[#3d4a41]">
            {view.bio === "Tìm niềm vui trong những điều nhỏ bé mỗi ngày 🌿"
              ? "Tìm niềm vui trong những điều nhỏ bé mỗi ngày 🌻"
              : view.bio}
          </p>
          <div className="mt-6 flex flex-row items-center justify-center gap-3">
            <MobileStat icon="favorite" text={`${view.publicCount} điều biết ơn`} />
            <MobileStat text={`${view.streak} ngày liên tiếp`} emoji="🔥" />
          </div>
        </section>
        <MobileTabs />
        <div className="mt-6 flex flex-col gap-4 pb-4">
          {view.entries.slice(0, 2).map((entry, index) => (
            <MobileEntryCard entry={entry} index={index} key={entry.id} />
          ))}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}

function MobileHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#f4fbf8]/80 pt-[env(safe-area-inset-top)] shadow-[0_1px_8px_rgba(26,47,43,0.02)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <MaterialSymbol className="text-[26px] text-[#006d43]" name="eco" />
          <span className="text-xl font-semibold leading-7 text-[#006d43]">Profile</span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#006d43] text-white">
          <MaterialSymbol className="text-[18px]" name="person" />
        </div>
      </div>
    </header>
  );
}

function MobileEntryCard({
  entry,
  index,
}: Readonly<{ entry: JournalEntry; index: number }>) {
  return (
    <article className="group flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(26,47,43,0.03)] transition-shadow hover:shadow-[0_4px_16px_rgba(26,47,43,0.06)]">
      <div className="mb-2 flex items-start justify-between">
        <span className="rounded-md bg-[#eef5f2] px-2.5 py-1 text-xs font-medium leading-4 tracking-[0.04em] text-[#3d4a41]">
          {formatRelative(entry.createdAt)}
        </span>
        <button className="-m-1 p-1 text-[#3d4a41] transition-colors hover:text-[#006d43]">
          <MaterialSymbol className="text-[20px]" name="more_vert" />
        </button>
      </div>
      <p className="[display:-webkit-box] mb-3 overflow-hidden text-lg leading-7 text-[#161d1b] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
        {entry.content}
      </p>
      {index === 0 ? (
        <div
          className="mb-3 h-32 w-full rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${profileAssets.coffeeMobile})` }}
        />
      ) : null}
      <div className="mt-auto flex items-center gap-4 border-t border-[#eef5f2]/50 pt-2">
        <MobileAction count={index === 0 ? 24 : 15} icon="favorite" />
        <MobileAction count={index === 0 ? 3 : 0} icon="chat_bubble_outline" />
      </div>
    </article>
  );
}

function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 bg-[#f4fbf8]/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-1px_8px_rgba(26,47,43,0.04)] backdrop-blur-xl">
      <div className="relative flex h-16 items-center justify-around px-4">
        <MobileNavItem href="/feed" icon="grid_view" label="Feed" />
        <div className="-mt-10 flex flex-col items-center">
          <Link className="flex h-14 w-14 items-center justify-center rounded-full bg-[#006d43] text-white shadow-[0_4px_12px_rgba(0,109,67,0.25)] active:scale-95" href="/write">
            <MaterialSymbol className="text-[28px]" name="eco" />
          </Link>
          <span className="mt-1 text-[11px] font-medium leading-[14px] text-[#3d4a41]">Write</span>
        </div>
        <MobileNavItem active href="/profile" icon="person_outline" label="Cá nhân" />
      </div>
    </nav>
  );
}

function MobileTabs() {
  return (
    <div className="mt-8 flex flex-row gap-4 border-b border-[#e3eae7] px-2">
      <button className="relative flex flex-1 items-center justify-center gap-2 pb-3">
        <span className="text-sm font-semibold leading-5 tracking-[0.02em] text-[#006d43]">Công khai</span>
        <span className="absolute bottom-0 left-1/2 h-[3px] w-full -translate-x-1/2 rounded-t-full bg-[#006d43]" />
      </button>
      <button className="flex flex-1 items-center justify-center gap-2 rounded-t-lg pb-3 transition-colors hover:bg-[#eef5f2]/50">
        <span className="text-sm font-semibold leading-5 tracking-[0.02em] text-[#3d4a41]">Nhật ký của tôi</span>
      </button>
    </div>
  );
}

function MobileStat({
  emoji,
  icon,
  text,
}: Readonly<{ emoji?: string; icon?: string; text: string }>) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 ${emoji ? "bg-[#d1e9e0]/30 text-[#0b7141]" : "bg-[#e3eae7] text-[#161d1b]"}`}>
      {icon ? <MaterialSymbol className="text-[18px] text-[#006d43]" fill name={icon} /> : null}
      {emoji ? <span className="text-[18px]">{emoji}</span> : null}
      <span className="text-sm font-semibold leading-5 tracking-[0.02em]">{text}</span>
    </span>
  );
}

function MobileAction({ count, icon }: Readonly<{ count: number; icon: string }>) {
  return (
    <button className="flex items-center gap-1.5 text-[#3d4a41] transition-colors hover:text-[#006d43]">
      <MaterialSymbol className="text-[18px]" name={icon} />
      <span className="text-xs font-medium leading-4 tracking-[0.04em]">{count}</span>
    </button>
  );
}

function MobileNavItem({
  active = false,
  href,
  icon,
  label,
}: Readonly<{ active?: boolean; href: string; icon: string; label: string }>) {
  return (
    <Link className={`flex h-12 w-16 flex-col items-center justify-center gap-1 transition-all ${active ? "font-semibold text-[#006d43]" : "text-[#3d4a41]"}`} href={href}>
      <MaterialSymbol name={icon} />
      <span className="text-[11px] font-medium leading-[14px]">{label}</span>
    </Link>
  );
}
