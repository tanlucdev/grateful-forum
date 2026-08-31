"use client";

import { useState } from "react";
import { Flag } from "lucide-react";

export function ReportEntryButton({ entryId }: Readonly<{ entryId: string }>) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    setStatus("");

    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId, reason }),
    });
    const result = (await response.json()) as { error?: string };

    setSaving(false);

    if (!response.ok) {
      setStatus(result.error ?? "Could not report entry.");
      return;
    }

    setReason("");
    setStatus("Reported.");
    setOpen(false);
  }

  return (
    <div className="mt-4">
      <button
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] px-3 text-xs font-medium text-[var(--muted)]"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Flag className="h-4 w-4" />
        Report
      </button>
      {open ? (
        <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3">
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
