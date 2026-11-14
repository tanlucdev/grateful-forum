"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateProfile } from "@/lib/api/profile";
import { ApiClientError } from "@/lib/api/fetch-json";
import { soulTitles, toSoulTitle } from "@/lib/profile/soul-titles";
import type { UpdateProfileRequest } from "@/lib/profile/dto";
import type { ProfileView } from "../profile-view";

const fieldClass = "min-h-11 w-full rounded-xl border border-border/40 bg-muted px-4 py-2.5 text-base leading-6 text-foreground outline-none transition-colors focus:border-primary disabled:opacity-60";
const buttonFocus = "focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-2";

export function ProfileEditModalButton({
  variant = "default",
  view,
}: Readonly<{ variant?: "default" | "icon"; view: ProfileView }>) {
  const t = useTranslations("profile");
  const format = useFormatter();
  const id = useId();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<UpdateProfileRequest>(() => draftFromView(view));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  function changeOpen(next: boolean) {
    if (saving) return;
    if (next) {
      setDraft(draftFromView(view));
      setStatus("");
    }
    setOpen(next);
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setStatus("");
    try {
      await updateProfile(draft);
      router.refresh();
      setOpen(false);
    } catch (error) {
      setStatus(t(error instanceof ApiClientError && error.code === "invalid_username" ? "edit.invalidUsername" : "edit.saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog onOpenChange={changeOpen} open={open}>
      <DialogTrigger asChild>
        <button
          aria-label={t("actions.editProfile")}
          className={`${variant === "icon" ? "inline-flex h-11 w-11 items-center justify-center rounded-full bg-muted text-primary" : "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[10px] bg-secondary px-[13px] text-xs font-semibold text-foreground"} shadow-sm transition-colors hover:bg-input ${buttonFocus}`}
          type="button"
        >
          <MaterialSymbol className="text-sm" name={variant === "icon" ? "edit_note" : "tune"} />
          {variant === "icon" ? null : <span>{t("actions.editProfile")}</span>}
        </button>
      </DialogTrigger>
      <DialogContent overlayClassName="z-[200]" className="z-[200] flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden rounded-2xl bg-card p-0 sm:max-w-xl" showCloseButton={false}>
        <div className="flex items-start justify-between gap-3 border-b border-border p-4 sm:p-6">
          <div className="min-w-0">
            <DialogTitle className="text-xl font-semibold leading-7">{t("edit.title")}</DialogTitle>
            <DialogDescription className="mt-1 text-xs leading-5">{t("edit.description")}</DialogDescription>
          </div>
          <button aria-label={t("edit.close")} className={`flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-muted ${buttonFocus}`} disabled={saving} onClick={() => changeOpen(false)} type="button">
            <MaterialSymbol className="text-xl" name="close" />
          </button>
        </div>
        <form aria-busy={saving} className="flex min-h-0 min-w-0 flex-col" onSubmit={save}>
          <fieldset className="min-h-0 min-w-0 space-y-6 overflow-y-auto p-4 disabled:opacity-70 sm:p-6" disabled={saving}>
            <div className="flex justify-center">
              <span aria-hidden="true" className="block size-20 shrink-0 rounded-full bg-secondary bg-cover bg-center" style={{ backgroundImage: `url(${draft.avatarUrl || view.avatarDesktop})` }} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold" htmlFor={`${id}-name`}>{t("edit.name")}</label>
              <input autoComplete="name" className={fieldClass} id={`${id}-name`} maxLength={120} onChange={(event) => setDraft({ ...draft, displayName: event.target.value })} value={draft.displayName} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold" htmlFor={`${id}-title`}>{t("edit.soulTitle")}</label>
              <Select disabled={saving} onValueChange={(value) => setDraft({ ...draft, soulTitle: toSoulTitle(value) })} value={draft.soulTitle}>
                <SelectTrigger className="min-h-11 w-full rounded-xl border-border/40 bg-muted px-4 text-base" id={`${id}-title`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[210]" position="popper">
                  {soulTitles.map((title) => <SelectItem className="min-h-11 px-4 pr-8" key={title} value={title}>{t(`soulTitles.${title}`)}</SelectItem>)}
                </SelectContent>
              </Select>
              <div aria-label={t("edit.suggestions")} className="flex flex-wrap items-center gap-2" role="group">
                <span className="text-xs text-muted-foreground">{t("edit.suggestions")}</span>
                {soulTitles.slice(1).map((title) => (
                  <button aria-pressed={draft.soulTitle === title} className={`min-h-11 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${buttonFocus} ${draft.soulTitle === title ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-input"}`} key={title} onClick={() => setDraft({ ...draft, soulTitle: title })} type="button">
                    {t(`soulTitles.${title}`)}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-semibold" htmlFor={`${id}-bio`}>{t("edit.bio")}</label>
                <span className="text-xs text-muted-foreground">{format.number(draft.bio.length)}/{format.number(120)}</span>
              </div>
              <textarea className={`${fieldClass} min-h-20 resize-y`} id={`${id}-bio`} maxLength={120} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} rows={3} value={draft.bio} />
            </div>
            <div className="space-y-1.5 rounded-xl bg-muted p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold"><MaterialSymbol className="text-lg text-primary" name="lock" />{t("editPrivacy.title")}</h3>
              <p className="text-xs leading-5 text-muted-foreground">{t("editPrivacy.description")}</p>
            </div>
          </fieldset>
          {status ? <p className="px-4 pb-3 text-sm text-destructive sm:px-6" role="alert">{status}</p> : null}
          <div className="flex flex-wrap justify-end gap-3 border-t border-border bg-muted/60 p-4 sm:px-6">
            <button className={`min-h-11 rounded-xl border border-border px-4 text-sm font-medium hover:bg-input ${buttonFocus}`} disabled={saving} onClick={() => changeOpen(false)} type="button">{t("commonCancel")}</button>
            <button className={`min-h-11 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-60 ${buttonFocus}`} disabled={saving} type="submit">{t(saving ? "edit.saving" : "edit.save")}</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function draftFromView(view: ProfileView): UpdateProfileRequest {
  return { displayName: view.displayName, username: view.username, avatarUrl: view.avatarDesktop, bio: view.bio, soulTitle: view.soulTitle };
}
