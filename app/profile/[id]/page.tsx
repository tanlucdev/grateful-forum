import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportEntryButton } from "@/components/moderation/report-entry-button";
import { loadPublicProfile } from "@/lib/profile/load-public-profile";

export default async function PublicProfilePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const profile = await loadPublicProfile(id);

  if (!profile) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
            {profile.profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" className="h-full w-full object-cover" src={profile.profile.avatarUrl} />
            ) : (
              <span className="text-sm font-semibold text-[var(--accent)]">
                {profile.profile.displayName.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Public profile
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {profile.profile.displayName}
            </h1>
            {profile.profile.username ? (
              <p className="mt-1 text-sm text-[var(--muted)]">@{profile.profile.username}</p>
            ) : null}
          </div>
        </div>
        <Link
          className="inline-flex min-h-11 items-center rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--text)]"
          href="/feed"
        >
          Back
        </Link>
      </div>

      {profile.profile.bio ? (
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
          {profile.profile.bio}
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2">
        <Metric label="Public entries" value={String(profile.publicEntryCount)} />
        <Metric label="Streak" value={`${profile.streak} days`} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Public journal
        </h2>
        <div className="grid gap-3">
          {profile.entries.map((entry) => (
            <article
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
              key={entry.id}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                  {entry.visibility}
                </span>
                <span className="text-xs text-[var(--muted)]">{formatDate(entry.createdAt)}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--text)]">
                {entry.content}
              </p>
              <ReportEntryButton entryId={entry.id} />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-[var(--text)]">{value}</p>
    </article>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
