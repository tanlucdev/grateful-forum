"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { createEntry, getRecentSpaces } from "@/lib/api/entries";
import { createHandwrittenEntry } from "@/lib/api/handwritten-entries";
import { handwritingSaveErrorKey } from "@/lib/api/handwritten-entry-errors";
import { uploadEntryMedia } from "@/lib/api/entry-media";
import { DEFAULT_STICKER_ID } from "@/lib/entries/stickers";
import type { EntryVisibility, InkDocument } from "@/lib/entries/types";
import { removeLocalHandwrittenEntry, upsertLocalHandwrittenEntry } from "@/lib/entries/local-store";
import { HandwritingComposer, type HandwritingComposerHandle } from "../handwriting-composer";
import { StickerPicker } from "../sticker-picker";

const MAX_GRATITUDES = 10;
const moods = ["calm", "light", "hopeful", "reflective"] as const;

export function EntryComposerClient() {
  const t = useTranslations("write");
  const locale = useLocale();
  const firstInput = useRef<HTMLTextAreaElement>(null);
  const handwritingRef = useRef<HandwritingComposerHandle>(null);
  const [method, setMethod] = useState<"text" | "handwritten">("text");
  const [mode, setMode] = useState<"minimal" | "creative">("minimal");
  const [visibility, setVisibility] = useState<EntryVisibility>("private");
  const [gratitudes, setGratitudes] = useState(["", "", ""]);
  const [reflection, setReflection] = useState("");
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [space, setSpace] = useState("");
  const [recentSpaces, setRecentSpaces] = useState<string[]>([]);
  const [washi, setWashi] = useState<string | null>(null);
  const [quote, setQuote] = useState("");
  const [sticker, setSticker] = useState(DEFAULT_STICKER_ID);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [inkDocument, setInkDocument] = useState<InkDocument>({ version: 1, orientation: "portrait", paperStyle: "ruled", stamp: "none", strokes: [] });
  const [pendingId, setPendingId] = useState<string | null>(null);
  const filled = useMemo(() => gratitudes.map((item) => item.trim()).filter(Boolean), [gratitudes]);
  const canSaveText = filled.length > 0 && !saving;
  const canSaveInk = inkDocument.strokes.length > 0 && !saving;
  const date = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date()), [locale]);

  useEffect(() => { firstInput.current?.focus(); }, []);
  useEffect(() => { getRecentSpaces().then(({ spaces }) => setRecentSpaces(spaces)).catch(() => setRecentSpaces([])); }, []);

  function updateGratitude(index: number, value: string) {
    setGratitudes((items) => items.map((item, itemIndex) => itemIndex === index ? value : item));
  }

  function addGratitude() {
    if (gratitudes.length < MAX_GRATITUDES) setGratitudes((items) => [...items, ""]);
  }

  function removeGratitude(index: number) {
    if (index >= 3) setGratitudes((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }

  function updateRecentSpaces(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setRecentSpaces((spaces) => [trimmed, ...spaces.filter((item) => item.localeCompare(trimmed, undefined, { sensitivity: "accent" }) !== 0)].slice(0, 8));
  }

  async function saveText() {
    if (!canSaveText) return;
    setSaving(true);
    setStatus(null);
    try {
      let imageUrl: string | null = null;
      if (image) {
        const media = await uploadEntryMedia(image);
        if (!media.uploaded) throw new Error("media_upload_failed");
        imageUrl = media.url;
      }
      const result = await createEntry({ visibility, gratitudes: filled, reflection, mood, space, washi: mode === "creative" ? washi : null, quote: mode === "creative" ? quote : null, sticker: mode === "creative" ? sticker : null, imageUrl });
      if (!result.saved) throw new Error("entry_unsynced");
      updateRecentSpaces(space);
      setGratitudes(["", "", ""]);
      setReflection("");
      setImage(null);
      setStatus("text.saved");
    } catch {
      setStatus("errors.entryFailed");
    } finally {
      setSaving(false);
    }
  }

  async function saveHandwriting() {
    if (!canSaveInk) return;
    setSaving(true);
    setStatus(null);
    try {
      const preview = visibility === "private" ? null : await handwritingRef.current?.exportPreview() ?? null;
      if (visibility !== "private" && !preview) throw new Error("preview-unavailable");
      const result = await createHandwrittenEntry({ document: inkDocument, visibility }, preview);
      if (!result.saved) throw new Error("entry_unsynced");
      if (pendingId) removeLocalHandwrittenEntry(pendingId);
      setPendingId(null);
      setInkDocument((current) => ({ ...current, strokes: [] }));
      setStatus("handwriting.saved");
    } catch (error) {
      const pending = upsertLocalHandwrittenEntry(pendingId, inkDocument, visibility);
      setPendingId(pending.id);
      const mediaKey = handwritingSaveErrorKey(error);
      setStatus(mediaKey ?? "handwriting.pending");
    } finally {
      setSaving(false);
    }
  }

  const submit = method === "text" ? saveText : saveHandwriting;
  const canSubmit = method === "text" ? canSaveText : canSaveInk;

  return <main className="mx-auto min-h-dvh max-w-5xl px-4 py-6 sm:px-6">
    <header className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      <p className="text-sm font-semibold text-muted-foreground md:justify-self-start">{date}</p>
      <div className="flex w-fit rounded-full bg-muted p-1 md:col-start-2" role="tablist" aria-label={t("method.label")}>
        <MethodButton active={method === "text"} icon="edit_note" label={t("method.text")} onClick={() => setMethod("text")} />
        <MethodButton active={method === "handwritten"} icon="edit" label={t("method.handwritten")} onClick={() => setMethod("handwritten")} />
      </div>
      <div className="sm:justify-self-end md:col-start-3"><SaveBar canSubmit={canSubmit} pending={pendingId !== null} saving={saving} status={status} submit={submit} t={t as unknown as (key: string, values?: Record<string, string | number>) => string} /></div>
    </header>
    {method === "text" ? <section className="space-y-5 rounded-3xl bg-card p-4 shadow-sm sm:p-6">
      <div className="flex rounded-full bg-muted p-1" role="tablist" aria-label={t("mode.label")}>
        <MethodButton active={mode === "minimal"} label={t("mode.minimal")} onClick={() => setMode("minimal")} />
        <MethodButton active={mode === "creative"} label={t("mode.creative")} onClick={() => setMode("creative")} />
      </div>
      <section aria-labelledby="gratitudes-title" className="space-y-3">
        <div className="flex items-center justify-between gap-3"><h1 className="text-xl font-bold" id="gratitudes-title">{t("gratitudes.title")}</h1><span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-primary">{t("gratitudes.progress", { count: filled.length })}</span></div>
        {gratitudes.map((value, index) => <div className="flex gap-2" key={index}><label className="sr-only" htmlFor={`gratitude-${index}`}>{t("gratitudes.field", { number: index + 1 })}</label><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent font-bold text-primary">{index + 1}</span><textarea className="min-h-11 flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring" data-tour={index === 0 ? "gratitude-input" : undefined} id={`gratitude-${index}`} maxLength={1000} onChange={(event) => updateGratitude(index, event.target.value)} placeholder={t("gratitudes.placeholder", { number: index + 1 })} ref={index === 0 ? firstInput : undefined} rows={1} value={value} />{index >= 3 ? <button aria-label={t("gratitudes.remove", { number: index + 1 })} className="min-h-11 min-w-11 rounded-xl text-destructive" onClick={() => removeGratitude(index)} type="button"><MaterialSymbol name="close" /></button> : null}</div>)}
        <button className="min-h-11 rounded-xl bg-muted px-4 text-sm font-semibold text-primary disabled:opacity-50" disabled={gratitudes.length >= MAX_GRATITUDES} onClick={addGratitude} type="button">{t("gratitudes.add")}</button>
      </section>
      <section className="space-y-3">
        <h2 className="text-base font-bold">{t("details.title")}</h2>
        <div className="flex flex-wrap gap-2">{moods.map((item) => <button aria-pressed={mood === item} className={`min-h-11 rounded-full px-4 text-sm font-semibold ${mood === item ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`} key={item} onClick={() => setMood(mood === item ? null : item)} type="button">{t(`moods.${item}`)}</button>)}</div>
        <label className="block text-sm font-semibold" htmlFor="space">{t("space.label")}</label>
        <input className="min-h-11 w-full rounded-xl border border-input bg-background px-3 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring" id="space" maxLength={160} onChange={(event) => setSpace(event.target.value)} placeholder={t("space.placeholder")} value={space} />
        {recentSpaces.length ? <div className="flex flex-wrap gap-2" aria-label={t("space.recentLabel")}>{recentSpaces.map((item) => <button className="min-h-11 rounded-full bg-muted px-3 text-sm" key={item.toLocaleLowerCase()} onClick={() => setSpace(item)} type="button">{item}</button>)}</div> : null}
      </section>
      <section className="border-t border-border pt-4">
        <button aria-controls="reflection" aria-expanded={reflectionOpen} className="min-h-11 text-left text-base font-bold text-primary" onClick={() => setReflectionOpen(!reflectionOpen)} type="button">{t("reflection.title")}</button>
        <div className={reflectionOpen ? "mt-3" : "mt-3 hidden md:block"} id="reflection"><textarea className="min-h-28 w-full rounded-xl border border-input bg-background p-3 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring" maxLength={5000} onChange={(event) => setReflection(event.target.value)} placeholder={t("reflection.placeholder")} value={reflection} /></div>
      </section>
      {mode === "creative" ? <section className="grid gap-3 border-t border-border pt-4 md:grid-cols-2"><label className="text-sm font-semibold">{t("creative.washi")}<select className="mt-2 min-h-11 w-full rounded-xl border border-input bg-background px-3" onChange={(event) => setWashi(event.target.value || null)} value={washi ?? ""}><option value="">{t("creative.none")}</option><option value="calm">{t("creative.calm")}</option><option value="warm">{t("creative.warm")}</option></select></label><label className="text-sm font-semibold">{t("creative.quote")}<input className="mt-2 min-h-11 w-full rounded-xl border border-input bg-background px-3" maxLength={240} onChange={(event) => setQuote(event.target.value)} value={quote} /></label><div><p className="mb-2 text-sm font-semibold">{t("creative.sticker")}</p><StickerPicker onSelect={setSticker} sticker={sticker} /></div><label className="text-sm font-semibold">{t("creative.image")}<input accept="image/*" className="mt-2 block min-h-11 w-full text-sm" onChange={(event) => setImage(event.target.files?.[0] ?? null)} type="file" /></label></section> : null}
      <Visibility value={visibility} onChange={setVisibility} t={t as unknown as (key: string) => string} />
    </section> : <section className="rounded-3xl bg-card p-4 shadow-sm sm:p-6"><h1 className="mb-4 text-xl font-bold">{t("handwriting.title")}</h1><HandwritingComposer document={inkDocument} onChange={setInkDocument} ref={handwritingRef} /><div className="mt-4"><Visibility value={visibility} onChange={setVisibility} t={t as unknown as (key: string) => string} /></div></section>}
  </main>;
}

function MethodButton({ active, icon, label, onClick }: Readonly<{ active: boolean; icon?: string; label: string; onClick: () => void }>) {
  return <button aria-pressed={active} className={`min-h-11 rounded-full px-4 text-sm font-semibold ${active ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`} onClick={onClick} type="button">{icon ? <MaterialSymbol className="mr-1" name={icon} /> : null}{label}</button>;
}

function SaveBar({ canSubmit, pending, saving, status, submit, t }: Readonly<{ canSubmit: boolean; pending: boolean; saving: boolean; status: string | null; submit: () => void; t: (key: string, values?: Record<string, string | number>) => string }>) {
  return <div className="flex flex-wrap items-center justify-end gap-2"><span aria-live="polite" className="text-xs font-semibold text-muted-foreground">{status ? t(status) : null}</span>{pending ? <span className="text-xs font-semibold text-amber-700">{t("handwriting.pending")}</span> : null}<button className="min-h-11 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50" data-tour="save" disabled={!canSubmit} onClick={submit} type="button">{saving ? t("save.saving") : pending ? t("save.retry") : t("save.action")}</button></div>;
}

function Visibility({ onChange, t, value }: Readonly<{ value: EntryVisibility; onChange: (value: EntryVisibility) => void; t: (key: string) => string }>) {
  return <fieldset data-tour="visibility"><legend className="mb-2 text-sm font-semibold">{t("visibility.label")}</legend><div className="flex flex-wrap gap-2">{(["private", "public", "anonymous"] as const).map((item) => <button aria-pressed={value === item} className={`min-h-11 rounded-full px-4 text-sm font-semibold ${value === item ? "bg-primary text-primary-foreground" : "bg-muted"}`} key={item} onClick={() => onChange(item)} type="button">{t(`visibility.${item}`)}</button>)}</div></fieldset>;
}
