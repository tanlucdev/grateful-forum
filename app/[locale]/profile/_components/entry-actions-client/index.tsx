"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { deleteEntry, updateEntryVisibility } from "@/lib/api/entries";
import type { JournalEntry } from "@/lib/profile/types";

const visibilityActions = [
  ["private", "lock"],
  ["public", "public"],
  ["anonymous", "visibility_off"],
] as const;

export function EntryActionsClient({ entry }: Readonly<{ entry: JournalEntry }>) {
  const t = useTranslations("profile");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function setVisibility(visibility: JournalEntry["visibility"]) {
    setOpen(false);
    setSaving(true);
    try {
      await updateEntryVisibility(entry.id, visibility);
      toast.success(t("toasts.visibilityChanged", { visibility: t(`visibility.${visibility}`) }));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("errors.visibility"));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setSaving(true);
    try {
      await deleteEntry(entry.id);
      setDeleteOpen(false);
      toast.success(t("toasts.deleted"));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("errors.delete"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DropdownMenu onOpenChange={setOpen} open={open}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={t("a11y.entryOptions")}
            className="h-11 w-11 rounded-full"
            disabled={saving}
            size="icon"
            type="button"
            variant="ghost"
          >
            <MaterialSymbol name="more_horiz" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-1.5">
          {entry.entryKind === "text" ? visibilityActions.map(([value, icon]) => (
            <DropdownMenuItem
              className="min-h-11 gap-2 px-2.5 text-sm"
              disabled={saving || value === entry.visibility}
              key={value}
              onSelect={() => void setVisibility(value)}
            >
              <MaterialSymbol className="text-base" name={icon} />
              {t(`visibility.${value}`)}
            </DropdownMenuItem>
          )) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="min-h-11 gap-2 px-2.5 text-sm"
            disabled={saving}
            onSelect={() => {
              setOpen(false);
              setDeleteOpen(true);
            }}
            variant="destructive"
          >
            <MaterialSymbol className="text-base" name="delete" />
            {t("actions.deleteEntry")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog onOpenChange={(nextOpen) => { if (!saving) setDeleteOpen(nextOpen); }} open={deleteOpen}>
        <DialogContent showCloseButton={!saving}>
          <DialogHeader>
            <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={saving} onClick={() => setDeleteOpen(false)} type="button" variant="outline">
              {t("commonCancel")}
            </Button>
            <Button disabled={saving} onClick={() => void remove()} type="button" variant="destructive">
              {saving ? t("actions.deleting") : t("actions.deleteEntry")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
