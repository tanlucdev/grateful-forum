"use client";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Dialog, DialogClose, DialogOverlay, DialogPortal, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { RewardBadge } from "@/lib/rewards/dto";

const filters = ["all", "streak", "habit", "community"] as const;
const statusColors = {
  earned: "bg-emerald-50 text-emerald-800",
  growing: "bg-amber-50 text-amber-800",
  locked: "bg-stone-100 text-stone-600",
};

export function RewardCollectionClient({ badges, timezone }: { badges: RewardBadge[]; timezone: string }) {
  const t = useTranslations("reward");
  const format = useFormatter();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const visible = badges.filter((badge) => filter === "all" || badge.category === filter);

  function progressText(badge: RewardBadge) {
    return badge.earnedAt
      ? t("unlocked", { date: format.dateTime(new Date(badge.earnedAt), { day: "2-digit", month: "2-digit", year: "numeric", timeZone: timezone }) })
      : t(`progressUnits.${badge.unit}`, {
        current: format.number(badge.current ?? 0),
        total: format.number(badge.total ?? 0),
      });
  }

  return (
    <section aria-label={t("filters.label")} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div aria-label={t("filters.label")} className="flex max-w-full items-center gap-1 overflow-x-auto text-xs font-semibold" role="group">
          {filters.map((value) => (
            <button
              aria-pressed={filter === value}
              className="flex min-h-11 shrink-0 items-center rounded-full px-0.5"
              key={value}
              onClick={() => setFilter(value)}
              type="button"
            >
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors ${filter === value ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                {t(`filters.${value}`)}
                <span className="font-normal tabular-nums opacity-75">{format.number(badges.filter((badge) => value === "all" || badge.category === value).length)}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 px-3 text-xs text-muted-foreground sm:px-0">
          {(["earned", "growing", "locked"] as const).map((status) => (
            <span className="flex items-center gap-1.5" key={status}>
              <span aria-hidden="true" className={`size-1.5 rounded-full ${status === "earned" ? "bg-primary" : status === "growing" ? "bg-amber-500" : "bg-stone-400"}`} />
              {t(`status.${status}`)} ({format.number(badges.filter((badge) => badge.status === status).length)})
            </span>
          ))}
        </div>
      </div>
      <p aria-live="polite" className="sr-only">{t("results", { count: format.number(visible.length) })}</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((badge) => (
          <Dialog key={badge.id}>
            <DialogTrigger asChild>
              <button
                className={`group flex min-w-0 flex-col overflow-hidden rounded-2xl bg-card text-center shadow-card transition-shadow hover:shadow-md ${badge.status === "growing" ? "ring-1 ring-amber-200" : ""}`}
                type="button"
              >
                <div className="flex w-full flex-1 flex-col items-center px-3 pb-4 pt-3 sm:px-4">
                  <span className={`mb-2 inline-flex items-center gap-1 self-end rounded-full px-2.5 py-1 text-xs font-bold ${statusColors[badge.status]}`}>
                    <MaterialSymbol className="text-sm" name={badge.status === "locked" ? "lock" : badge.status === "earned" ? "check_circle" : "schedule"} />
                    {t(`status.${badge.status}`)}
                  </span>
                  <Image loading="eager" alt="" className={`my-1.5 drop-shadow-sm ${badge.status === "locked" ? "grayscale opacity-60" : ""}`} height={84} src={`/stitch/reward/badge-${badge.id}.svg`} width={84} />
                  <h2 className="mt-2 text-[15px] font-semibold leading-5 group-hover:text-primary">{t(`badges.${badge.id}.title`)}</h2>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{t(`badges.${badge.id}.subtitle`)}</p>
                  <p className="mt-2 text-xs leading-4 text-muted-foreground">{t(`badges.${badge.id}.description`)}</p>
                </div>
                <div className={`w-full space-y-2 px-3 py-3 text-xs sm:px-4 ${badge.status === "growing" ? "bg-amber-50/70 text-amber-800" : badge.status === "locked" ? "bg-stone-50 text-stone-600" : "bg-secondary/60 text-primary"}`}>
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
              <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[91] grid w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-3 rounded-2xl text-foreground shadow-xl outline-none journal-write-theme max-h-[90dvh] overflow-y-auto bg-card p-5 text-center font-body-md sm:max-w-[336px]">
              <Image loading="eager" alt="" className={`mx-auto ${badge.status === "locked" ? "grayscale opacity-60" : ""}`} height={96} src={`/stitch/reward/badge-${badge.id}.svg`} width={96} />
              <span className={`mx-auto rounded-full px-3 py-1 text-xs font-semibold ${statusColors[badge.status]}`}>{t(`status.${badge.status}`)}</span>
              <DialogTitle className="text-lg font-bold leading-6">{t(`badges.${badge.id}.title`)}</DialogTitle>
              <p className="text-xs font-semibold text-primary">{t(`badges.${badge.id}.subtitle`)}</p>
              <DialogDescription className="text-xs leading-5">{t(`badges.${badge.id}.description`)}</DialogDescription>
              <dl className="space-y-3 rounded-xl bg-muted p-3 text-left text-xs">
                <div><dt className="font-semibold">{t("condition")}</dt><dd className="mt-1 text-muted-foreground">{t(`badges.${badge.id}.condition`)}</dd></div>
                <div><dt className="font-semibold">{t("detailProgress")}</dt><dd className="mt-1 text-primary">{progressText(badge)}</dd></div>
              </dl>
              <DialogClose className="min-h-11 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-[var(--primary-hover)]">{t("close")}</DialogClose>
            </DialogPrimitive.Content>
            </DialogPortal>
          </Dialog>
        ))}
      </div>
    </section>
  );
}
