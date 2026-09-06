"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { loginHref } from "@/lib/auth/redirects";
import { MaterialSymbol } from "@/components/ui/material-symbol";

const tabs = [
  { href: "/feed", icon: "grid_view", label: "Feed", protected: false },
  { href: "/calendar", icon: "calendar_today", label: "Lịch", protected: true },
  { href: "/write", icon: "eco", label: "Viết", center: true, protected: false },
  { href: "/profile?tab=moments", icon: "military_tech", label: "Huy hiệu", activeWhen: "moments", protected: true },
  { href: "/profile", icon: "person", label: "Cá nhân", protected: true },
] as const;

export function BottomTabs({ signedIn }: Readonly<{ signedIn: boolean }>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const profileTab = searchParams.get("tab");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[#e2ece7] bg-white px-3 pb-3 pt-2 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-5 items-end justify-items-center">
        {tabs.map((tab) => {
          const active =
            "activeWhen" in tab
              ? pathname.startsWith("/profile") && profileTab === tab.activeWhen
              : tab.href === "/profile"
                ? pathname.startsWith("/profile") && profileTab !== "moments"
                : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const href = tab.protected && !signedIn ? loginHref(tab.href) : tab.href;
          const label = tab.href === "/profile" && !signedIn ? "Đăng nhập" : tab.label;
          const icon = tab.href === "/profile" && !signedIn ? "login" : tab.icon;

          if ("center" in tab && tab.center) {
            return (
              <div className="relative -top-6 flex flex-col items-center justify-center" key={tab.href}>
                <Link
                  aria-current={active ? "page" : undefined}
                  aria-label="Viết nhật ký"
                  className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#f4fbf8] bg-[#00a86b] text-white shadow-[0_8px_20px_rgba(0,168,107,0.35)] transition-all hover:bg-[#008e5a] active:scale-95"
                  href={href}
                >
                  <MaterialSymbol className="h-7 w-7 text-[26px]" fill name={icon} />
                </Link>
                <span className="mt-1 whitespace-nowrap text-[11px] font-bold leading-[14px] text-[#006d43]">
                  {label}
                </span>
              </div>
            );
          }

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`group flex w-full flex-col items-center justify-center py-1 transition-colors ${
                active ? "font-bold text-[#00a86b]" : "font-semibold text-gray-400 hover:text-[#008e5a]"
              }`}
                href={href}
                key={tab.href}
              >
              <MaterialSymbol className="h-6 w-6 text-[24px] transition-transform group-hover:scale-110" fill={active} name={icon} />
              <span className="mt-1 whitespace-nowrap text-[11px] leading-[14px]">{label}</span>
            </Link>
          );
        })}
        </div>
      </div>
    </nav>
  );
}
