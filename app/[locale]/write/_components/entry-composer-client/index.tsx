"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createEntry } from "@/lib/api/entries";
import { createHandwrittenEntry } from "@/lib/api/handwritten-entries";
import { handwritingSaveErrorKey } from "@/lib/api/handwritten-entry-errors";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { uploadEntryMedia } from "@/lib/api/entry-media";
import { DEFAULT_STICKER_ID, getStickerLabel } from "@/lib/entries/stickers";
import type { EntryVisibility, InkDocument } from "@/lib/entries/types";
import { addLocalEntry, addLocalHandwrittenEntry, markLocalEntrySynced } from "@/lib/entries/local-store";
import {
  defaultGratitudes,
  defaultReflection,
  writeMoods,
  writeQuotes,
  writeWashiOptions,
  type WriteMood,
  type WriteQuote,
  type WriteSticker,
  type WriteWashi,
} from "../composer-data";
import {
  ModeSwitcher,
  NotebookControls,
  PrivacySettings,
  WriteIntro,
  WritingPanel,
} from "../composer-ui";
import { PreviewModal, SideRail } from "../composer-right-rail";
import { HandwritingComposer, type HandwritingComposerHandle } from "../handwriting-composer";
import { getEntrySaveFeedback, type EntrySaveOutcome } from "../entry-save-feedback";

export function EntryComposerClient() {
  const t = useTranslations("write");
  const [inputMethod, setInputMethod] = useState<"text" | "handwritten">("text");
  const [mode, setMode] = useState<"minimal" | "creative">("creative");
  const [visibility, setVisibility] = useState<EntryVisibility>("private");
  const [washi, setWashi] = useState<WriteWashi>(writeWashiOptions[0].label);
  const [mood, setMood] = useState<WriteMood>(writeMoods[0].label);
  const [space, setSpace] = useState("Ban công góc nhỏ");
  const [gratitudes, setGratitudes] = useState([...defaultGratitudes]);
  const [gratitudesOpen, setGratitudesOpen] = useState(false);
  const [reflection, setReflection] = useState(defaultReflection);
  const [quote, setQuote] = useState<WriteQuote>(writeQuotes[0]);
  const [sticker, setSticker] = useState<WriteSticker>(DEFAULT_STICKER_ID);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageStatus, setImageStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [inkDocument, setInkDocument] = useState<InkDocument>({ version: 1, orientation: "portrait", paperStyle: "ruled", stamp: "none", strokes: [] });
  const handwritingRef = useRef<HandwritingComposerHandle>(null);
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date()),
    [],
  );
  const filledGratitudes = useMemo(
    () => gratitudes.map((item) => item.trim()).filter(Boolean),
    [gratitudes],
  );
  const entryText = useMemo(
    () =>
      [
        `Washi: ${washi}`,
        `Tâm trạng: ${mood}`,
        `Không gian: ${space}`,
        `Sticker: ${getStickerLabel(sticker, "vi")}`,
        `Câu trích dẫn: ${quote}`,
        previewUrl ? "Ảnh: đã chọn" : "",
        ...filledGratitudes.map((item, index) => `${index + 1}. ${item}`),
        reflection.trim(),
        visibility === "private" ? "Riêng tư" : "Cộng đồng",
      ]
        .filter(Boolean)
        .join("\n"),
    [filledGratitudes, mood, previewUrl, quote, reflection, space, sticker, visibility, washi],
  );
  const canSubmit =
    reflection.trim().length > 0 &&
    space.trim().length > 0 &&
    quote.trim().length > 0 &&
    sticker.trim().length > 0 &&
    !saving;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function resetDraft() {
    setVisibility("private");
    setWashi(writeWashiOptions[0].label);
    setMood(writeMoods[0].label);
    setSpace("Ban công góc nhỏ");
    setGratitudes([...defaultGratitudes]);
    setGratitudesOpen(false);
    setReflection(defaultReflection);
    setQuote(writeQuotes[0]);
    setSticker(DEFAULT_STICKER_ID);
    setSelectedImageFile(null);
    setPreviewUrl(null);
    setImageStatus("");
  }

  function showSaveToast(outcome: EntrySaveOutcome) {
    const feedback = getEntrySaveFeedback(outcome);
    if (feedback.tone === "warning") toast.warning(t(feedback.messageKey));
    else toast.success(t(feedback.messageKey));
  }

  function selectImage(file: File) {
    setSelectedImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageStatus("Đã chọn ảnh. Ảnh sẽ tải lên khi lưu.");
  }

  function clearImage() {
    setSelectedImageFile(null);
    setPreviewUrl(null);
    setImageStatus("");
  }

  async function submit() {
    if (!canSubmit) return;

    setSaving(true);
    setStatus("");

    try {
      let imageUrl: string | null = null;
      let imageUploadFailed = false;
      if (selectedImageFile) {
        setImageStatus("Đang lưu ảnh...");
        try {
          const media = await uploadEntryMedia(selectedImageFile);
          imageUrl = media.uploaded ? media.url : null;
        } catch (error) {
          imageUploadFailed = true;
          setImageStatus(error instanceof Error ? error.message : "Không tải được ảnh.");
        }
      }

      const savedEntryText = imageUrl
        ? entryText.replace("Ảnh: đã chọn", `Ảnh: ${imageUrl}`).trim()
        : entryText.replace("\nẢnh: đã chọn\n", "\n").trim();
      const local = addLocalEntry(
        savedEntryText,
        visibility,
      );
      const result = await createEntry({
        visibility,
        gratitudes: filledGratitudes,
        reflection: reflection.trim(),
        mood,
        washi,
        space: space.trim(),
        quote,
        sticker,
        imageUrl,
      });
      if (result.saved) markLocalEntrySynced(local.id);
      resetDraft();
      showSaveToast(imageUploadFailed ? "text-saved-without-image" : result.saved ? "text-synced" : "text-local");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : t("errors.saveFailed"),
      );
    } finally {
      setSaving(false);
    }
  }

  async function submitHandwriting() {
    if (!inkDocument.strokes.length || saving) return;
    setSaving(true);
    setStatus("");
    try {
      const preview = visibility === "private" ? null : await handwritingRef.current?.exportPreview();
      if (visibility !== "private" && !preview) throw new Error(t("handwriting.previewUnavailable"));
      const result = await createHandwrittenEntry({ document: inkDocument, visibility }, preview ?? null);
      if (!result.saved) addLocalHandwrittenEntry(inkDocument, visibility);
      setInkDocument((current) => ({ ...current, strokes: [] }));
      showSaveToast(result.saved ? "handwriting-synced" : "handwriting-local");
    } catch (error) {
      const errorKey = handwritingSaveErrorKey(error);
      if (errorKey) {
        setStatus(t(errorKey));
      } else {
        setStatus(error instanceof Error && error.message === "preview-unavailable" ? t("handwriting.previewUnavailable") : t("handwriting.saveFailed"));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh text-foreground [font-family:var(--font-quicksand)]">
      <section className="mx-auto min-h-dvh max-w-[1200px] px-5 pb-8 pt-6 md:px-6 md:pb-16 md:pt-24">
        <div className="flex flex-col gap-6">
          <WriteIntro
            canSubmit={inputMethod === "handwritten" ? inkDocument.strokes.length > 0 && !saving : canSubmit}
            saving={saving}
            setPreviewOpen={setPreviewOpen}
            status={status}
            submit={inputMethod === "handwritten" ? submitHandwriting : submit}
            today={today}
            showPreview={inputMethod === "text"}
          />
          <div className="flex w-fit rounded-full bg-muted p-1" role="tablist" aria-label={t("handwriting.methodLabel")}>
            <button aria-selected={inputMethod === "text"} className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold ${inputMethod === "text" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`} onClick={() => setInputMethod("text")} role="tab" type="button"><MaterialSymbol name="edit_note" />{t("handwriting.type")}</button>
            <button aria-selected={inputMethod === "handwritten"} className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold ${inputMethod === "handwritten" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`} onClick={() => setInputMethod("handwritten")} role="tab" type="button"><MaterialSymbol name="edit" />{t("handwriting.handwrite")}</button>
          </div>
          {inputMethod === "handwritten" ? (
            <section aria-label={t("handwriting.canvasLabel")} className="relative overflow-hidden rounded-3xl bg-card p-4 shadow-sm md:p-7 lg:p-8">
              <div className="mx-auto flex max-w-4xl flex-col gap-5">
                <HandwritingComposer document={inkDocument} onChange={setInkDocument} ref={handwritingRef} />
                <PrivacySettings setVisibility={setVisibility} visibility={visibility} />
              </div>
            </section>
          ) : (
          <ModeSwitcher mode={mode} setMode={setMode} />
          )}
          {inputMethod === "text" ? (
          <section aria-label="Nội dung nhật ký" className="relative overflow-hidden rounded-3xl bg-card p-4 shadow-sm md:p-7 lg:p-8" id="journal-editor-canvas">
            <div className={`relative z-10 grid gap-6 ${mode === "creative" ? "lg:grid-cols-12 lg:gap-8" : "grid-cols-1"}`}>
              <div className={`${mode === "creative" ? "lg:col-span-8" : "mx-auto w-full max-w-3xl"} flex flex-col gap-4`}>
                <NotebookControls
                  mode={mode}
                  mood={mood}
                  setMood={setMood}
                  setSpace={setSpace}
                  setWashi={setWashi}
                  space={space}
                  washi={washi}
                />
                <WritingPanel
                  gratitudes={gratitudes}
                  gratitudesOpen={gratitudesOpen}
                  mode={mode}
                  noteLength={reflection.length}
                  quote={quote}
                  reflection={reflection}
                  setGratitudes={setGratitudes}
                  setGratitudesOpen={setGratitudesOpen}
                  setQuote={setQuote}
                  setReflection={setReflection}
                  setSticker={setSticker}
                  sticker={sticker}
                />
                {mode === "minimal" ? (
                  <PrivacySettings setVisibility={setVisibility} visibility={visibility} />
                ) : null}
              </div>
              {mode === "creative" ? (
                <SideRail
                  clearImage={clearImage}
                  previewUrl={previewUrl}
                  setVisibility={setVisibility}
                  imageStatus={imageStatus}
                  selectImage={selectImage}
                  visibility={visibility}
                />
              ) : null}
            </div>
          </section>
          ) : null}
        </div>
      </section>
      {previewOpen && inputMethod === "text" ? (
        <PreviewModal
          close={() => setPreviewOpen(false)}
          gratitudes={filledGratitudes}
          imageUrl={previewUrl}
          mood={mood}
          quote={quote}
          reflection={reflection}
          sticker={sticker}
          submit={submit}
          today={today}
        />
      ) : null}
    </div>
  );
}
