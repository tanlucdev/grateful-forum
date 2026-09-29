"use client";

import { useEffect, useMemo, useState } from "react";
import { createEntry } from "@/lib/api/entries";
import { uploadEntryMedia } from "@/lib/api/entry-media";
import { DEFAULT_STICKER_ID, getStickerLabel } from "@/lib/entries/stickers";
import type { EntryVisibility } from "@/lib/entries/types";
import { addLocalEntry, markLocalEntrySynced } from "@/lib/entries/local-store";
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

export function EntryComposerClient() {
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
    setStatus("Khôi phục bản nháp hôm qua.");
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
      setStatus(imageUploadFailed ? "Đã lưu, nhưng ảnh chưa tải được." : result.saved ? "Đã lưu!" : "Đã lưu trên thiết bị này.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Đã lưu trên thiết bị này.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh text-foreground [font-family:var(--font-quicksand)]">
      <section className="mx-auto min-h-dvh max-w-[1200px] px-5 pb-8 pt-6 md:px-6 md:pb-16 md:pt-24">
        <div className="flex flex-col gap-6">
          <WriteIntro
            canSubmit={canSubmit}
            saving={saving}
            setPreviewOpen={setPreviewOpen}
            setStatus={setStatus}
            status={status}
            submit={submit}
            today={today}
          />
          <ModeSwitcher mode={mode} setMode={setMode} />
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
        </div>
      </section>
      {previewOpen ? (
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
