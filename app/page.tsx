import { ArrowRight, FileText, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  {
    icon: FileText,
    title: "Write fast",
    body: "Short gratitude entries with guest-first capture.",
  },
  {
    icon: Sparkles,
    title: "Share selectively",
    body: "Public, anonymous, or account-linked visibility.",
  },
  {
    icon: ShieldCheck,
    title: "Keep work safe",
    body: "Supabase auth, profiles, reports, and moderation.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          Foundation ready
        </p>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
              BeGrateful
            </h1>
            <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
              A calm mobile web shell for gratitude writing, public sharing, and
              account-backed persistence.
            </p>
          </div>
          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[var(--accent)]" />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <Icon className="h-5 w-5 text-[var(--accent)]" />
              <h2 className="mt-3 text-sm font-semibold text-[var(--text)]">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {item.body}
              </p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
