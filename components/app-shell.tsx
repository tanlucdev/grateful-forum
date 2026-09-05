"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";

import { BottomTabs } from "@/components/navigation/bottom-tabs";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export type AppShellProfile = {
  avatarUrl: string;
  displayName: string;
  email: string;
  streak: number;
};

const desktopNav = [
  { href: "/feed", label: "Feed" },
  { href: "/write", label: "Viết nhật ký" },
  { href: "/calendar", label: "Lịch biết ơn" },
  { href: "/profile", label: "Cá nhân" },
] as const;

export function AppShell({
  children,
  authenticated,
  profile,
}: Readonly<{ children: ReactNode; authenticated: boolean; profile: AppShellProfile }>) {
  const pathname = usePathname();
  const isAuthSurface = pathname.startsWith("/auth");
  const isLandingSurface = pathname === "/";
  const isWriteSurface = pathname.startsWith("/write");
  const isOwnProfileSurface = pathname === "/profile";
  const isCalendarSurface = pathname === "/calendar";
  const hidesGlobalBottomTabs =
    isAuthSurface || isLandingSurface || isWriteSurface || isOwnProfileSurface || isCalendarSurface;
  const isStitchSurface =
    hidesGlobalBottomTabs || pathname.startsWith("/feed") || pathname.startsWith("/profile");
  const contentPadding =
    isStitchSurface && !hidesGlobalBottomTabs ? "pb-24 md:pb-0" : hidesGlobalBottomTabs ? "" : "pb-36";

  return (
    <div
      className={`min-h-screen bg-[var(--bg)] text-[var(--text)] ${
        isStitchSurface ? "journal-write-theme" : ""
      }`}
      >
      {isAuthSurface || isLandingSurface ? null : (
        <AppHeader pathname={pathname} authenticated={authenticated} profile={profile} />
      )}
      <div className={contentPadding}>
        {children}
      </div>
      {hidesGlobalBottomTabs ? null : (
        <BottomTabs authenticated={authenticated} />
      )}
      <Toaster richColors position="top-center" />
    </div>
  );
}

function AppHeader({
  authenticated,
  pathname,
  profile,
}: Readonly<{ authenticated: boolean; pathname: string; profile: AppShellProfile }>) {
  const visibleNav = authenticated
    ? desktopNav
    : desktopNav.filter((item) => item.href === "/feed" || item.href === "/write");

  return (
    <header className="fixed inset-x-0 top-0 z-[80] hidden bg-[#f4fbf8]/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl md:block">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <Link className="flex items-center gap-2" href="/feed">
            <Image
              alt="Mầm"
              className="h-8 w-8 rounded-full object-cover"
              height={32}
              src="/stitch/feed/sprout-logo.jpg"
              width={32}
            />
            <span className="text-xl font-semibold tracking-tight text-[#006d43]">
              BeGrateful
            </span>
          </Link>
          <span className="rounded-full bg-[#e8efec] px-2.5 py-1 text-[11px] font-medium leading-[14px] text-[#3d4a41] shadow-[0_1px_4px_rgba(26,47,43,0.04)]">
            Mầm
          </span>
        </div>
        <nav className="flex items-center gap-1.5 rounded-xl bg-[#eef5f2] p-1">
          {visibleNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-10 items-center rounded-lg px-3.5 text-sm font-semibold leading-5 ${
                  active
                    ? "bg-[#4ca374] text-[#00331d]"
                    : "text-[#3d4a41] hover:text-[#161d1b]"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        {authenticated ? (
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffdad8]/60 px-3 py-1.5 text-xs font-medium leading-4 text-[#852229]">
              <MaterialSymbol className="text-lg text-[#a5393e]" fill name="local_fire_department" />
              {profile.streak} ngày liên tiếp
            </span>
            <AvatarMenu profile={profile} />
          </div>
        ) : (
          <Link
            className="inline-flex h-10 items-center rounded-xl bg-[#006d43] px-4 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(0,109,67,0.15)]"
            href="/auth"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}

function AvatarMenu({ profile }: Readonly<{ profile: AppShellProfile }>) {
  const supabaseConfigured = hasSupabaseEnv();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeOnOutside(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  async function signOut() {
    if (!supabaseConfigured) {
      router.push("/auth");
      return;
    }

    await createSupabaseBrowserClient().auth.signOut();
    router.push("/auth");
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menu tài khoản"
        className="flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-2 ring-[#006d43]/20 transition-all hover:ring-[#006d43]/40"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Image
          alt=""
          className="h-8 w-8 rounded-full object-cover"
          height={32}
          src={profile.avatarUrl}
          width={32}
        />
      </button>
      {open ? (
      <div className="absolute right-0 top-full z-[90] mt-2 w-72 rounded-2xl border border-[#e3eae7]/60 bg-white p-3 text-[#161d1b] shadow-xl">
        <div className="mb-2 flex items-center gap-3 rounded-xl bg-[#eef5f2] p-2.5">
          <Image
            alt=""
            className="h-10 w-10 rounded-full object-cover ring-2 ring-[#006d43]/20"
            height={40}
            src={profile.avatarUrl}
            width={40}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold leading-5">{profile.displayName}</span>
              <span className="rounded-full bg-[#99f3b6] px-1.5 py-0.5 text-[10px] font-medium leading-none text-[#0b7141]">
                Tâm Hồn An Yên
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-[#3d4a41]">{profile.email}</p>
          </div>
        </div>
        <div className="space-y-0.5 text-sm">
          <MenuLink active href="/profile" icon="person" label="Hồ sơ của tôi" />
          <MenuLink badge="Cấp 2" href="/calendar" icon="potted_plant" label="Vườn ươm Bé Mầm" />
          <MenuLink href="/profile?tab=moments" icon="military_tech" label="Bộ sưu tập huy hiệu & cột mốc" />
          <MenuLink href="/profile?tab=all" icon="settings" label="Cài đặt & Quyền riêng tư" />
        </div>
        <div className="my-2 border-t border-[#e8efec]" />
        <button
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/30"
          onClick={signOut}
          type="button"
        >
          <MaterialSymbol className="text-lg" name="logout" />
          <span>Đăng xuất</span>
        </button>
      </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  active = false,
  badge,
  href,
  icon,
  label,
}: Readonly<{ active?: boolean; badge?: string; href: string; icon: string; label: string }>) {
  return (
    <Link
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 transition-colors ${
        active ? "bg-[#006d43]/10 font-medium text-[#006d43]" : "text-[#3d4a41] hover:bg-[#eef5f2] hover:text-[#161d1b]"
      }`}
      href={href}
    >
      <MaterialSymbol className="text-lg" fill={active && icon === "person"} name={icon} />
      <span>{label}</span>
      {badge ? (
        <span className="ml-auto rounded-full bg-[#99f3b6] px-2 py-0.5 text-[10px] font-semibold leading-none text-[#00522d]">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
