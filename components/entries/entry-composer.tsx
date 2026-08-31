"use client";

import { useMemo, useState } from "react";
import { Check, Send } from "lucide-react";
import {
  ENTRY_LIMIT,
  entryVisibilities,
  type EntryVisibility,
} from "@/lib/entries/types";
import { addLocalEntry, markLocalEntrySynced } from "@/lib/entries/local-store";

const labels: Record<EntryVisibility, string> = {
  private: "Private",
  public: "Public",
  anonymous: "Anonymous",
};

const starterPrompts = [
  "Today I am grateful for...",
  "A small kindness I noticed was...",
  "Something that felt steady today was...",
];

export function EntryComposer() {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<EntryVisibility>("private");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const remaining = ENTRY_LIMIT - content.length;
  const canSubmit = useMemo(
    () => content.trim().length > 0 && remaining >= 0 && !saving,
    [content, remaining, saving],
  );

  async function submit() {
    if (!canSubmit) {
      return;
    }

    setSaving(true);
    setStatus("");
    const local = addLocalEntry(content.trim(), visibility);

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, visibility }),
      });
      const result = (await response.json()) as { saved?: boolean; error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not save entry.");
      }

      if (result.saved) {
        markLocalEntrySynced(local.id);
      }

      setContent("");
      setStatus(result.saved ? "Saved." : "Saved on this device.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Saved on this device.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-88px)] flex-col pb-28">
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-5 sm:px-6">
        <label className="text-sm font-medium text-[var(--text)]" htmlFor="entry">
          What are you grateful for today?
        </label>
        <textarea
          className="mt-3 min-h-64 w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-base leading-7 outline-none focus:border-[var(--trust)]"
          id="entry"
          maxLength={ENTRY_LIMIT}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Today I noticed..."
          value={content}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <button
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--muted)]"
              key={prompt}
              onClick={() => setContent(prompt)}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
          {entryVisibilities.map((option) => (
            <button
              aria-pressed={visibility === option}
              className="min-h-11 rounded-full px-2 text-sm font-medium text-[var(--muted)] data-[active=true]:bg-[var(--text)] data-[active=true]:text-white"
              data-active={visibility === option}
              key={option}
              onClick={() => setVisibility(option)}
              type="button"
            >
              {labels[option]}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-[var(--border)] bg-[var(--bg)]/95 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
          <p className="min-w-0 flex-1 text-sm text-[var(--muted)]" role="status">
            {status || `${remaining} characters left`}
          </p>
          <button
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white disabled:opacity-50"
            disabled={!canSubmit}
            onClick={submit}
            type="button"
          >
            {status === "Saved." ? (
              <Check className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Save
          </button>
        </div>
      </div>
    </section>
  );
}
