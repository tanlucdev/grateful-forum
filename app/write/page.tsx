import { EntryComposer } from "@/components/entries/entry-composer";

export default function WritePage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-2xl px-4 pt-6 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
          Write
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Capture one grateful thing.
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
          Guest entries save right away. Sign-in state can claim them later.
        </p>
      </div>
      <EntryComposer />
    </main>
  );
}
