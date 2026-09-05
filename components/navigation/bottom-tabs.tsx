"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PencilLine, UserCircle2 } from "lucide-react";

const tabs = [
  { href: "/feed", label: "Feed", icon: Home, center: false },
  { href: "/write", label: "Write", icon: PencilLine, center: true },
  { href: "/profile", label: "Cá nhân", icon: UserCircle2, center: false },
] as const;

export function BottomTabs({ authenticated }: Readonly<{ authenticated: boolean }>) {
  const pathname = usePathname();
  const visibleTabs = authenticated ? tabs : tabs.filter((tab) => tab.href !== "/profile");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--bg)]/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className={`mx-auto grid h-[72px] w-full max-w-md items-center px-5 ${authenticated ? "grid-cols-[1fr_auto_1fr]" : "grid-cols-[1fr_auto]"}`}>
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname.startsWith(tab.href);

          if (tab.center) {
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className="relative -top-6 flex h-16 w-16 items-center justify-center rounded-lg border-4 border-[var(--bg)] bg-[var(--accent)] text-[var(--text)] shadow-[0_8px_18px_rgba(26,47,43,0.08)] active:scale-95"
                href={tab.href}
                key={tab.href}
              >
                <PencilLine className="h-7 w-7" strokeWidth={1.8} />
              </Link>
            );
          }

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 flex-col items-center justify-center gap-1 text-[var(--text)] ${
                active
                  ? "font-bold"
                  : "font-medium"
              }`}
              href={tab.href}
              key={tab.href}
            >
              <Icon className="h-5 w-5" strokeWidth={1.9} />
              <span className="text-[13px] leading-[18px]">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
