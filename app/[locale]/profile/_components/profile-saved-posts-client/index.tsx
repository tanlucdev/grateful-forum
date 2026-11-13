"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { deleteFeedBookmark } from "@/lib/api/feed";
import type { SavedEntriesPage } from "@/lib/profile/saved-queries";

export function ProfileSavedPostsClient({ data, error }: Readonly<{ data?: SavedEntriesPage; error?: boolean }>) {
  const t = useTranslations("profile.saved");
  const format = useFormatter();
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const entries = data?.entries.filter((entry) => !removed.has(entry.id)) ?? [];
  const pageHref = (page: number) => `/profile?tab=saved&savedPage=${page}`;

  async function remove(id: string) {
    if (removing) return;
    setRemoving(id);
    try {
      await deleteFeedBookmark(id);
      setRemoved((current) => new Set(current).add(id));
      toast.success(t("removed"));
      if (entries.length === 1 && data && data.page > 1) router.replace(pageHref(data.page - 1));
      else router.refresh();
    } catch {
      toast.error(t("removeError"));
    } finally {
      setRemoving(null);
    }
  }

  if (error) return (
    <div className="rounded-xl bg-card p-6 text-center shadow-sm" role="alert">
      <p className="text-sm text-muted-foreground">{t("loadError")}</p>
      <Button className="mt-3 min-h-11" onClick={() => router.refresh()} variant="outline">{t("retry")}</Button>
    </div>
  );

  return (
    <div className="min-w-0 space-y-4">
      <p className="text-sm leading-6 text-muted-foreground">{t("description")}</p>
      {entries.length ? (
        <div className="grid min-w-0 gap-4 @min-[40rem]:grid-cols-2">
          {entries.map((entry) => (
            <article className="flex min-w-0 flex-col gap-4 rounded-xl bg-card p-5 shadow-sm [overflow-wrap:anywhere]" key={entry.id}>
              <time className="text-xs text-muted-foreground" dateTime={entry.createdAt}>
                {format.dateTime(new Date(entry.createdAt), { day: "numeric", month: "long", year: "numeric" })}
              </time>
              <Link aria-label={t("open")} className="flex min-w-0 flex-1 flex-col gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" href={`/entries/${entry.id}`}>
                {entry.entryKind === "handwritten" ? (
                  entry.metadata.handwritingPreviewUrl ? <img alt={t("handwritten")} className="max-h-64 w-full rounded-lg object-contain" src={entry.metadata.handwritingPreviewUrl} /> : <p className="text-sm font-semibold text-primary">{t("handwritten")}</p>
                ) : (
                  <>
                    {entry.metadata.imageUrl ? <img alt="" className="max-h-64 w-full rounded-lg object-cover" src={entry.metadata.imageUrl} /> : null}
                    {entry.metadata.quote ? <p className="whitespace-pre-wrap text-sm italic leading-6 text-muted-foreground">{entry.metadata.quote}</p> : null}
                    <p className="line-clamp-6 whitespace-pre-wrap text-base leading-6">{entry.content}</p>
                  </>
                )}
                <span className="mt-auto inline-flex min-h-11 items-center text-sm font-semibold text-primary">{t("open")}</span>
              </Link>
              <Button className="min-h-11 self-start" disabled={removing !== null} onClick={() => void remove(entry.id)} variant="ghost">
                <MaterialSymbol name="bookmark_added" className="text-base" />
                {removing === entry.id ? t("removing") : t("remove")}
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-card p-8 text-center shadow-sm">
          <MaterialSymbol className="mx-auto mb-3 text-3xl text-primary" name="bookmark" />
          <h2 className="text-lg font-semibold">{t("emptyTitle")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("emptyDescription")}</p>
          <Link className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href="/feed">{t("explore")}</Link>
        </div>
      )}
      {data && (data.page > 1 || data.hasNext) ? (
        <nav aria-label={t("pagination")} className="flex flex-wrap items-center justify-between gap-3">
          <Button className="min-h-11" disabled={data.page <= 1} onClick={() => router.push(pageHref(data.page - 1))} variant="outline">{t("previous")}</Button>
          <span className="text-sm text-muted-foreground">{t("page", { number: format.number(data.page) })}</span>
          <Button className="min-h-11" disabled={!data.hasNext} onClick={() => router.push(pageHref(data.page + 1))} variant="outline">{t("next")}</Button>
        </nav>
      ) : null}
    </div>
  );
}
