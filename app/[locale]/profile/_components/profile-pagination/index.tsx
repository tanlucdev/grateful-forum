"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { journalPageHref, type JournalPagination } from "@/lib/profile/pagination";

export function ProfilePagination({ pagination }: Readonly<{ pagination: JournalPagination }>) {
  const t = useTranslations("profile");
  const path = usePathname();
  const search = useSearchParams().toString();
  return <nav aria-label={t("pagination.label")} className="flex flex-wrap items-center justify-between gap-3 py-4">
    {pagination.previous ? <Link className="inline-flex min-h-11 items-center rounded-lg px-3 font-semibold text-primary focus-visible:outline-2" href={journalPageHref(path, search, pagination.previous)}>{t("pagination.previous")}</Link> : <span />}
    <span className="text-sm">{t("book.position", { first: pagination.total ? pagination.start + 1 : 0, last: Math.min(pagination.start + 24, pagination.total), total: pagination.total })}</span>
    {pagination.next ? <Link className="inline-flex min-h-11 items-center rounded-lg px-3 font-semibold text-primary focus-visible:outline-2" href={journalPageHref(path, search, pagination.next)}>{t("pagination.next")}</Link> : <span />}
  </nav>;
}
