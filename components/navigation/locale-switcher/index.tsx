"use client";

import { Suspense } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

import { Link, usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function LocaleSwitcher({ className = "" }: Readonly<{ className?: string }>) {
  return (
    <Suspense fallback={<LocaleSwitcherFallback className={className} />}>
      <LocaleSwitcherLinks className={className} />
    </Suspense>
  );
}

function LocaleSwitcherLinks({ className }: Readonly<{ className: string }>) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const href = query ? `${pathname}?${query}` : pathname;

  return (
    <div className={`grid grid-cols-2 gap-0.5 rounded-full bg-muted p-0.5 ${className}`}>
      {(["vi", "en"] as const).map((nextLocale) => (
        <Link
          aria-current={locale === nextLocale ? "true" : undefined}
          className={`flex h-8 min-w-9 items-center justify-center rounded-full px-2 text-xs font-bold leading-none transition-colors ${
            locale === nextLocale
              ? "bg-card text-primary shadow-xs"
              : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
          }`}
          href={href}
          key={nextLocale}
          locale={nextLocale}
        >
          {nextLocale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

function LocaleSwitcherFallback({ className }: Readonly<{ className: string }>) {
  return <div aria-hidden className={`h-9 w-[77px] rounded-full bg-muted ${className}`} />;
}
