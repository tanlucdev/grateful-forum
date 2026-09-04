"use client";

import { useMemo, useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { createEntry } from "@/lib/api";
import { ENTRY_LIMIT, type EntryVisibility } from "@/lib/entries/types";
import { addLocalEntry, markLocalEntrySynced } from "@/lib/entries/local-store";
import {
  DesktopComposerFooter,
  DesktopComposerHeader,
  MascotHint,
  MobileComposerHeader,
  MoodPicker,
  PromptChips,
} from "./composer-chrome";

export function EntryComposerClient() {
  const [content, setContent] = useState("");
  const [visibility] = useState<EntryVisibility>("private");
  const [mood, setMood] = useState("✨ Biết ơn");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date()),
    [],
  );
  const remaining = ENTRY_LIMIT - content.length;
  const canSubmit = content.trim().length > 0 && remaining >= 0 && !saving;
  const mobileDate = `Hôm nay, ${today}`;
  const desktopDate = `Hôm nay, ${today.replace(",", " ngày")}`;

  function appendPrompt(text: string) {
    setContent((current) => `${current.trim() ? `${current}\n` : ""}${text}`);
    setStatus("");
  }

  async function submit() {
    if (!canSubmit) {
      return;
    }

    setSaving(true);
    setStatus("");
    const trimmed = content.trim();
    const local = addLocalEntry(trimmed, visibility);

    try {
      const result = await createEntry(trimmed, visibility);
      if (result.saved) {
        markLocalEntrySynced(local.id);
      }

      setContent("");
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
    <main className="min-h-svh bg-[#f4fbf8] text-[#161d1b] [font-family:var(--font-quicksand)] md:flex md:min-h-screen md:flex-col">
      <MobileComposerHeader />
      <DesktopComposerHeader />

      <section className="relative flex min-h-svh flex-col overflow-hidden px-10 pb-[env(safe-area-inset-bottom)] pt-16 md:mx-auto md:min-h-0 md:w-full md:max-w-[1200px] md:flex-1 md:px-6">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden md:hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#d1e9e0]/40 blur-[80px]" />
          <div className="absolute -left-10 top-1/2 h-48 w-48 rounded-full bg-[#006d43]/5 blur-[60px]" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col py-4 md:mx-auto md:w-full md:max-w-[960px] md:py-12">
          <div className="mb-8 md:flex md:flex-col md:items-center md:text-center">
            <div className="hidden items-center gap-2 rounded-full bg-[#eef5f2] px-3 py-1.5 text-[#006d43] shadow-sm md:inline-flex">
              <MaterialSymbol className="text-sm" name="calendar_today" />
              <span className="text-[12px] font-medium leading-4">
                {desktopDate}
              </span>
            </div>
            <p className="mb-1 text-[14px] font-semibold leading-5 text-[#3d4a41] md:hidden">
              {mobileDate}
            </p>
            <h2 className="max-w-xl text-[28px] font-bold leading-9 text-[#1a2f2b] md:mt-3 md:text-[32px] md:leading-10 md:text-[#161d1b]">
              <span className="md:hidden">Bạn đang biết ơn điều gì?</span>
              <span className="hidden md:inline">
                Bạn đang cảm thấy biết ơn điều gì hôm nay?
              </span>
            </h2>
            <p className="mt-2 hidden max-w-md text-[16px] leading-6 text-[#3d4a41] md:block">
              Dành cho chính mình một phút lắng đọng, nhận diện những điều an lành chung quanh.
            </p>
          </div>

          <div className="relative flex flex-1 flex-col md:rounded-2xl md:bg-white md:p-8 md:shadow-xl md:shadow-[#006d43]/5">
            <MoodPicker mood={mood} setMood={setMood} />
            <label className="sr-only" htmlFor="journal-input">
              Nội dung nhật ký
            </label>
            <div className="group relative flex flex-1 flex-col md:mt-2 md:block">
              <div className="absolute inset-0 rounded-2xl bg-white/60 shadow-[0_4px_24px_rgba(26,47,43,0.04)] backdrop-blur-md transition-all group-focus-within:shadow-[0_8px_32px_rgba(0,109,67,0.08)] md:hidden" />
              <textarea
                className="relative z-10 h-full min-h-[300px] w-full flex-1 resize-none rounded-2xl bg-transparent p-6 text-[18px] leading-7 text-[#1a2f2b] outline-none placeholder:text-[#bccabe] md:min-h-0 md:rounded-xl md:bg-white md:p-4 md:placeholder:text-[#3d4a41]/50 md:focus:shadow-inner"
                id="journal-input"
                maxLength={ENTRY_LIMIT}
                onChange={(event) => {
                  setContent(event.target.value);
                  setStatus("");
                }}
                placeholder="Bắt đầu viết về những điều nhỏ bé khiến bạn mỉm cười hôm nay... Cứ viết tự nhiên, đây là góc nhỏ tĩnh lặng của riêng bạn."
                rows={9}
                value={content}
              />
              <div className="absolute bottom-4 right-6 z-10 flex items-center gap-2 md:hidden">
                <MaterialSymbol className="text-[18px] text-[#bccabe]" name="edit_note" />
                <span className={`text-[12px] font-medium leading-4 ${remaining < 20 ? "text-[#ba1a1a]" : "text-[#bccabe]"}`}>
                  {content.length} / {ENTRY_LIMIT}
                </span>
              </div>
            </div>

            <div className="mt-2 hidden flex-col items-center justify-between gap-4 pt-6 md:flex md:flex-row">
              <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-start">
                <span className={`text-[12px] font-medium leading-4 ${remaining < 20 ? "text-[#ba1a1a]" : "text-[#3d4a41]"}`}>
                  {content.length} / {ENTRY_LIMIT} ký tự
                </span>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5f2] px-3 py-1 text-[#3d4a41]">
                  <MaterialSymbol className="text-base text-[#006d43]" name="verified_user" />
                  <span className="text-[11px] font-medium leading-[14px]">
                    Nhật ký riêng tư & được bảo mật an toàn
                  </span>
                </div>
              </div>
              <div className="flex w-full items-center justify-end gap-3 md:w-auto">
                <button className="rounded-xl bg-[#eef5f2] px-5 py-2.5 text-[14px] font-semibold leading-5 text-[#3d4a41] hover:bg-[#e8efec] hover:text-[#161d1b]" onClick={() => setStatus("Đã lưu nháp.")} type="button">
                  Lưu nháp
                </button>
                <button className="flex items-center gap-1.5 rounded-xl bg-[#006d43] px-6 py-2.5 text-[14px] font-semibold leading-5 text-white shadow-md shadow-[#006d43]/20 hover:bg-[#006d3d] disabled:opacity-45" disabled={saving} onClick={submit} type="button">
                  <span>{saving ? "Đang lưu..." : status || "Lưu nhật ký"}</span>
                  <MaterialSymbol className="text-base" name={status.startsWith("Đã lưu") ? "check" : "arrow_forward"} />
                </button>
              </div>
            </div>
          </div>

          <PromptChips appendPrompt={appendPrompt} />
          <MascotHint />
        </div>

        <div className="relative z-20 mt-auto flex items-center justify-between bg-gradient-to-t from-[#f4fbf8] via-[#f4fbf8] to-transparent pb-5 pt-4 md:hidden">
          <div className="flex items-center gap-1.5 rounded-full border border-[#fdba74]/60 bg-[#fff7ed] px-3 py-1.5 text-[#c2410c]">
            <span className="text-[14px] leading-none">🔥</span>
            <span className="text-[12px] font-medium leading-none">
              3 ngày liên tiếp
            </span>
          </div>
          <button className="flex h-10 items-center gap-1.5 rounded-full bg-[#006d43] px-5 py-2 text-sm font-bold leading-none text-white shadow-[0_4px_12px_rgba(0,109,67,0.22)] hover:bg-[#005a37] disabled:opacity-45" disabled={saving} onClick={submit} type="button">
            <span>{saving ? "Đang lưu" : status || "Lưu lại"}</span>
            <MaterialSymbol className="text-[18px]" name="check_circle" />
          </button>
        </div>
      </section>

      <DesktopComposerFooter />
    </main>
  );
}
