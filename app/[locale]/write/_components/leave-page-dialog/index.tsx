"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertDialog } from "radix-ui";
import { Button } from "@/components/ui/button";
import { installLeavePageGuard, leavePageState } from "@/lib/entries/leave-page";

export function useLeavePage(dirty: boolean, saving: boolean) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const state = useRef({ dirty, saving });
  const pending = useRef<(() => void) | null>(null);
  const guard = useRef<ReturnType<typeof installLeavePageGuard> | null>(null);
  useEffect(() => { state.current = { dirty, saving }; }, [dirty, saving]);
  const requestLeave = useCallback((action: () => void) => {
    const decision = leavePageState(state.current.dirty, state.current.saving);
    if (decision === "blocked") return;
    if (decision === "allow") { action(); return; }
    if (pending.current) return;
    pending.current = action;
    setOpen(true);
  }, []);

  useEffect(() => {
    const active = installLeavePageGuard(window, () => state.current, requestLeave, (href) => router.push(href));
    guard.current = active;
    return () => { active.dispose(); guard.current = null; };
  }, [requestLeave, router]);

  function onOpenChange(value: boolean) {
    setOpen(value);
    if (!value) pending.current = null;
  }
  function confirm() {
    if (state.current.saving) return;
    const action = pending.current;
    pending.current = null;
    setOpen(false);
    guard.current?.approve();
    action?.();
  }
  return { requestLeave, dialog: <LeavePageDialog onConfirm={confirm} onOpenChange={onOpenChange} open={open} saving={saving} /> };
}

function LeavePageDialog({ onConfirm, onOpenChange, open, saving }: Readonly<{ onConfirm: () => void; onOpenChange: (open: boolean) => void; open: boolean; saving: boolean }>) {
  const t = useTranslations("write.navigation");
  return <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
    <AlertDialog.Portal><AlertDialog.Overlay className="fixed inset-0 z-[2100] bg-black/25" />
      <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[2101] grid w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl bg-popover p-5 text-popover-foreground shadow-lg">
        <AlertDialog.Title className="text-lg font-bold">{t("title")}</AlertDialog.Title>
        <AlertDialog.Description className="text-sm text-muted-foreground">{t("discard")}</AlertDialog.Description>
        <div className="flex flex-wrap justify-end gap-2"><AlertDialog.Cancel asChild><Button variant="secondary">{t("continue")}</Button></AlertDialog.Cancel><Button disabled={saving} onClick={onConfirm} variant="destructive">{t("leave")}</Button></div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>;
}
