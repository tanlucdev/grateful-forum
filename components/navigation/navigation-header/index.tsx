"use client";
import type { ReactNode } from "react";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { MobileNavigationHeader } from "@/components/navigation/mobile-navigation-header";
import { LocaleSwitcher } from "@/components/navigation/locale-switcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { logout } from "@/lib/api/auth";
import { loginHref } from "@/lib/auth/redirects";

export type NavigationHeaderProfile = {
  avatarUrl: string;
  displayName: string;
  email: string;
  signedIn: boolean;
  streak: ReactNode;
};

const navItems = [
  { href: "/feed", icon: "grid_view", protected: false },
  { href: "/write", icon: "eco", protected: true },
  { href: "/calendar", icon: "calendar_today", protected: true },
  { href: "/profile", icon: "person", protected: true },
] as const;

const mobileNavItems = [
  { href: "/feed", icon: "home", protected: false, primary: false },
  { href: "/calendar", icon: "calendar_today", protected: true, primary: false },
  { href: "/write", icon: "eco", protected: true, primary: true },
  { href: "/reward", icon: "explore", protected: false, primary: false },
  { href: "/profile", icon: "person", protected: true, primary: false },
] as const;

export function NavigationHeader({
  desktopVisible = true,
  locale,
  onSignedOut,
  pathname,
  profile,
}: Readonly<{
  desktopVisible?: boolean;
  locale: AppLocale;
  onSignedOut: () => void;
  pathname: string;
  profile: NavigationHeaderProfile;
}>) {
  const [pendingPath, setPendingPath] = useState("");
  const activePath = pendingPath || pathname;
  const t = useTranslations("common");
  const copy = navigationCopy(t);

  return (
    <>
      <MobileNavigationHeader accountControl={profile.signedIn ? <AvatarMenu copy={copy} profile={profile} onSignedOut={onSignedOut} /> : <LoginButton copy={copy} locale={locale} />} />
    <header className={`${desktopVisible ? "hidden lg:block" : "hidden"} fixed inset-x-0 top-0 z-[80] bg-transparent pt-[calc(env(safe-area-inset-top)+8px)]`}>
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
            <span className="whitespace-nowrap">{profile.streak} {copy.streak}</span>
          </span>
        </div>

        <nav className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto rounded-2xl border border-border bg-background/65 p-1">
          {navItems.map((item) => {
            const targetPath = item.href;
            const active = activePath === targetPath || activePath.startsWith(`${targetPath}/`);
            const pending = pendingPath === targetPath;
            const href = item.protected && !profile.signedIn ? loginHref(item.href, locale) : item.href;
            const label = item.href === "/write" ? copy.write : item.href === "/calendar" ? copy.calendar : item.href === "/profile" ? copy.personal : copy.feed;
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
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex min-w-0 items-center justify-end">
          <div className="flex shrink-0 items-center gap-2">
            <LocaleSwitcher />
            {profile.signedIn ? <AvatarMenu copy={copy} profile={profile} onSignedOut={onSignedOut} /> : <LoginButton copy={copy} locale={locale} />}
          </div>
        </div>
      </div>
    </header>
    </>
  );
}

export function MobileBottomNavigation({
  locale,
  pathname,
  profile,
}: Readonly<{
  locale: AppLocale;
  pathname: string;
  profile: NavigationHeaderProfile;
}>) {
  const [pendingPath, setPendingPath] = useState("");
  const activePath = pendingPath || pathname;
  const t = useTranslations("common");
  const copy = navigationCopy(t);

  return (
    <nav
      aria-label={copy.mainNavigation}
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-border bg-card/95 pb-[calc(env(safe-area-inset-bottom)+8px)] shadow-sm backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid h-[72px] w-full max-w-[430px] grid-cols-5 items-end px-3 pt-1.5 sm:max-w-[600px] sm:px-6 md:max-w-3xl md:px-8">
        {mobileNavItems.map((item) => {
          const targetPath = item.href;
          const active = activePath === targetPath || activePath.startsWith(`${targetPath}/`);
          const href = item.protected && !profile.signedIn ? loginHref(item.href, locale) : item.href;
          const label = item.href === "/write" ? copy.writeMobile : item.href === "/calendar" ? copy.history : item.href === "/profile" ? copy.personal : item.href === "/reward" ? copy.discover : copy.feed;

          if (item.primary) {
            return (
              <Link
                aria-current={active ? "page" : undefined}
                aria-label={label}
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
                <span className="text-[12px] font-bold leading-4">{label}</span>
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
              <span className="max-w-full truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function LoginButton({ copy, locale }: Readonly<{ copy: ReturnType<typeof navigationCopy>; locale: AppLocale }>) {
  return (
    <Button asChild className="min-h-11 min-w-11 rounded-full" size="sm">
      <Link aria-label={copy.login} href={loginHref("/profile", locale)}>
        <MaterialSymbol className="text-[15px]" name="login" />
        <span className="hidden sm:inline">{copy.login}</span>
      </Link>
    </Button>
  );
}

function AvatarMenu({
  copy,
  onSignedOut,
  profile,
}: Readonly<{
  copy: ReturnType<typeof navigationCopy>;
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
          aria-label={copy.accountMenu}
          className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-primary/20 p-0.5 transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ring"
          type="button"
        >
          <AvatarImage className="h-8 w-8" profile={profile} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[90] w-72 rounded-2xl border-border bg-card p-3 text-foreground shadow-sm">
        <div className="mb-2 flex items-center gap-3 rounded-2xl bg-muted p-2.5">
            <AvatarImage className="h-10 w-10 ring-2 ring-primary/20" profile={profile} />
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold leading-5">{profile.displayName}</span>
              {profile.email ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{profile.email}</p> : null}
            </div>
          </div>
        <div className="space-y-0.5 text-sm">
          <MenuLink active href="/profile" icon="person" label={copy.myProfile} />
          <MenuLink href="/calendar" icon="potted_plant" label={copy.calendarGarden} />
          <MenuLink href="/reward" icon="military_tech" label={copy.milestones} />
          <MenuLink href="/profile?tab=all" icon="settings" label={copy.settings} />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild variant="destructive">
          <button className="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium" onClick={signOut} type="button">
            <MaterialSymbol className="h-4 w-4 text-lg" name="logout" />
            <span>{copy.logout}</span>
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

function navigationCopy(t: ReturnType<typeof useTranslations<"common">>) {
  return {
    accountMenu: t("a11y.accountMenu"),
    calendar: t("navigation.calendar"),
    calendarGarden: t("navigation.garden"),
    discover: t("navigation.reward"),
    feed: t("navigation.feed"),
    history: t("navigation.history"),
    login: t("navigation.signIn"),
    logout: t("navigation.signOut"),
    mainNavigation: t("navigation.main"),
    milestones: t("navigation.milestones"),
    myProfile: t("navigation.myProfile"),
    personal: t("navigation.profile"),
    settings: t("navigation.settings"),
    streak: t("navigation.streak"),
    write: t("navigation.write"),
    writeMobile: t("navigation.writeMobile"),
  };
}
