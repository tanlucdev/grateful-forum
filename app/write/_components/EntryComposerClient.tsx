"use client";

import { useMemo, useState } from "react";
import { createEntry } from "@/lib/api/entries";
import { uploadEntryMedia } from "@/lib/api/entry-media";
import type { EntryVisibility } from "@/lib/entries/types";
import { addLocalEntry, markLocalEntrySynced } from "@/lib/entries/local-store";
import {
  defaultGratitudes,
  defaultReflection,
  writeMoods,
  writeQuotes,
  writeStickers,
  writeWashiOptions,
  type WriteMood,
  type WriteQuote,
  type WriteSticker,
  type WriteWashi,
} from "./composer-data";
import {
  NotebookControls,
  WriteIntro,
  WritingPanel,
} from "./composer-ui";
import { MobileNav, PreviewModal, SideRail } from "./composer-right-rail";

export function EntryComposerClient() {
  const [visibility, setVisibility] = useState<EntryVisibility>("private");
  const [washi, setWashi] = useState<WriteWashi>(writeWashiOptions[0].label);
  const [mood, setMood] = useState<WriteMood>(writeMoods[0].label);
  const [space, setSpace] = useState("Ban công góc nhỏ");
  const [gratitudes, setGratitudes] = useState([...defaultGratitudes]);
  const [reflection, setReflection] = useState(defaultReflection);
  const [quote, setQuote] = useState<WriteQuote>(writeQuotes[0]);
  const [sticker, setSticker] = useState<WriteSticker>(writeStickers[0].label);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
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
  const entryText = useMemo(
    () =>
      [
        `Washi: ${washi}`,
        `Tâm trạng: ${mood}`,
        `Không gian: ${space}`,
        `Sticker: ${sticker}`,
        `Câu trích dẫn: ${quote}`,
        imageUrl ? `Ảnh: ${imageUrl}` : "",
        ...gratitudes
          .filter((item) => item.trim())
          .map((item, index) => `${index + 1}. ${item.trim()}`),
        reflection.trim(),
        visibility === "private" ? "Riêng tư" : "Cộng đồng",
      ]
        .filter(Boolean)
        .join("\n"),
    [gratitudes, imageUrl, mood, quote, reflection, space, sticker, visibility, washi],
  );
  const canSubmit =
    gratitudes.every((item) => item.trim()) &&
    reflection.trim().length > 0 &&
    space.trim().length > 0 &&
    quote.trim().length > 0 &&
    sticker.trim().length > 0 &&
    !saving &&
    !uploading;

  function resetDraft() {
    setVisibility("private");
    setWashi(writeWashiOptions[0].label);
    setMood(writeMoods[0].label);
    setSpace("Ban công góc nhỏ");
    setGratitudes([...defaultGratitudes]);
    setReflection(defaultReflection);
    setQuote(writeQuotes[0]);
    setSticker(writeStickers[0].label);
    setImageUrl(null);
    setUploadStatus("");
    setStatus("Khôi phục bản nháp hôm qua.");
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setUploadStatus("");

    try {
      const result = await uploadEntryMedia(file);
      if (result.uploaded) {
        setImageUrl(result.url);
        setUploadStatus("Đã tải ảnh.");
      } else {
        setUploadStatus("Chưa cấu hình Supabase; ảnh chỉ giữ trên bản nháp.");
      }
    } catch (error) {
      setUploadStatus(error instanceof Error ? error.message : "Không tải được ảnh.");
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    if (!canSubmit) return;

    setSaving(true);
    setStatus("");
    const local = addLocalEntry(entryText.trim(), visibility);

    try {
      const result = await createEntry({
        visibility,
        gratitudes: gratitudes.map((item) => item.trim()),
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
      setStatus(result.saved ? "Đã lưu!" : "Đã lưu trên thiết bị này.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Đã lưu trên thiết bị này.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#f4fbf8] text-[#161d1b] [font-family:var(--font-quicksand)]">
      <section className="mx-auto min-h-dvh max-w-[1200px] px-5 pb-32 pt-20 md:px-6 md:pt-24">
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
          <section className="grid gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <NotebookControls
                mood={mood}
                setMood={setMood}
                setSpace={setSpace}
                setWashi={setWashi}
                space={space}
                washi={washi}
              />
              <WritingPanel
                gratitudes={gratitudes}
                noteLength={reflection.length}
                reflection={reflection}
                setGratitudes={setGratitudes}
                setReflection={setReflection}
              />
            </div>
            <SideRail
              imageUrl={imageUrl}
              quote={quote}
              resetDraft={resetDraft}
              setReflection={setReflection}
              setQuote={setQuote}
              setSticker={setSticker}
              setVisibility={setVisibility}
              sticker={sticker}
              uploadImage={uploadImage}
              uploading={uploading}
              uploadStatus={uploadStatus}
              visibility={visibility}
            />
          </section>
        </div>
      </section>
      <MobileNav />
      {previewOpen ? (
        <PreviewModal
          close={() => setPreviewOpen(false)}
          gratitudes={gratitudes}
          imageUrl={imageUrl}
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
