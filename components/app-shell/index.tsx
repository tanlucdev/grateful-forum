"use client";

import { type ReactNode } from "react";
import { Toaster } from "sonner";

import {
  MobileBottomNavigation,
  NavigationHeader,
  type NavigationHeaderProfile,
} from "@/components/navigation/navigation-header";
import { LocaleSwitcher } from "@/components/navigation/locale-switcher";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export type AppShellProfile = NavigationHeaderProfile;

const appRoutes = ["/feed", "/write", "/calendar", "/profile", "/reward", "/moderation"] as const;

export function AppShell({
  children,
  locale,
  profile,
}: Readonly<{ children: ReactNode; locale: AppLocale; profile: AppShellProfile }>) {
  const pathname = usePathname();
  const router = useRouter();
  const showHeader = appRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  const showMobileFeedLocale = pathname === "/feed";

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
      {showMobileFeedLocale ? (
        <div className="fixed right-4 top-[calc(env(safe-area-inset-top)+12px)] z-[90] lg:hidden">
          <LocaleSwitcher />
        </div>
      ) : null}
      <div
        className={
          showHeader
            ? `pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-0 ${showMobileFeedLocale ? "pt-16 lg:pt-0" : ""}`
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
