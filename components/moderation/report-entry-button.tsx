"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { reportEntry } from "@/lib/api";

export function ReportEntryButton({ entryId }: Readonly<{ entryId: string }>) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    setStatus("");

    try {
      await reportEntry(entryId, reason);
      setReason("");
      setStatus("Reported.");
      setOpen(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not report entry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        aria-expanded={open}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-medium text-[var(--muted)]"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Flag className="h-4 w-4" />
        Report
      </button>
      {open ? (
        <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-3 shadow-[0_12px_28px_rgba(50,39,26,0.08)]">
          <label className="text-sm font-medium text-[var(--text)]" htmlFor={`reason-${entryId}`}>
            Reason
          </label>
          <textarea
            className="mt-2 min-h-24 w-full resize-none rounded-lg border border-[var(--border)] bg-white p-3 text-sm outline-none focus:border-[var(--trust)]"
            id={`reason-${entryId}`}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Spam, unsafe content, private information..."
            value={reason}
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--text)] px-4 text-sm font-medium text-white disabled:opacity-50"
              disabled={saving || reason.trim().length < 3}
              onClick={submit}
              type="button"
            >
              Submit
            </button>
            <button
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--text)]"
              onClick={() => setOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <p className="text-sm text-[var(--muted)]" role="status">
              {status}
            </p>
          </div>
        </div>
      ) : status ? (
        <p className="mt-2 text-sm text-[var(--muted)]" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}
