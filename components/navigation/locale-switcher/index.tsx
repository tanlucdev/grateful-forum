"use client";

import { Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

type LocaleSwitcherProps = Readonly<{ className?: string; compact?: boolean }>;

export function LocaleSwitcher({ className = "", compact = false }: LocaleSwitcherProps) {
  return (
    <Suspense fallback={<LocaleSwitcherFallback className={className} compact={compact} />}>
      <LocaleSwitcherLinks className={className} compact={compact} />
    </Suspense>
  );
}

function LocaleSwitcherLinks({ className, compact }: LocaleSwitcherProps) {
  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const href = query ? `${pathname}?${query}` : pathname;

  return (
    <div className={`shrink-0 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label={`${t("a11y.language")}: ${t(`locale.${locale}`)}`}
            className="group flex min-h-11 w-fit items-center justify-center justify-self-start rounded-full text-xs font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            type="button"
          >
            <span className="flex h-9 items-center gap-1 rounded-full bg-primary/5 px-2.5 group-hover:bg-primary/10 group-data-[state=open]:bg-primary/10">
              <LanguageFlag locale={locale} />
              {compact ? <span>{locale.toUpperCase()}</span> : <><span className="xl:hidden">{locale.toUpperCase()}</span><span className="hidden xl:inline">{t(`locale.${locale}`)}</span></>}
              <MaterialSymbol className="text-sm group-data-[state=open]:rotate-180" name="keyboard_arrow_down" />
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="z-[90] min-w-48 rounded-2xl bg-card p-1.5 shadow-lg ring-primary/10">
          {(["vi", "en"] as const).map((nextLocale) => (
            <DropdownMenuItem asChild key={nextLocale}>
              <Link
                aria-current={locale === nextLocale ? "true" : undefined}
                className={`min-h-11 gap-3 rounded-xl px-3 font-semibold focus:bg-primary/10 focus:text-primary ${locale === nextLocale ? "bg-primary/5 text-primary" : "text-muted-foreground"}`}
                href={href}
                locale={nextLocale}
                hrefLang={nextLocale}
                lang={nextLocale}
              >
                <LanguageFlag locale={nextLocale} />
                <span>{t(`locale.${nextLocale}`)}</span>
                {locale === nextLocale ? <MaterialSymbol className="ml-auto text-lg" name="check" /> : null}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function LocaleSwitcherFallback({ className, compact }: LocaleSwitcherProps) {
  return <div aria-hidden className={`h-11 shrink-0 rounded-full bg-primary/5 ${compact ? "w-[80px]" : "w-[80px] xl:w-[128px]"} ${className}`} />;
}

function LanguageFlag({ locale }: Readonly<{ locale: AppLocale }>) {
  return locale === "vi" ? (
    <svg aria-hidden="true" className="size-4 shrink-0 rounded-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 30 20"><path fill="#da251d" d="M0 0h30v20H0z" /><path fill="#ff0" d="m15 3 1.6 4.8h5l-4 3 1.5 4.7-4.1-3-4.1 3 1.5-4.7-4-3h5z" /></svg>
  ) : (
    <svg aria-hidden="true" className="size-4 shrink-0 rounded-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 30 20"><path fill="#012169" d="M0 0h30v20H0z" /><path stroke="#fff" strokeWidth="4" d="m0 0 30 20M30 0 0 20" /><path stroke="#c8102e" strokeWidth="1.5" d="m0 0 30 20M30 0 0 20" /><path stroke="#fff" strokeWidth="7" d="M15 0v20M0 10h30" /><path stroke="#c8102e" strokeWidth="4" d="M15 0v20M0 10h30" /></svg>
  );
}
