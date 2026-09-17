"use client";

import { useRouter } from "next/navigation";
import { EyeOff, Trash2, Check, X } from "lucide-react";
import { updateModerationReport } from "@/lib/api/moderation";
import type { ModerationReport } from "@/lib/moderation/dto";

const actions = [
  { action: "review", label: "Review", icon: Check },
  { action: "dismiss", label: "Dismiss", icon: X },
  { action: "hide", label: "Hide", icon: EyeOff },
  { action: "delete", label: "Delete", icon: Trash2 },
] as const;

export function ModerationQueueClient({
  reports,
}: Readonly<{ reports: ModerationReport[] }>) {
  const router = useRouter();

  async function act(report: ModerationReport, action: (typeof actions)[number]["action"]) {
    await updateModerationReport({
      reportId: report.id,
      entryId: report.entry?.id,
      action,
    });
    router.refresh();
  }

  return (
    <section className="grid gap-3">
      {reports.length ? reports.map((report) => (
        <article
          className="soft-surface rounded-lg border border-border bg-card p-4"
          key={report.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {report.status}
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {report.reason}
              </p>
            </div>
            <span className="rounded-full border border-border bg-background px-2 py-1 text-xs text-muted-foreground">
              {new Date(report.createdAt).toLocaleDateString("en")}
            </span>
          </div>
          {report.entry ? (
            <p className="mt-4 whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm leading-6 text-foreground">
              {report.entry.content}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {actions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground"
                  key={item.action}
                  onClick={() => void act(report, item.action)}
                  type="button"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </article>
      )) : (
        <p className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          No reports need review.
        </p>
      )}
    </section>
  );
}
