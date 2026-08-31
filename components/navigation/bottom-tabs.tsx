"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PencilLine, Rss, UserRound } from "lucide-react";

const tabs = [
  { href: "/feed", label: "Feed", icon: Rss, center: false },
  { href: "/write", label: "Write", icon: PencilLine, center: true },
  { href: "/profile", label: "Profile", icon: UserRound, center: false },
] as const;

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--bg)]/95 pb-[calc(env(safe-area-inset-bottom)+8px)] backdrop-blur">
      <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-2 px-3 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname.startsWith(tab.href);

          if (tab.center) {
            return (
              <Link
                className="flex translate-y-[-18px] flex-col items-center justify-center"
                href={tab.href}
                key={tab.href}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg shadow-black/10">
                  <PencilLine className="h-6 w-6" />
                </span>
                <span className="mt-2 text-[11px] font-semibold text-[var(--text)]">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              className={`flex flex-col items-center justify-center rounded-lg py-2 ${
                active ? "text-[var(--text)]" : "text-[var(--muted)]"
              }`}
              href={tab.href}
              key={tab.href}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              <span className="mt-1 text-[11px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
