import { loadAdminQueue } from "@/lib/moderation/load-admin-queue";
import { ModerationQueueClient } from "./_components/moderation-queue-client";

export default async function ModerationPage() {
  const queue = await loadAdminQueue();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6">
      <section className="soft-surface rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Moderation queue
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Review reports, dismiss noise, hide entries, or delete severe content.
        </p>
      </section>

      {queue.admin ? (
        <ModerationQueueClient reports={queue.reports} />
      ) : (
        <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
          Admin access required.
        </section>
      )}
    </main>
  );
}
