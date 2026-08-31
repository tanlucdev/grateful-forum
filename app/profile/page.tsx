import Link from "next/link";
import { AuthPanel } from "@/components/auth/auth-panel";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { loadOwnProfileDashboard } from "@/lib/profile/load-own-profile";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function ProfilePage() {
  const dashboard = await loadOwnProfileDashboard();

  if (!dashboard) {
    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            Profile
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Your journal.</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Sign in to edit your profile, keep your streak, and claim guest entries.
          </p>
        </div>
        <AuthPanel configured={hasSupabaseEnv()} />
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            Profile
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {dashboard.profile.displayName}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Your journal, streak, and public face.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--text)]"
          href="/feed"
        >
          Feed
        </Link>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <Metric label="Entries" value={String(dashboard.entryCount)} />
        <Metric label="Streak" value={`${dashboard.streak} days`} />
        <Metric label="Journal" value="My Journal" />
      </section>

      <ProfileEditor profile={dashboard.profile} />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          My Journal
        </h2>
        <div className="grid gap-3">
          {dashboard.entries.map((entry) => (
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
