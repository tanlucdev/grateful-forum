"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { LocaleSwitcher } from "@/components/navigation/locale-switcher";
import { Link } from "@/i18n/navigation";

export function MobileNavigationHeader({ accountControl }: Readonly<{ accountControl: ReactNode }>) {
  return (
    <header className="journal-write-theme sticky top-0 z-[80] px-2.5 pb-1.5 pt-[calc(env(safe-area-inset-top)+6px)] lg:hidden">
      <div className="mx-auto flex min-h-[54px] max-w-3xl items-center justify-between gap-2.5 rounded-full border border-primary/20 bg-card/95 py-0 pl-2 pr-1.5 shadow-sm backdrop-blur-xl">
        <Link aria-label="Grateful Forum" className="flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" href="/">
          <Image alt="" className="size-8 rounded-full object-cover" height={32} src="/stitch/landing/mascot.png" width={32} />
        </Link>
        <div className="flex shrink-0 items-center gap-1 rounded-full border border-primary/15 bg-muted/80 p-0">
          <LocaleSwitcher compact />
          {accountControl}
        </div>
      </div>
    </header>
  );
}
