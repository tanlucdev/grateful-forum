"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import "./composer.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ApiClientError } from "@/lib/api/fetch-json";
import { localizedLoginHref } from "@/lib/auth/redirects";
import { createEntry, getRecentSpaces } from "@/lib/api/entries";
import { createHandwrittenEntry } from "@/lib/api/handwritten-entries";
import { handwritingSaveErrorKey } from "@/lib/api/handwritten-entry-errors";
import { uploadEntryMedia } from "@/lib/api/entry-media";
import type { StickerId } from "@/lib/entries/stickers";
import { validComposerEntry, canSubmitEntry } from "@/lib/entries/composer";
import { validateEntryMediaFile } from "@/lib/entry-media/validation";
import { JournalBookContent } from "@/components/entries/journal-book";
import { HandwritingViewer } from "@/components/entries/handwriting-viewer";
import { Link } from "@/i18n/navigation";
import { JournalEditor } from "../journal-editor";
import type { EntryVisibility, InkDocument } from "@/lib/entries/types";
import { removeLocalHandwrittenEntry, upsertLocalHandwrittenEntry } from "@/lib/entries/local-store";
import type { HandwritingComposerHandle } from "../handwriting-composer";
import { JournalDecoration } from "../journal-decoration";


const HandwritingComposer = dynamic(() => import("../handwriting-composer").then((module) => module.HandwritingComposer), { ssr: false });

export function EntryComposerClient() {
  const t = useTranslations("write");
  const locale = useLocale();
  const submitting = useRef(false);
  const handwritingRef = useRef<HandwritingComposerHandle>(null);
  const [method, setMethod] = useState<"text" | "handwritten">("text");
  const [visibility, setVisibility] = useState<EntryVisibility>("private");
  const [gratitudes, setGratitudes] = useState([{ id: 0, text: "" }]);
  const [reflection, setReflection] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [space, setSpace] = useState("");
  const [recentSpaces, setRecentSpaces] = useState<string[]>([]);
  const [washi, setWashi] = useState<string | null>(null);
  const [quote, setQuote] = useState("");
  const [sticker, setSticker] = useState<StickerId | null>(null);
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null);
  const image = photo?.file ?? null;
  const [imageError, setImageError] = useState<"book.invalidImage" | null>(null);
  function setImage(file: File | null) {
    try { if (file) validateEntryMediaFile(file); } catch { setImageError("book.invalidImage"); return; }
    setImageError(null);
    setPhoto(file ? { file, url: URL.createObjectURL(file) } : null);
  }
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo.url); }, [photo]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ id: string; createdAt: string } | null>(null);
  const [status, setStatus] = useState<Parameters<typeof t>[0] | null>(null);
  const [inkDocument, setInkDocument] = useState<InkDocument>({ version: 1, orientation: "portrait", paperStyle: "ruled", stamp: "none", strokes: [] });
  const [pendingId, setPendingId] = useState<string | null>(null);
  const filled = useMemo(() => gratitudes.map((item) => item.text.trim()).filter(Boolean), [gratitudes]);
  const payload = { visibility, gratitudes: filled, reflection, mood, space, washi, quote, sticker };
  const validText = validComposerEntry(payload);
  const canSaveText = canSubmitEntry(validText, saving, saved !== null);
  const canSaveInk = canSubmitEntry(inkDocument.strokes.length > 0, saving, saved !== null);
  const date = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date()), [locale]);

  useEffect(() => { getRecentSpaces().then(({ spaces }) => setRecentSpaces(spaces)).catch(() => setRecentSpaces([])); }, []);

  function updateRecentSpaces(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setRecentSpaces((spaces) => [trimmed, ...spaces.filter((item) => item.localeCompare(trimmed, undefined, { sensitivity: "accent" }) !== 0)].slice(0, 8));
  }

  async function saveText() {
    if (!canSaveText || submitting.current) return;
    submitting.current = true;
    setSaving(true);
    setStatus(null);
    try {
      let imageUrl: string | null = null;
      if (image) {
        const media = await uploadEntryMedia(image);
        if (!media.uploaded) throw new Error("media_upload_failed");
        imageUrl = media.url;
      }
      const result = await createEntry({ ...payload, imageUrl });
      if (!result.saved) throw new Error("entry_unsynced");
      updateRecentSpaces(space);
      setSaved({ id: result.entry.id, createdAt: result.entry.created_at });
      setStatus("text.saved");
    } catch (error) {
      setStatus(error instanceof ApiClientError && error.code === "auth_required" ? "errors.authRequired" : "errors.entryFailed");
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  async function saveHandwriting() {
    if (!canSaveInk || submitting.current) return;
    submitting.current = true;
    setSaving(true);
    setStatus(null);
    try {
      const preview = visibility === "private" ? null : await handwritingRef.current?.exportPreview() ?? null;
      if (visibility !== "private" && !preview) throw new Error("preview-unavailable");
      const result = await createHandwrittenEntry({ document: inkDocument, visibility }, preview);
      if (!result.saved) throw new Error("entry_unsynced");
      if (pendingId) removeLocalHandwrittenEntry(pendingId);
      setPendingId(null);
      setSaved({ id: result.entry.id, createdAt: result.entry.created_at });
      setStatus("handwriting.saved");
    } catch (error) {
      if (error instanceof ApiClientError && error.code === "auth_required") {
        setStatus("errors.authRequired");
        return;
      }
      const pending = upsertLocalHandwrittenEntry(pendingId, inkDocument, visibility);
      setPendingId(pending.id);
      const mediaKey = handwritingSaveErrorKey(error);
      setStatus(mediaKey ?? "handwriting.pending");
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  const submit = method === "text" ? saveText : saveHandwriting;
  const canSubmit = method === "text" ? canSaveText : canSaveInk;

  function newPage() {
    setSaved(null); setStatus(null); setVisibility("private"); setMethod("text");
    setGratitudes([{ id: 0, text: "" }]); setReflection(""); setMood(null); setSpace("");
    setWashi(null); setQuote(""); setSticker(null); setImage(null); setPendingId(null);
    setInkDocument((current) => ({ ...current, strokes: [] }));
  }
  const savedDate = saved ? new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" }).format(new Date(saved.createdAt)) : null;
  const saveHint = method === "text" && filled.length === 0 ? <><span className="lg:hidden">{t("book.gratitudeRequiredShort")}</span><span className="hidden lg:inline">{t("book.gratitudeRequired")}</span></> : method === "handwritten" && inkDocument.strokes.length === 0 ? t("book.handwritingRequired") : t("book.unsaved");
  const metadata = { entryKind: "text" as const, gratitudes: filled, reflection, mood, space, washi, quote, sticker, imageUrl: photo?.url ?? null, handwritingPreviewUrl: null };
  return <main className="journal-controls mx-auto min-h-dvh max-w-5xl px-3 pb-8 pt-6 sm:px-6">
    <fieldset className="min-w-0" disabled={saving || saved !== null}>
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground"><MaterialSymbol className="mr-2 text-primary" name="calendar_today" />{date}</p>
        <div className="flex rounded-full bg-muted p-1" role="group" aria-label={t("method.label")}>
          <MethodButton active={method === "text"} icon="edit_note" label={t("method.text")} onClick={() => setMethod("text")} />
          <MethodButton active={method === "handwritten"} icon="edit" label={t("method.handwritten")} onClick={() => setMethod("handwritten")} />
        </div>
      </header>
      {method === "text" && !saved ? <JournalDecoration image={image} imageError={imageError} quote={quote} setImage={setImage} setQuote={setQuote} setSticker={setSticker} setWashi={setWashi} sticker={sticker} washi={washi} /> : null}
      {method === "text" ? saved ? <JournalBookContent date={savedDate ?? date} metadata={metadata} /> : <JournalEditor date={date} gratitudes={gratitudes} imageUrl={photo?.url ?? null} mood={mood} quote={quote} recentSpaces={recentSpaces} reflection={reflection} setGratitudes={setGratitudes} setMood={setMood} setReflection={setReflection} setSpace={setSpace} space={space} sticker={sticker} washi={washi} /> : saved ? <HandwritingViewer document={inkDocument} label={t("handwriting.canvasLabel")} /> : <section className="rounded-3xl bg-card p-4 sm:p-6"><h1 className="mb-4 text-xl font-bold">{t("handwriting.title")}</h1><div inert={saving}><HandwritingComposer document={inkDocument} onChange={setInkDocument} ref={handwritingRef} /></div></section>}
    </fieldset>
    <section className="mt-5 grid grid-cols-1 items-center gap-3 rounded-2xl bg-card p-3 shadow-card sm:p-4 lg:sticky lg:bottom-4 lg:z-30 lg:grid-cols-[auto_1fr]" aria-label={t("book.finish")}>
      <fieldset className="min-w-0" disabled={saving || saved !== null}><Visibility disabled={saving || saved !== null} value={visibility} onChange={setVisibility} t={t as unknown as (key: string) => string} /></fieldset>
      <div className="grid min-w-0 grid-cols-1 gap-3 lg:flex lg:flex-wrap lg:items-center lg:justify-end">
        <p aria-live="polite" className="min-w-0 text-sm text-muted-foreground [overflow-wrap:anywhere]" id="entry-save-status">{saved ? t("book.savedAt", { time: savedDate! }) : saving ? t("save.saving") : status ? t(status) : saveHint}</p>
        {!saved ? <button aria-describedby="entry-save-status" className="min-h-11 shrink-0 rounded-xl bg-primary px-5 font-bold text-white disabled:opacity-50" data-tour="save" disabled={!canSubmit} onClick={submit} type="button">{saving ? t("save.saving") : status ? t("save.retry") : t("save.action")}</button> : <><Link className="inline-flex min-h-11 items-center rounded-xl px-3 font-semibold text-primary" href={`/profile?entry=${saved.id}`}>{t("book.viewProfile")}</Link><button className="min-h-11 rounded-xl bg-primary px-4 font-semibold text-white" onClick={newPage} type="button">{t("book.newPage")}</button></>}
      </div>
      {method === "text" && filled.length > 0 && !validText && !saved ? <p className="text-sm text-destructive lg:col-span-2" role="alert">{t("book.invalidContent")}</p> : null}
      {status === "errors.authRequired" ? <div className="min-w-0 lg:col-span-2" role="alert"><a className="inline-flex min-h-11 items-center rounded-xl px-3 font-semibold text-primary underline" href={localizedLoginHref("/write", locale)} target="_blank" rel="noopener noreferrer">{t("save.signInNewTab")}</a></div> : null}
    </section>
  </main>;
}

function MethodButton({ active, icon, label, onClick }: Readonly<{ active: boolean; icon?: string; label: string; onClick: () => void }>) {
  return <button aria-pressed={active} className={`min-h-11 rounded-full px-3 text-sm font-semibold outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring sm:px-4 ${active ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`} onClick={onClick} type="button">{icon ? <MaterialSymbol className="mr-1" name={icon} /> : null}{label}</button>;
}

function Visibility({ disabled, onChange, t, value }: Readonly<{ disabled: boolean; value: EntryVisibility; onChange: (value: EntryVisibility) => void; t: (key: string) => string }>) {
  return <div className="flex min-w-0 flex-wrap items-center gap-3 text-sm font-semibold" data-tour="visibility">
    <label htmlFor="entry-visibility">{t("visibility.label")}</label>
    <Select disabled={disabled} onValueChange={(next) => {
      if (next === "private" || next === "public" || next === "anonymous") onChange(next);
    }} value={value}>
      <SelectTrigger className="min-h-11 min-w-0 flex-1 rounded-xl bg-muted px-3 sm:min-w-44 sm:flex-none" id="entry-visibility"><SelectValue /></SelectTrigger>
      <SelectContent align="start" className="max-w-[calc(100vw-2rem)] rounded-xl p-1" position="popper" sideOffset={4}>
        {(["private", "public", "anonymous"] as const).map((item) => <SelectItem className="min-h-11 rounded-lg px-3 pr-9" key={item} value={item}>{t(`visibility.${item}`)}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>;
}
