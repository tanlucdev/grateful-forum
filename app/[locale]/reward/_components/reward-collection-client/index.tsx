"use client";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Dialog, DialogClose, DialogOverlay, DialogPortal, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { badges, type Badge } from "../badges";

const filters = ["all", "streak", "habit", "community"] as const;
const statusColors = {
  earned: "bg-emerald-50 text-emerald-800",
  growing: "bg-amber-50 text-amber-800",
  locked: "bg-stone-100 text-stone-600",
};

export function RewardCollectionClient() {
  const t = useTranslations("reward");
  const format = useFormatter();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const visible = badges.filter((badge) => filter === "all" || badge.category === filter);

  function progressText(badge: Badge) {
    return badge.date
      ? t("unlocked", { date: format.dateTime(new Date(badge.date + "T00:00:00Z"), { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }) })
      : t(badge.unit === "posts" ? "postsProgress" : "daysProgress", {
        current: format.number(badge.current ?? 0),
        total: format.number(badge.total ?? 0),
      });
  }

  return (
    <section aria-label={t("filters.label")} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-card p-2 shadow-xs">
        <div aria-label={t("filters.label")} className="flex max-w-full gap-1 overflow-x-auto" role="group">
          {filters.map((value) => (
            <button
              aria-pressed={filter === value}
              className={`min-h-11 shrink-0 rounded-xl px-4 text-sm font-semibold transition-colors ${filter === value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              key={value}
              onClick={() => setFilter(value)}
              type="button"
            >
              {t(`filters.${value}`)} ({format.number(badges.filter((badge) => value === "all" || badge.category === value).length)})
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 px-2 text-xs text-muted-foreground">
          {(["earned", "growing", "locked"] as const).map((status) => (
            <span className="flex items-center gap-1.5" key={status}>
              <span aria-hidden="true" className={`size-2 rounded-full ${status === "earned" ? "bg-primary" : status === "growing" ? "bg-amber-500" : "bg-stone-400"}`} />
              {t(`status.${status}`)} ({format.number(badges.filter((badge) => badge.status === status).length)})
            </span>
          ))}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">{t("results", { count: format.number(visible.length) })}</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((badge) => (
          <Dialog key={badge.id}>
            <DialogTrigger asChild>
              <button
                className={`group flex min-w-0 flex-col overflow-hidden rounded-3xl bg-card text-center shadow-card transition-shadow hover:shadow-md ${badge.status === "growing" ? "ring-1 ring-amber-200" : ""}`}
                type="button"
              >
                <div className="flex w-full flex-1 flex-col items-center px-5 pb-5 pt-4">
                  <span className={`mb-2 inline-flex items-center gap-1 self-end rounded-full px-2.5 py-1 text-xs font-bold ${statusColors[badge.status]}`}>
                    <MaterialSymbol className="text-sm" name={badge.status === "locked" ? "lock" : badge.status === "earned" ? "check_circle" : "schedule"} />
                    {t(`status.${badge.status}`)}
                  </span>
                  <Image loading="eager" alt="" className="my-2 drop-shadow-md" height={112} src={`/stitch/reward/badge-${badge.id}.svg`} width={112} />
                  <h2 className="mt-3 text-xl font-semibold leading-7 group-hover:text-primary">{t(`badges.${badge.id}.title`)}</h2>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{t(`badges.${badge.id}.subtitle`)}</p>
                  <p className="mt-3 text-sm leading-5 text-muted-foreground">{t(`badges.${badge.id}.description`)}</p>
                </div>
                <div className={`w-full space-y-2 px-5 py-4 text-xs ${badge.status === "growing" ? "bg-amber-50/70 text-amber-800" : badge.status === "locked" ? "bg-stone-50 text-stone-600" : "bg-secondary/60 text-primary"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-left font-semibold">{progressText(badge)}</span>
                    <MaterialSymbol className="shrink-0 text-lg" name={badge.status === "locked" ? "lock" : "arrow_forward"} />
                  </div>
                  {badge.status === "growing" && (
                    <progress aria-label={t("progress")} className="block h-1.5 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-amber-100 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary" max={badge.total} value={badge.current} />
                  )}
                </div>
              </button>
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay className="z-[90]" />
              <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[91] grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-3xl text-foreground shadow-xl outline-none journal-write-theme max-h-[90dvh] overflow-y-auto bg-card p-7 text-center font-body-md sm:max-w-md">
              <Image loading="eager" alt="" className="mx-auto" height={128} src={`/stitch/reward/badge-${badge.id}.svg`} width={128} />
              <span className={`mx-auto rounded-full px-3 py-1 text-xs font-semibold ${statusColors[badge.status]}`}>{t(`status.${badge.status}`)}</span>
              <DialogTitle className="text-2xl font-bold leading-8">{t(`badges.${badge.id}.title`)}</DialogTitle>
              <p className="text-xs font-semibold text-primary">{t(`badges.${badge.id}.subtitle`)}</p>
              <DialogDescription className="text-base leading-7">{t(`badges.${badge.id}.description`)}</DialogDescription>
              <dl className="space-y-4 rounded-xl bg-muted p-4 text-left text-sm">
                <div><dt className="font-semibold">{t("condition")}</dt><dd className="mt-1 text-muted-foreground">{t(`badges.${badge.id}.condition`)}</dd></div>
                <div><dt className="font-semibold">{t("detailProgress")}</dt><dd className="mt-1 text-primary">{progressText(badge)}</dd></div>
              </dl>
              <DialogClose className="min-h-12 rounded-xl bg-primary px-4 font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]">{t("close")}</DialogClose>
            </DialogPrimitive.Content>
            </DialogPortal>
          </Dialog>
        ))}
      </div>
    </section>
  );
}
