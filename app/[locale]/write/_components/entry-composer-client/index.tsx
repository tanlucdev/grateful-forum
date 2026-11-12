"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import "./composer.css";
import { MethodButton, Visibility } from "../composer-primitives";
import { Button } from "@/components/ui/button";
import { useLeavePage } from "../leave-page-dialog";
import { useLocale, useTranslations } from "next-intl";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ApiClientError } from "@/lib/api/fetch-json";
import { localizedLoginHref } from "@/lib/auth/redirects";
import { createEntry, getRecentSpaces, getEntryQuota } from "@/lib/api/entries";
import type { EntryDailyQuota } from "@/lib/entries/daily-quota";
import { createHandwrittenEntry } from "@/lib/api/handwritten-entries";
import { handwritingSaveErrorKey } from "@/lib/api/handwritten-entry-errors";
import { uploadEntryMedia } from "@/lib/api/entry-media";
import type { StickerId } from "@/lib/entries/stickers";
import { validComposerEntry, canSubmitEntry } from "@/lib/entries/composer";
import { validateEntryMediaFile } from "@/lib/entry-media/validation";
import { JournalBookContent } from "@/components/entries/journal-book";
import { HandwritingViewer } from "@/components/entries/handwriting-viewer";
import { useRouter } from "@/i18n/navigation";
import { useWriteBottomBar } from "@/components/app-shell/write-bottom-bar-context";
import { OnboardingTourReplayButton } from "@/components/onboarding-tour-replay-button";
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
  const router = useRouter();
  const setWriteBar = useWriteBottomBar();
  const mainRef = useRef<HTMLElement>(null);
  const finishRef = useRef<HTMLElement>(null);
  const submitting = useRef(false);
  const handwritingRef = useRef<HandwritingComposerHandle>(null);
  const [method, setMethod] = useState<"text" | "handwritten">("text");
  const [visibility, setVisibility] = useState<EntryVisibility>("private");
  const [gratitudes, setGratitudes] = useState(() => Array.from({ length: 3 }, (_, id) => ({ id, text: "" })));
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
  const [quota, setQuota] = useState<EntryDailyQuota | null>(null);
  const [quotaError, setQuotaError] = useState(false);
  async function refreshQuota() {
    try { setQuota(await getEntryQuota()); setQuotaError(false); setStatus((current) => current === "errors.authRequired" ? null : current); }
    catch (error) {
      setQuotaError(true);
      if (error instanceof ApiClientError && error.code === "auth_required") setStatus("errors.authRequired");
    }
  }
  const [inkDocument, setInkDocument] = useState<InkDocument>({ version: 1, orientation: "portrait", paperStyle: "ruled", stamp: "none", strokes: [] });
  const [pendingId, setPendingId] = useState<string | null>(null);
  const filled = useMemo(() => gratitudes.map((item) => item.text.trim()).filter(Boolean), [gratitudes]);
  const payload = { visibility, gratitudes: filled, reflection, mood, space, washi, quote, sticker };
  const validText = validComposerEntry(payload);
  const quotaAvailable = quota !== null && !quotaError && quota.remaining > 0;
  const canSaveText = quotaAvailable && canSubmitEntry(validText, saving, saved !== null);
  const canSaveInk = quotaAvailable && canSubmitEntry(inkDocument.strokes.length > 0, saving, saved !== null);
  const date = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(new Date()), [locale]);

  useEffect(() => { getRecentSpaces().then(({ spaces }) => setRecentSpaces(spaces)).catch(() => setRecentSpaces([])); }, []);
  useEffect(() => {
    getEntryQuota().then(setQuota).catch((error: unknown) => {
      setQuotaError(true);
      if (error instanceof ApiClientError && error.code === "auth_required") setStatus("errors.authRequired");
    });
    const onVisible = () => { if (document.visibilityState === "visible") void refreshQuota(); };
    window.addEventListener("focus", refreshQuota);
    document.addEventListener("visibilitychange", onVisible);
    return () => { window.removeEventListener("focus", refreshQuota); document.removeEventListener("visibilitychange", onVisible); };
  }, []);
  useEffect(() => {
    if (!quota) return;
    const timer = window.setTimeout(() => { void refreshQuota(); }, Math.max(1000, Date.parse(quota.resetsAt) - Date.now() + 1000));
    return () => window.clearTimeout(timer);
  }, [quota]);

  function consumeQuota() {
    setQuota((current) => current ? { ...current, remaining: Math.max(0, current.remaining - 1) } : current);
    void refreshQuota();
  }

  function handleQuotaError(error: unknown) {
    if (!(error instanceof ApiClientError) || error.code !== "daily_entry_limit") return false;
    setQuota((current) => current ? { ...current, remaining: 0 } : current);
    setStatus("errors.dailyLimit");
    void refreshQuota();
    return true;
  }

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
      const currentQuota = await getEntryQuota();
      setQuota(currentQuota);
      setQuotaError(false);
      if (currentQuota.remaining === 0) throw new ApiClientError("daily_entry_limit", "Daily entry limit reached.");
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
      consumeQuota();
    } catch (error) {
      if (handleQuotaError(error)) return;
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
      consumeQuota();
    } catch (error) {
      if (handleQuotaError(error)) {
        const pending = upsertLocalHandwrittenEntry(pendingId, inkDocument, visibility);
        setPendingId(pending.id);
        return;
      }
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

  const textMode = method === "text";
  const composing = !saved;
  const dirty = !saved && (gratitudes.some((item) => item.text.length > 0) || !!reflection || !!mood || !!space || !!washi || !!quote || !!sticker || !!photo || inkDocument.strokes.length > 0);
  useEffect(() => {
    setWriteBar(composing);
    return () => setWriteBar(false);
  }, [composing, setWriteBar]);
  const { requestLeave, dialog } = useLeavePage(dirty, saving);
  useEffect(() => {
    if (!composing || !finishRef.current) return;
    const observer = new ResizeObserver(([entry]) => mainRef.current?.style.setProperty("--write-bar-height", `${entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height}px`));
    observer.observe(finishRef.current);
    return () => observer.disconnect();
  }, [composing]);
  useEffect(() => {
    const viewport = window.visualViewport;
    const main = mainRef.current;
    if (!composing || !viewport || !main) return;
    const update = () => main.style.setProperty("--write-keyboard-offset", `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`);
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      main.style.removeProperty("--write-keyboard-offset");
    };
  }, [composing]);
  function goBack() {
    requestLeave(() => { if (window.history.length > 1) router.back(); else router.replace("/feed"); });
  }
  const submit = method === "text" ? saveText : saveHandwriting;
  const canSubmit = method === "text" ? canSaveText : canSaveInk;

  function newPage() {
    setSaved(null); setStatus(null); setVisibility("private"); setMethod("text");
    setGratitudes(Array.from({ length: 3 }, (_, id) => ({ id, text: "" }))); setReflection(""); setMood(null); setSpace("");
    setWashi(null); setQuote(""); setSticker(null); setImage(null); setPendingId(null);
    setInkDocument((current) => ({ ...current, strokes: [] }));
  }
  const savedDate = saved ? new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" }).format(new Date(saved.createdAt)) : null;
  const quotaResetTime = quota ? new Intl.DateTimeFormat(locale, { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit" }).format(new Date(quota.resetsAt)) : null;
  const quotaMessage = quotaError ? t("quota.unavailable") : !quota ? t("quota.loading") : quota.remaining === 0 ? t("quota.exhausted") : t("quota.remaining", { count: quota.remaining, limit: quota.limit });
  const quotaHint = quotaError ? t("quota.unavailableHint") : !quota ? t("quota.loadingHint") : t(quota.remaining === 0 ? "quota.exhaustedHint" : "quota.resetHint", { time: quotaResetTime! });
  const saveHint = !quotaAvailable ? quotaMessage : method === "text" && filled.length === 0 ? <><span className="lg:hidden">{t("book.gratitudeRequiredShort")}</span><span className="hidden lg:inline">{t("book.gratitudeRequired")}</span></> : method === "handwritten" && inkDocument.strokes.length === 0 ? t("book.handwritingRequired") : t("book.unsaved");
  const metadata = { entryKind: "text" as const, gratitudes: filled, reflection, mood, space, washi, quote, sticker, imageUrl: photo?.url ?? null, handwritingPreviewUrl: null };
  return <main data-write-method={method} ref={mainRef} className={`journal-controls write-composer mx-auto min-h-dvh max-w-4xl px-3 pb-8 pt-3 sm:px-6 sm:pt-5 ${composing ? "write-composer-editing" : ""}`}>
    <header className="write-header mb-2 flex min-w-0 items-center justify-between gap-1">
      <Button aria-label={t("navigation.back")} disabled={saving} variant="ghost" size="icon" onClick={goBack} type="button"><MaterialSymbol name="arrow_back" /></Button>
      <div className="write-method-switch flex min-w-0" role="group" aria-label={t("method.label")}>
        <MethodButton disabled={saving || saved !== null} active={textMode} icon="edit_note" label={t("method.text")} onClick={() => setMethod("text")} />
        <MethodButton disabled={saving || saved !== null} active={!textMode} icon="edit" label={t("method.handwritten")} onClick={() => setMethod("handwritten")} />
      </div>
      <OnboardingTourReplayButton disabled={saving || saved !== null} inline tour="first-entry" writeMethod={method} />
    </header>

    <div className={`write-quota ${quota && quota.remaining > 0 && !quotaError ? "write-quota-normal" : ""} mb-3 flex min-w-0 flex-wrap items-center gap-2 rounded-xl px-3 py-2 ${quotaError ? "bg-[var(--fire-soft)]/40" : quota && quota.remaining > 0 ? "bg-accent/50" : "bg-muted"}`}>
      <div className="flex min-w-0 flex-1 basis-52 items-center gap-2" role="status" aria-atomic="true">
        <span aria-hidden="true" className={`flex size-6 shrink-0 items-center justify-center rounded-xl bg-card/80 ${quotaError ? "text-[var(--fire)]" : "text-primary"}`}><MaterialSymbol className="text-xl" name={quotaError ? "info" : !quota || quota.remaining === 0 ? "schedule" : "nest_eco_leaf"} /></span>
        <div className="min-w-0 [overflow-wrap:anywhere]">
          <p className="text-sm font-bold leading-6 text-foreground tabular-nums">{quotaMessage}</p>
          {quotaError || !quota || quota.remaining === 0 ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{quotaHint}</p> : null}
        </div>
      </div>
      {quotaError ? <button className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-card px-4 text-sm font-semibold text-primary" onClick={() => void refreshQuota()} type="button"><MaterialSymbol name="history" />{t("quota.retry")}</button> : null}
    </div>
    <fieldset className="min-w-0" disabled={saving || saved !== null}>
      <div hidden={!textMode}>
        {saved ? <JournalBookContent date={savedDate ?? date} metadata={metadata} /> : <JournalEditor decoration={<JournalDecoration image={image} imageError={imageError} quote={quote} setImage={setImage} setQuote={setQuote} setSticker={setSticker} setWashi={setWashi} sticker={sticker} washi={washi} />} date={date} gratitudes={gratitudes} imageUrl={photo?.url ?? null} mood={mood} quote={quote} recentSpaces={recentSpaces} reflection={reflection} setGratitudes={setGratitudes} setMood={setMood} setReflection={setReflection} setSpace={setSpace} space={space} sticker={sticker} washi={washi} />}
      </div>
      <div hidden={textMode}>{saved ? <HandwritingViewer document={inkDocument} label={t("handwriting.canvasLabel")} /> : <section className="rounded-2xl bg-card p-2 sm:p-4"><h1 className="mb-2 text-sm font-bold">{t("handwriting.title")}</h1><div inert={saving}><HandwritingComposer document={inkDocument} onChange={setInkDocument} ref={handwritingRef} /></div></section>}</div>
    </fieldset>
    <section data-tour="write-finish" ref={finishRef} className="write-finish mt-5 grid grid-cols-1 items-center gap-3 rounded-2xl bg-card p-3 shadow-card sm:p-4 lg:sticky lg:bottom-4 lg:z-30 lg:grid-cols-[auto_1fr]" aria-label={t("book.finish")}>
      <fieldset className="min-w-0" disabled={saving || saved !== null}><Visibility disabled={saving || saved !== null} value={visibility} onChange={setVisibility} t={t as unknown as (key: string) => string} /></fieldset>
      <div className="write-finish-actions grid min-w-0 grid-cols-1 gap-3 lg:flex lg:flex-wrap lg:items-center lg:justify-end">
        <p aria-live="polite" className={`${!saved && !saving && !status ? "write-save-hint " : ""}write-save-status min-w-0 text-sm text-muted-foreground [overflow-wrap:anywhere]`} id="entry-save-status">{saved ? t("book.savedAt", { time: savedDate! }) : saving ? t("save.saving") : status ? t(status) : saveHint}</p>
        {!saved ? <Button aria-describedby="entry-save-status" className="write-save-button min-h-11 shrink-0 rounded-xl border border-transparent bg-primary px-4 text-sm font-bold text-white disabled:opacity-50" data-tour="save" disabled={!canSubmit} onClick={submit} type="button">{saving ? t("save.saving") : status ? t("save.retry") : t("save.action")}</Button> : <><Link className="inline-flex min-h-11 items-center rounded-xl px-3 font-semibold text-primary" href={`/profile?entry=${saved.id}`}>{t("book.viewProfile")}</Link><Button onClick={newPage} type="button">{t("book.newPage")}</Button></>}
      </div>
      {method === "text" && filled.length > 0 && !validText && !saved ? <p className="write-finish-error text-sm text-destructive lg:col-span-2" role="alert">{t("book.invalidContent")}</p> : null}
      {status === "errors.authRequired" ? <div className="write-finish-error min-w-0 lg:col-span-2" role="alert"><a className="inline-flex min-h-11 items-center rounded-xl px-3 font-semibold text-primary underline" href={localizedLoginHref("/write", locale)} target="_blank" rel="noopener noreferrer">{t("save.signInNewTab")}</a></div> : null}
    </section>
    {dialog}
  </main>;
}
