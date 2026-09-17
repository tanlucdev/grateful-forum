"use client";

import { useState } from "react";
import { reportEntry } from "@/lib/api/reports";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Textarea } from "@/components/ui/textarea";

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
      <Button
        aria-expanded={open}
        className="rounded-full text-xs font-bold shadow-sm"
        onClick={() => setOpen((value) => !value)}
        size="sm"
        type="button"
        variant="outline"
      >
        <MaterialSymbol className="text-[15px]" name="flag" />
        Báo cáo
      </Button>
      {open ? (
        <div className="mt-3 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border">
          <Label htmlFor={`reason-${entryId}`}>
            Lý do
          </Label>
          <Textarea
            className="mt-2 min-h-24 resize-none rounded-xl bg-card"
            id={`reason-${entryId}`}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Spam, nội dung không an toàn, thông tin riêng tư..."
            value={reason}
          />
          <div className="mt-3 flex items-center gap-3">
            <Button
              disabled={saving || reason.trim().length < 3}
              onClick={submit}
              type="button"
            >
              Gửi
            </Button>
            <Button
              onClick={() => setOpen(false)}
              type="button"
              variant="outline"
            >
              Hủy
            </Button>
            <p className="text-sm text-muted-foreground" role="status">
              {status}
            </p>
          </div>
        </div>
      ) : status ? (
        <p className="mt-2 text-sm text-muted-foreground" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}
