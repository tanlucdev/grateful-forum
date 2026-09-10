"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { logout } from "@/lib/api/auth";
import { loginHref } from "@/lib/auth/redirects";

export type NavigationHeaderProfile = {
  avatarUrl: string;
  displayName: string;
  email: string;
  signedIn: boolean;
  streak: number;
};

const navItems = [
  { href: "/feed", icon: "grid_view", label: "Feed", protected: false },
  { href: "/write", icon: "eco", label: "Viết", protected: false },
  { href: "/calendar", icon: "calendar_today", label: "Lịch", protected: true },
  { href: "/profile", icon: "person", label: "Cá nhân", protected: true },
] as const;

const mobileNavItems = [
  { href: "/feed", icon: "home", label: "Bảng tin", protected: false, primary: false },
  { href: "/calendar", icon: "calendar_today", label: "Lịch sử", protected: true, primary: false },
  { href: "/write", icon: "eco", label: "Ghi chép", protected: false, primary: true },
  { href: "/reward", icon: "explore", label: "Khám phá", protected: false, primary: false },
  { href: "/profile", icon: "person", label: "Cá nhân", protected: true, primary: false },
] as const;

export function NavigationHeader({
  onSignedOut,
  pathname,
  profile,
}: Readonly<{
  onSignedOut: () => void;
  pathname: string;
  profile: NavigationHeaderProfile;
}>) {
  const [pendingPath, setPendingPath] = useState("");
  const activePath = pendingPath || pathname;

  return (
    <header className="fixed inset-x-0 top-0 z-[80] hidden border-b border-[#e8efec] bg-white/90 pt-[env(safe-area-inset-top)] shadow-[0_1px_8px_rgba(26,47,43,0.03)] backdrop-blur-xl md:block">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 md:h-20 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-3 md:px-5 lg:px-margin-desktop">
        <div className="flex min-w-0 items-center justify-start gap-3">
          <Link aria-label="Grateful Forum" className="flex min-w-0 items-center gap-2" href="/feed" onClick={() => setPendingPath("/feed")}>
            <Image
              alt=""
              className="h-9 w-9 rounded-2xl object-cover shadow-xs lg:h-10 lg:w-10"
              height={32}
              src="/stitch/landing/mascot.png"
              width={32}
            />
            <span className="hidden truncate text-lg font-bold leading-tight text-primary lg:inline lg:text-xl">
              Grateful Forum
            </span>
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full bg-[#ffdad8]/60 px-3 py-1.5 text-xs font-semibold leading-4 text-[#852229] md:inline-flex">
            <MaterialSymbol className="h-4 w-4 text-lg text-[#a5393e]" fill name="local_fire_department" />
            <span className="whitespace-nowrap">{profile.streak} ngày liên tiếp</span>
          </span>
        </div>

        <nav className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto md:rounded-2xl md:border md:border-[#e8efec] md:bg-white/70 md:p-1">
          {navItems.map((item) => {
            const targetPath = item.href;
            const active = activePath === targetPath || activePath.startsWith(`${targetPath}/`);
            const pending = pendingPath === targetPath;
            const href = item.protected && !profile.signedIn ? loginHref(item.href) : item.href;
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-12 min-w-12 flex-col items-center justify-center rounded-xl px-2 text-[11px] font-semibold leading-4 transition-colors md:h-10 md:min-w-0 md:flex-row md:gap-2 md:px-3.5 md:text-sm md:leading-5 ${
                  active
                    ? "bg-primary text-white shadow-[0_2px_8px_rgba(0,109,67,0.14)]"
                    : "text-on-surface-variant hover:bg-surface-white/70 hover:text-on-surface"
                } ${pending ? "ring-1 ring-primary/20" : ""}`}
                href={href}
                key={item.href}
                onClick={() => setPendingPath(targetPath)}
              >
                <MaterialSymbol className="h-5 w-5 text-[20px] md:hidden" fill={active} name={item.icon} />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex min-w-0 items-center justify-end">
          {profile.signedIn ? <AvatarMenu profile={profile} onSignedOut={onSignedOut} /> : <LoginButton />}
        </div>
      </div>
    </header>
  );
}

export function MobileBottomNavigation({
  pathname,
  profile,
}: Readonly<{
  pathname: string;
  profile: NavigationHeaderProfile;
}>) {
  const [pendingPath, setPendingPath] = useState("");
  const activePath = pendingPath || pathname;

  return (
    <nav
      aria-label="Điều hướng chính"
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-[#e8efec] bg-white/95 pb-[calc(env(safe-area-inset-bottom)+10px)] shadow-[0_-10px_28px_rgba(26,47,43,0.08)] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid h-[82px] w-full max-w-[430px] grid-cols-5 items-end px-3 pt-2">
        {mobileNavItems.map((item) => {
          const targetPath = item.href;
          const active = activePath === targetPath || activePath.startsWith(`${targetPath}/`);
          const href = item.protected && !profile.signedIn ? loginHref(item.href) : item.href;

          if (item.primary) {
            return (
              <Link
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
                className="-mt-9 flex min-h-[92px] flex-col items-center justify-start gap-1 text-[#006d43] outline-offset-4"
                href={href}
                key={item.href}
                onClick={() => setPendingPath(targetPath)}
              >
                <span className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-white shadow-[0_3px_10px_rgba(26,47,43,0.08)]">
                  <span className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#00a86b] text-white shadow-[0_10px_28px_rgba(0,109,67,0.24)]">
                    <MaterialSymbol className="text-[32px]" fill name={item.icon} />
                  </span>
                </span>
                <span className="text-[13px] font-bold leading-4">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`flex h-[72px] min-w-0 flex-col items-center justify-center gap-2 rounded-xl px-1 text-center text-[12px] font-semibold leading-4 outline-offset-4 ${
                active ? "text-[#006d43]" : "text-[#8da0b6]"
              }`}
              href={href}
              key={item.href}
              onClick={() => setPendingPath(targetPath)}
            >
              <MaterialSymbol className="text-[29px]" fill={active} name={item.icon} />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function LoginButton() {
  return (
    <Link className="inline-flex h-10 items-center gap-2 rounded-2xl bg-primary px-3 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(0,109,67,0.15)] md:px-4" href={loginHref("/profile")}>
      <MaterialSymbol className="h-4 w-4 text-lg" name="login" />
      <span className="hidden sm:inline">Đăng nhập</span>
    </Link>
  );
}

function AvatarMenu({
  onSignedOut,
  profile,
}: Readonly<{
  onSignedOut: () => void;
  profile: NavigationHeaderProfile;
}>) {
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
    try {
      await logout();
    } catch {
      return;
    }

    setOpen(false);
    onSignedOut();
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
        <AvatarImage className="h-8 w-8" profile={profile} />
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-[90] mt-2 w-72 rounded-2xl border border-primary/5 bg-surface-white p-3 text-on-surface shadow-[0_16px_40px_rgba(26,47,43,0.05)]">
          <div className="mb-2 flex items-center gap-3 rounded-2xl bg-surface-container-low p-2.5">
            <AvatarImage className="h-10 w-10 ring-2 ring-primary/20" profile={profile} />
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold leading-5">{profile.displayName}</span>
              {profile.email ? <p className="mt-0.5 truncate text-xs text-on-surface-variant">{profile.email}</p> : null}
            </div>
          </div>
          <div className="space-y-0.5 text-sm">
            <MenuLink active href="/profile" icon="person" label="Hồ sơ của tôi" />
            <MenuLink href="/calendar" icon="potted_plant" label="Vườn ươm Bé Mầm" />
            <MenuLink href="/profile?tab=moments" icon="military_tech" label="Bộ sưu tập huy hiệu & cột mốc" />
            <MenuLink href="/profile?tab=all" icon="settings" label="Cài đặt & Quyền riêng tư" />
          </div>
          <div className="my-2 border-t border-[#e8efec]" />
          <button
            className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-sm font-medium text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/30"
            onClick={signOut}
            type="button"
          >
            <MaterialSymbol className="h-4 w-4 text-lg" name="logout" />
            <span>Đăng xuất</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function AvatarImage({ className, profile }: Readonly<{ className: string; profile: NavigationHeaderProfile }>) {
  if (profile.avatarUrl) {
    return (
      <span
        aria-hidden="true"
        className={`${className} block rounded-full bg-[#d1e9e0] bg-cover bg-center`}
        style={{ backgroundImage: `url(${profile.avatarUrl})` }}
      />
    );
  }

  return (
    <span className={`${className} flex items-center justify-center rounded-full bg-[#d1e9e0] text-xs font-bold text-primary`}>
      {profile.displayName.slice(0, 1).toUpperCase()}
    </span>
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
        active ? "bg-primary/10 font-medium text-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
      }`}
      href={href}
    >
      <MaterialSymbol className="h-4 w-4 text-lg" fill={active && icon === "person"} name={icon} />
      <span>{label}</span>
      {badge ? (
        <span className="ml-auto rounded-full bg-[#99f3b6] px-2 py-0.5 text-[10px] font-semibold leading-none text-[#00522d]">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
