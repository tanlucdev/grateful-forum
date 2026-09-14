"use client";

import { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";

import {
  MobileBottomNavigation,
  NavigationHeader,
  type NavigationHeaderProfile,
} from "@/components/navigation/navigation-header";

export type AppShellProfile = NavigationHeaderProfile;

const appRoutes = ["/feed", "/write", "/calendar", "/profile", "/reward", "/moderation"] as const;

export function AppShell({
  children,
  profile,
}: Readonly<{ children: ReactNode; profile: AppShellProfile }>) {
  const pathname = usePathname();
  const router = useRouter();
  const showHeader = appRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  function onSignedOut() {
    router.replace("/");
    router.refresh();
  }

  return (
    <div
      className={`min-h-screen bg-[var(--bg)] text-[var(--text)] ${
        showHeader ? "journal-write-theme" : ""
      }`}
    >
      {showHeader ? (
        <NavigationHeader key={pathname} pathname={pathname} profile={profile} onSignedOut={onSignedOut} />
      ) : null}
      <div className={showHeader ? "pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0" : ""}>{children}</div>
      {showHeader ? <MobileBottomNavigation pathname={pathname} profile={profile} /> : null}
      <Toaster richColors position="top-center" />
    </div>
  );
}
