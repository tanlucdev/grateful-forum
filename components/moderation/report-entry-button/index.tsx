"use client";

import { useState } from "react";
import { reportEntry } from "@/lib/api/reports";
import { MaterialSymbol } from "@/components/ui/material-symbol";

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
      setStatus("Đã gửi báo cáo.");
      setOpen(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Không thể gửi báo cáo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3">
      <button
        aria-expanded={open}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#f7fbf9] px-3 text-xs font-bold text-[#52645b] shadow-[0_1px_4px_rgba(26,47,43,0.04)] ring-1 ring-[#e3eee8] transition-colors hover:bg-white hover:text-[#852229] hover:ring-[#f0c9c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99f3b6] focus-visible:ring-offset-2"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <MaterialSymbol className="text-[15px]" name="flag" />
        Báo cáo
      </button>
      {open ? (
        <div className="mt-3 rounded-2xl bg-white p-3 shadow-[0_12px_28px_rgba(45,60,50,0.08)] ring-1 ring-[#e5eee9]">
          <label className="text-sm font-medium text-[#1c3b2c]" htmlFor={`reason-${entryId}`}>
            Lý do
          </label>
          <textarea
            className="mt-2 min-h-24 w-full resize-none rounded-xl border border-[#d5e2dc] bg-white p-3 text-sm text-[#1c3b2c] outline-none focus:border-[#00a86b]"
            id={`reason-${entryId}`}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Spam, nội dung không an toàn, thông tin riêng tư..."
            value={reason}
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              className="inline-flex min-h-10 items-center rounded-full bg-[#006d43] px-4 text-sm font-bold text-white shadow-[0_6px_14px_rgba(0,109,67,0.14)] transition-colors hover:bg-[#145C34] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={saving || reason.trim().length < 3}
              onClick={submit}
              type="button"
            >
              Gửi
            </button>
            <button
              className="inline-flex min-h-10 items-center rounded-full bg-[#f7fbf9] px-4 text-sm font-semibold text-[#1c3b2c] ring-1 ring-[#d5e2dc] transition-colors hover:bg-white"
              onClick={() => setOpen(false)}
              type="button"
            >
              Hủy
            </button>
            <p className="text-sm text-[#6b7a74]" role="status">
              {status}
            </p>
          </div>
        </div>
      ) : status ? (
        <p className="mt-2 text-sm text-[#6b7a74]" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}
