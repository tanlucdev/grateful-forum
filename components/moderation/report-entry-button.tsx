"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { reportEntry } from "@/lib/api/reports";

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
    <div className="mt-4">
      <button
        aria-expanded={open}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d5e2dc] bg-white px-3 text-xs font-medium text-[#4a5752] hover:border-emerald-200 hover:bg-emerald-50"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Flag className="h-4 w-4" />
        Báo cáo
      </button>
      {open ? (
        <div className="mt-3 rounded-2xl border border-[#e5eee9] bg-white p-3 shadow-[0_12px_28px_rgba(45,60,50,0.08)]">
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
              className="inline-flex min-h-11 items-center rounded-full bg-[#00a86b] px-4 text-sm font-bold text-white disabled:opacity-50"
              disabled={saving || reason.trim().length < 3}
              onClick={submit}
              type="button"
            >
              Gửi
            </button>
            <button
              className="inline-flex min-h-11 items-center rounded-full border border-[#d5e2dc] bg-white px-4 text-sm font-medium text-[#1c3b2c]"
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
