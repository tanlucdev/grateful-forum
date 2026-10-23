"use client";

import { type ReactNode } from "react";
import { Toaster } from "sonner";

import {
  MobileBottomNavigation,
  NavigationHeader,
  type NavigationHeaderProfile,
} from "@/components/navigation/navigation-header";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export type AppShellProfile = NavigationHeaderProfile;

const appRoutes = ["/feed", "/write", "/calendar", "/profile", "/reward", "/moderation", "/entries"] as const;

export function AppShell({
  children,
  locale,
  profile,
}: Readonly<{ children: ReactNode; locale: AppLocale; profile: AppShellProfile }>) {
  const pathname = usePathname();
  const router = useRouter();
  const showHeader = appRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  function onSignedOut() {
    router.replace("/", { locale });
    router.refresh();
  }

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${
        showHeader ? "journal-write-theme app-garden-bg" : ""
      }`}
    >
      {showHeader ? (
        <NavigationHeader key={pathname} locale={locale} pathname={pathname} profile={profile} onSignedOut={onSignedOut} />
      ) : null}
      <div
        className={
          showHeader
            ? "pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-0 lg:pt-[calc(env(safe-area-inset-top)+76px)]"
            : ""
        }
      >
        {children}
      </div>
      {showHeader ? <MobileBottomNavigation locale={locale} pathname={pathname} profile={profile} /> : null}
      <Toaster richColors position="top-center" />
    </div>
  );
}
