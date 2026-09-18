"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <header className="fixed inset-x-0 top-0 z-[80] hidden bg-transparent pt-[calc(env(safe-area-inset-top)+8px)] md:block">
      <div className="mx-auto grid h-[60px] max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-[20px] border border-border bg-card/90 px-4 shadow-sm backdrop-blur-xl lg:px-5">
        <div className="flex min-w-0 items-center justify-start gap-2.5">
          <Link aria-label="Grateful Forum" className="flex min-w-0 items-center gap-2" href="/feed" onClick={() => setPendingPath("/feed")}>
            <Image
              alt=""
              className="h-8 w-8 rounded-xl object-cover shadow-xs lg:h-9 lg:w-9"
              height={32}
              src="/stitch/landing/mascot.png"
              width={32}
            />
            <span className="hidden truncate text-[15px] font-bold leading-5 text-primary lg:inline">
              Grateful Forum
            </span>
          </Link>
          <span className="hidden h-8 items-center gap-1.5 rounded-full bg-[var(--fire-soft)]/60 px-2.5 text-[11px] font-semibold leading-4 text-[var(--fire)] lg:inline-flex">
            <MaterialSymbol className="text-[14px] text-[var(--fire)]" fill name="local_fire_department" />
            <span className="whitespace-nowrap">{profile.streak} ngày liên tiếp</span>
          </span>
        </div>

        <nav className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto rounded-2xl border border-border bg-background/65 p-1">
          {navItems.map((item) => {
            const targetPath = item.href;
            const active = activePath === targetPath || activePath.startsWith(`${targetPath}/`);
            const pending = pendingPath === targetPath;
            const href = item.protected && !profile.signedIn ? loginHref(item.href) : item.href;
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold leading-5 transition-colors ${
                  active
                    ? "bg-accent/70 text-primary"
                    : "text-on-surface-variant hover:bg-card/80 hover:text-on-surface"
                } ${pending ? "ring-1 ring-primary/20" : ""}`}
                href={href}
                key={item.href}
                onClick={() => setPendingPath(targetPath)}
              >
                <MaterialSymbol className="text-[14px]" name={item.icon} strokeWidth={active ? 2 : 1.7} />
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
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-border bg-card/95 pb-[calc(env(safe-area-inset-bottom)+8px)] shadow-sm backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid h-[72px] w-full max-w-[430px] grid-cols-5 items-end px-3 pt-1.5">
        {mobileNavItems.map((item) => {
          const targetPath = item.href;
          const active = activePath === targetPath || activePath.startsWith(`${targetPath}/`);
          const href = item.protected && !profile.signedIn ? loginHref(item.href) : item.href;

          if (item.primary) {
            return (
              <Link
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
                className="-mt-8 flex min-h-[82px] flex-col items-center justify-start gap-0.5 text-primary outline-offset-4"
                href={href}
                key={item.href}
                onClick={() => setPendingPath(targetPath)}
              >
                <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-card shadow-sm">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--primary-shadow-md)]">
                    <MaterialSymbol className="text-[28px]" name={item.icon} strokeWidth={2.2} />
                  </span>
                </span>
                <span className="text-[12px] font-bold leading-4">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`flex h-[64px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-center text-[11px] font-semibold leading-4 outline-offset-4 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
              href={href}
              key={item.href}
              onClick={() => setPendingPath(targetPath)}
            >
              <span className={`flex h-8 w-11 items-center justify-center rounded-full ${active ? "bg-accent/75" : ""}`}>
                <MaterialSymbol className="text-[22px]" name={item.icon} strokeWidth={active ? 2 : 1.7} />
              </span>
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
    <Button asChild size="sm">
      <Link href={loginHref("/profile")}>
        <MaterialSymbol className="text-[15px]" name="login" />
        <span className="hidden sm:inline">Đăng nhập</span>
      </Link>
    </Button>
  );
}

function AvatarMenu({
  onSignedOut,
  profile,
}: Readonly<{
  onSignedOut: () => void;
  profile: NavigationHeaderProfile;
}>) {
  async function signOut() {
    try {
      await logout();
    } catch {
      return;
    }

    onSignedOut();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Menu tài khoản"
          className="flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-2 ring-primary/20 transition-all hover:ring-primary/40"
          type="button"
        >
          <AvatarImage className="h-8 w-8" profile={profile} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 rounded-2xl border-border bg-card p-3 text-foreground shadow-sm">
        <div className="mb-2 flex items-center gap-3 rounded-2xl bg-muted p-2.5">
            <AvatarImage className="h-10 w-10 ring-2 ring-primary/20" profile={profile} />
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold leading-5">{profile.displayName}</span>
              {profile.email ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{profile.email}</p> : null}
            </div>
          </div>
        <div className="space-y-0.5 text-sm">
          <MenuLink active href="/profile" icon="person" label="Hồ sơ của tôi" />
          <MenuLink href="/calendar" icon="potted_plant" label="Vườn ươm Bé Mầm" />
          <MenuLink href="/profile?tab=moments" icon="military_tech" label="Bộ sưu tập huy hiệu & cột mốc" />
          <MenuLink href="/profile?tab=all" icon="settings" label="Cài đặt & Quyền riêng tư" />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild variant="destructive">
          <button className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-sm font-medium" onClick={signOut} type="button">
            <MaterialSymbol className="h-4 w-4 text-lg" name="logout" />
            <span>Đăng xuất</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AvatarImage({ className, profile }: Readonly<{ className: string; profile: NavigationHeaderProfile }>) {
  if (profile.avatarUrl) {
    return (
      <span
        aria-hidden="true"
        className={`${className} block rounded-full bg-accent bg-cover bg-center`}
        style={{ backgroundImage: `url(${profile.avatarUrl})` }}
      />
    );
  }

  return (
    <span className={`${className} flex items-center justify-center rounded-full bg-accent text-xs font-bold text-primary`}>
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
    <DropdownMenuItem asChild>
      <Link
        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 transition-colors ${
          active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        href={href}
      >
        <MaterialSymbol className="h-4 w-4 text-lg" name={icon} strokeWidth={1.6} />
        <span>{label}</span>
        {badge ? (
          <span className="ml-auto rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-semibold leading-none text-primary">
            {badge}
          </span>
        ) : null}
      </Link>
    </DropdownMenuItem>
  );
}
