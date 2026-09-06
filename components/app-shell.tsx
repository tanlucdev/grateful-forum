"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BottomTabs } from "@/components/navigation/bottom-tabs";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { loginHref } from "@/lib/auth/redirects";
import type { ProfileDashboard } from "@/lib/profile/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export type AppShellProfile = {
  avatarUrl: string;
  displayName: string;
  email: string;
  signedIn: boolean;
  streak: number;
};

const desktopNav = [
  { href: "/feed", label: "Feed", protected: false },
  { href: "/write", label: "Viết nhật ký", protected: false },
  { href: "/calendar", label: "Lịch biết ơn", protected: true },
  { href: "/profile", label: "Cá nhân", protected: true },
] as const;

const signedOutProfile: AppShellProfile = {
  avatarUrl: "",
  displayName: "Tài khoản",
  email: "",
  signedIn: false,
  streak: 0,
};

export function AppShell({
  children,
  profile,
}: Readonly<{ children: ReactNode; profile: AppShellProfile }>) {
  const pathname = usePathname();
  const [currentProfile, setCurrentProfile] = useState(profile);
  const isAuthSurface = pathname.startsWith("/auth");
  const isLandingSurface = pathname === "/";
  const isRewardSurface = pathname.startsWith("/reward");
  const isWriteSurface = pathname.startsWith("/write");
  const hidesGlobalBottomTabs =
    isAuthSurface ||
    isLandingSurface ||
    isRewardSurface ||
    pathname.startsWith("/moderation") ||
    isWriteSurface;
  const isStitchSurface = !isAuthSurface && !isLandingSurface && !isRewardSurface;
  const contentPadding =
    !hidesGlobalBottomTabs ? "pb-28 md:pb-0" : "";

  useEffect(() => {
    let ignored = false;

    async function hydrateProfile() {
      if (isAuthSurface || isLandingSurface || isRewardSurface) {
        return;
      }

      try {
        const response = await fetch("/api/profile/me", {
          cache: "no-store",
          credentials: "same-origin",
        });

        if (!response.ok) {
          if (!ignored && response.status === 401) {
            setCurrentProfile(signedOutProfile);
          }
          return;
        }

        const dashboard = (await response.json()) as ProfileDashboard;
        if (!ignored) {
          setCurrentProfile(toShellProfile(dashboard));
        }
      } catch {
        // Keep first paint shell usable when profile bootstrap is slow/offline.
      }
    }

    void hydrateProfile();

    return () => {
      ignored = true;
    };
  }, [isAuthSurface, isLandingSurface, isRewardSurface, pathname]);

  return (
    <div
      className={`min-h-screen bg-[var(--bg)] text-[var(--text)] ${
        isStitchSurface ? "journal-write-theme" : ""
      }`}
    >
      {isAuthSurface || isLandingSurface || isRewardSurface || isWriteSurface ? null : (
        <AppHeader pathname={pathname} profile={currentProfile} setProfile={setCurrentProfile} />
      )}
      <div className={contentPadding}>
        {children}
      </div>
      {hidesGlobalBottomTabs ? null : (
        <Suspense fallback={null}>
          <BottomTabs signedIn={currentProfile.signedIn} />
        </Suspense>
      )}
    </div>
  );
}

function AppHeader({
  pathname,
  profile,
  setProfile,
}: Readonly<{
  pathname: string;
  profile: AppShellProfile;
  setProfile: (profile: AppShellProfile) => void;
}>) {
  return (
    <header className="fixed inset-x-0 top-0 z-[80] bg-[#f4fbf8]/90 pt-[env(safe-area-inset-top)] shadow-[0_1px_8px_rgba(26,47,43,0.03)] backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-[1200px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-5 md:px-6">
        <div className="col-start-1 flex min-w-0 items-center justify-start gap-3">
          <Link aria-label="Grateful Forum" className="flex min-w-0 items-center gap-2" href="/feed">
            <Image
              alt=""
              className="h-8 w-8 rounded-full object-cover"
              height={32}
              src="/stitch/feed/sprout-logo.jpg"
              width={32}
            />
            <span className="hidden truncate text-xl font-semibold tracking-tight text-[#006d43] sm:inline">
              Grateful Forum
            </span>
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full bg-[#ffdad8]/60 px-3 py-1.5 text-xs font-medium leading-4 text-[#852229] md:inline-flex">
            <MaterialSymbol className="h-4 w-4 text-lg text-[#a5393e]" fill name="local_fire_department" />
            <span className="whitespace-nowrap">{profile.streak} ngày liên tiếp</span>
          </span>
        </div>
        <nav className="col-start-2 hidden items-center gap-1.5 rounded-xl bg-[#eef5f2] p-1 md:flex">
          {desktopNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const href = item.protected && !profile.signedIn ? loginHref(item.href) : item.href;
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-10 items-center rounded-lg px-3.5 text-sm font-semibold leading-5 ${
                  active
                    ? "bg-[#4ca374] text-[#00331d]"
                    : "text-[#3d4a41] hover:text-[#161d1b]"
                }`}
                href={href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="col-start-3 flex min-w-0 items-center justify-end">
          <HeaderAction profile={profile} setProfile={setProfile} />
        </div>
      </div>
    </header>
  );
}

function HeaderAction({
  profile,
  setProfile,
}: Readonly<{
  profile: AppShellProfile;
  setProfile: (profile: AppShellProfile) => void;
}>) {
  return profile.signedIn ? <AvatarMenu profile={profile} setProfile={setProfile} /> : <LoginButton />;
}

function LoginButton() {
  return (
    <Link
      className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#006d43] px-4 text-sm font-semibold text-white shadow-[0_8px_16px_rgba(0,109,67,0.15)]"
      href={loginHref("/profile")}
    >
      <MaterialSymbol className="h-4 w-4 text-lg" name="login" />
      <span>Đăng nhập</span>
    </Link>
  );
}

function AvatarMenu({
  profile,
  setProfile,
}: Readonly<{
  profile: AppShellProfile;
  setProfile: (profile: AppShellProfile) => void;
}>) {
  const supabaseConfigured = hasSupabaseEnv();
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
      setProfile(signedOutProfile);
      setOpen(false);
      return;
    }

    const { error } = await createSupabaseBrowserClient().auth.signOut();
    if (error) {
      return;
    }

    setProfile(signedOutProfile);
    setOpen(false);
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
        <div className="absolute right-0 top-full z-[90] mt-2 w-72 rounded-2xl border border-[#e3eae7]/60 bg-white p-3 text-[#161d1b] shadow-xl">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-[#eef5f2] p-2.5">
            <AvatarImage className="h-10 w-10 ring-2 ring-[#006d43]/20" profile={profile} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-bold leading-5">{profile.displayName}</span>
              </div>
              {profile.email ? <p className="mt-0.5 truncate text-xs text-[#3d4a41]">{profile.email}</p> : null}
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
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/30"
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

function AvatarImage({ className, profile }: Readonly<{ className: string; profile: AppShellProfile }>) {
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
    <span className={`${className} flex items-center justify-center rounded-full bg-[#d1e9e0] text-xs font-bold text-[#006d43]`}>
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
        active ? "bg-[#006d43]/10 font-medium text-[#006d43]" : "text-[#3d4a41] hover:bg-[#eef5f2] hover:text-[#161d1b]"
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

function toShellProfile(dashboard: ProfileDashboard): AppShellProfile {
  return {
    avatarUrl: dashboard.profile.avatarUrl || "",
    displayName: dashboard.profile.displayName || "Tài khoản",
    email: dashboard.profile.email || "",
    signedIn: true,
    streak: dashboard.streak || 0,
  };
}
