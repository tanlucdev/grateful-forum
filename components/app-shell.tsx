"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { BottomTabs } from "@/components/navigation/bottom-tabs";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
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
      <header
        className={`border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_92%,white)]/95 backdrop-blur ${
          isStitchSurface ? "hidden" : ""
        }`}
      >
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight">BeGrateful</p>
            <p className="text-xs text-[var(--muted)]">
              Daily gratitude journal
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)]">
            MVP
          </span>
        </div>
      </header>
      <div className={contentPadding}>
        {children}
      </div>
      {hidesGlobalBottomTabs ? null : (
        <BottomTabs />
      )}
    </div>
  );
}
