"use client";

import { useMemo, useState } from "react";
import { createEntry } from "@/lib/api/entries";
import type { EntryVisibility } from "@/lib/entries/types";
import { addLocalEntry, markLocalEntrySynced } from "@/lib/entries/local-store";
import {
  defaultGratitudes,
  defaultReflection,
  writeMoods,
  writeWashiOptions,
  type WriteMood,
  type WriteWashi,
} from "./composer-data";
import {
  NotebookControls,
  WriteHeader,
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
        ...gratitudes
          .filter((item) => item.trim())
          .map((item, index) => `${index + 1}. ${item.trim()}`),
        reflection.trim(),
        visibility === "private" ? "Riêng tư" : "Cộng đồng",
      ]
        .filter(Boolean)
        .join("\n"),
    [gratitudes, mood, reflection, space, visibility, washi],
  );
  const canSubmit = entryText.trim().length > 0 && !saving;

  function resetDraft() {
    setVisibility("private");
    setWashi(writeWashiOptions[0].label);
    setMood(writeMoods[0].label);
    setSpace("Ban công góc nhỏ");
    setGratitudes([...defaultGratitudes]);
    setReflection(defaultReflection);
    setStatus("Khôi phục bản nháp hôm qua.");
  }

  async function submit() {
    if (!canSubmit) return;

    setSaving(true);
    setStatus("");
    const local = addLocalEntry(entryText.trim(), visibility);

    try {
      const result = await createEntry(entryText.trim(), visibility);
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
      <WriteHeader />
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
              resetDraft={resetDraft}
              setReflection={setReflection}
              setVisibility={setVisibility}
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
          mood={mood}
          reflection={reflection}
          submit={submit}
          today={today}
        />
      ) : null}
    </div>
  );
}
