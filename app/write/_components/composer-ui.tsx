import { useLayoutEffect, useRef, type ChangeEvent } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { EntryVisibility } from "@/lib/entries/types";
import {
  privacyChoices,
  writeMoods,
  writeWashiOptions,
  type WriteMood,
  type WriteWashi,
} from "./composer-data";
import { SectionTitle, TinyButton } from "./composer-primitives";

type BaseProps = {
  canSubmit: boolean;
  saving: boolean;
  status: string;
  submit: () => void;
  today: string;
};

export function ModeSwitcher({
  mode,
  setMode,
}: Readonly<{
  mode: "minimal" | "creative";
  setMode: (mode: "minimal" | "creative") => void;
}>) {
  return (
    <section className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#e3eae7] bg-[#eef5f2]/70 p-3 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-2.5 md:pl-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#d1e9e0]/80 text-[#006d43] shadow-[0_2px_8px_rgba(0,109,67,0.08)]">
          <MaterialSymbol className="text-[19px]" name="tune" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-bold leading-5 text-[#1a2f2b] sm:text-[14px]">Chế độ viết nhật ký</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d1e9e0] px-2 py-0.5 text-[11px] font-semibold leading-4 text-[#006d43]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#006d43]" />
              Đang dùng: {mode === "minimal" ? "Đơn giản" : "Trang trí"}
            </span>
          </div>
          <span className="hidden text-[11px] font-medium leading-4 text-[#3d4a41] sm:block">
            Tùy chọn phong cách viết tập trung tĩnh tâm hoặc thỏa sức điểm tô kỷ niệm
          </span>
        </div>
      </div>
      <div className="inline-flex max-w-full self-start items-center gap-1 overflow-x-auto rounded-full bg-[#e3eae7]/80 p-1 shadow-inner md:shrink-0 md:self-auto" role="tablist">
        <button
          aria-controls="journal-editor-canvas"
          aria-selected={mode === "minimal"}
          className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[11px] font-semibold leading-4 outline-offset-2 transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-[#006d43] sm:px-3.5 sm:text-[12px] ${
            mode === "minimal" ? "bg-white text-[#006d43] shadow-[0_2px_8px_rgba(26,47,43,0.1)]" : "text-[#3d4a41] hover:bg-white/70 hover:text-[#006d43]"
          }`}
          onClick={() => setMode("minimal")}
          role="tab"
          type="button"
        >
          <MaterialSymbol className="shrink-0 text-[16px]" name="spa" />
          <span>Đơn giản</span>
        </button>
        <button
          aria-controls="journal-editor-canvas"
          aria-selected={mode === "creative"}
          className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[11px] font-semibold leading-4 outline-offset-2 transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-[#006d43] sm:px-3.5 sm:text-[12px] ${
            mode === "creative" ? "bg-white text-[#006d43] shadow-[0_2px_8px_rgba(26,47,43,0.1)]" : "text-[#3d4a41] hover:bg-white/70 hover:text-[#006d43]"
          }`}
          onClick={() => setMode("creative")}
          role="tab"
          type="button"
        >
          <MaterialSymbol className="shrink-0 text-[16px]" fill name="auto_awesome" />
          <span>Trang trí sổ</span>
        </button>
      </div>
    </section>
  );
}

export function WriteIntro({ setPreviewOpen, setStatus, ...props }: BaseProps & { setPreviewOpen: (open: boolean) => void; setStatus: (status: string) => void }) {
  const mobileDate = `Nhật ký hôm nay • ${props.today}`;
  const desktopDate = `Soạn thảo nhật ký hôm nay • ${props.today}`;

  return (
    <section className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8">
      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-[12px] font-medium leading-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d1e9e0]/60 px-3 py-1.5 text-[#006d43]">
            <MaterialSymbol className="text-[15px]" fill name="calendar_today" />
            <span className="md:hidden">{mobileDate}</span>
            <span className="hidden md:inline">{desktopDate}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#3d4a41]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#006d43]" />
            Đã lưu tự động lúc 08:24
          </span>
        </div>
        <div className="max-w-3xl space-y-3">
          <h1 className="max-w-xl text-[28px] font-bold leading-9 tracking-tight text-[#1a2f2b] md:text-[32px] md:leading-10">
            Lắng đọng tâm trí, ghi lại hạt mầm biết ơn
          </h1>
          <p className="flex items-start gap-3 text-[16px] leading-6 text-[#3d4a41] md:text-[17px] md:leading-7">
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#d1e9e0]/60 text-[#006d43]">
              <MaterialSymbol className="text-[18px]" fill name="spa" />
            </span>
            <span>Dừng lại vài phút cùng <span className="text-[#006d43]">Bé Mầm</span> để trân trọng 3 điều nhỏ bé và ấp ủ khoảnh khắc bình yên hôm nay.</span>
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2.5 md:flex-nowrap">
        {props.status ? <span className="shrink-0 text-[12px] font-semibold leading-4 text-[#006d43]">{props.status}</span> : null}
        <button className="inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-white/80 px-3.5 text-[13px] font-semibold leading-5 text-[#3d4a41] shadow-[0_1px_6px_rgba(26,47,43,0.05)] ring-1 ring-[#e3eae7] transition-colors hover:bg-white hover:text-[#006d43]" onClick={() => setStatus("Đã lưu nháp.")} type="button">
          <MaterialSymbol className="text-[17px]" name="history" />
          <span>Bản nháp</span>
        </button>
        <button className="inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-white/80 px-3.5 text-[13px] font-semibold leading-5 text-[#3d4a41] shadow-[0_1px_6px_rgba(26,47,43,0.05)] ring-1 ring-[#e3eae7] transition-colors hover:bg-white hover:text-[#006d43]" onClick={() => setPreviewOpen(true)} type="button">
          <MaterialSymbol className="text-[17px]" name="auto_stories" />
          <span>Xem trước sổ</span>
        </button>
        <button className="inline-flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl bg-[#006d43] px-4 text-[13px] font-semibold leading-5 text-white shadow-[0_4px_14px_rgba(0,109,67,0.18)] transition-shadow hover:shadow-[0_5px_18px_rgba(0,109,67,0.24)] disabled:opacity-45" disabled={!props.canSubmit} onClick={props.submit} type="button">
          <MaterialSymbol className="text-[17px]" fill name="eco" />
          <span>{props.saving ? "Đang lưu..." : "Lưu trang nhật ký"}</span>
        </button>
      </div>
    </section>
  );
}

export function NotebookControls({ mode, mood, setMood, setSpace, setWashi, space, washi }: { mode: "minimal" | "creative"; mood: WriteMood; setMood: (mood: WriteMood) => void; setSpace: (space: string) => void; setWashi: (washi: WriteWashi) => void; space: string; washi: WriteWashi }) {
  return (
    <div className="flex flex-col gap-3">
      {mode === "creative" ? (
        <div className="flex flex-col gap-2">
          <SectionTitle helper="Chạm để đổi viền sổ" label="Băng dán Washi trang trí" />
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5">
            {writeWashiOptions.map((option) => {
              const active = washi === option.label;
              return (
                <button className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold leading-4 ${active ? "text-[#006d43]" : "text-[#3d4a41]"}`} key={option.label} onClick={() => setWashi(option.label)} style={{ backgroundColor: active ? option.bg : "#e8efec" }} type="button">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: option.accent }} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#eef5f2]/70 p-3 sm:px-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-[12px] font-medium leading-4 text-[#3d4a41]">Tâm trạng hiện tại:</span>
          <div className="flex flex-wrap items-center gap-2">
            {writeMoods.map((item) => {
              const active = mood === item.label;
              return (
                <button className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium leading-4 ${active ? "bg-white text-[#006d43] shadow-sm ring-1 ring-[#006d43]/30" : "bg-[#e8efec] text-[#3d4a41] hover:bg-white"}`} key={item.label} onClick={() => setMood(item.label)} type="button">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex min-w-[180px] flex-col gap-1.5">
          <label className="text-[12px] font-medium leading-4 text-[#3d4a41]" htmlFor="space">Không gian ghi chép:</label>
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 shadow-inner">
            <MaterialSymbol className="text-[17px] text-[#006d43]" fill name="location_on" />
            <input className="w-full bg-transparent text-[14px] leading-5 outline-none placeholder:text-[#bccabe]" id="space" onChange={(event) => setSpace(event.target.value)} placeholder="Ví dụ: Bàn làm việc..." value={space} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WritingPanel({ gratitudes, gratitudesOpen, mode, noteLength, reflection, setGratitudes, setGratitudesOpen, setReflection }: { gratitudes: string[]; gratitudesOpen: boolean; mode: "minimal" | "creative"; noteLength: number; reflection: string; setGratitudes: (items: string[]) => void; setGratitudesOpen: (open: boolean) => void; setReflection: (value: string) => void }) {
  const showGratitudes = mode === "creative" && gratitudesOpen;

  function openGratitudes() {
    if (gratitudes.length === 0) setGratitudes(["", "", ""]);
    setGratitudesOpen(true);
  }

  return (
    <div className="flex flex-col gap-3">
      {mode === "creative" ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#006d43] text-[12px] font-bold text-white">3</span>
              <h2 className="text-[20px] font-semibold leading-7 text-[#1a2f2b]">3 Điều biết ơn hôm nay</h2>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-full bg-[#d1e9e0]/50 px-2.5 py-1 text-[11px] font-semibold leading-4 text-[#006d43]" onClick={showGratitudes ? () => setGratitudesOpen(false) : openGratitudes} type="button">
              <MaterialSymbol className="text-[15px]" name={showGratitudes ? "expand_less" : "expand_more"} />
              <span>{showGratitudes ? "Thu gọn" : "Mở phần này"}</span>
            </button>
          </div>
          {showGratitudes ? (
            <>
              <div className="space-y-2.5">
                {gratitudes.map((item, index) => (
                  <div className="group flex items-start gap-3 rounded-2xl bg-[#eef5f2]/70 p-3.5" key={index}>
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#d1e9e0]/70 text-[14px] font-bold text-[#006d43]">{index + 1}</span>
                    <AutoGrowTextarea className="w-full resize-none bg-transparent text-[14px] leading-6 text-[#161d1b] outline-none placeholder:text-[#bccabe]" minRows={1} onChange={(event) => setGratitudes(gratitudes.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} placeholder="Điều biết ơn của bạn..." value={item} />
                    <button aria-label={`Xóa điều biết ơn ${index + 1}`} className="text-[#6d7a70] transition-colors hover:text-[#ba1a1a] md:opacity-0 md:group-hover:opacity-100" onClick={() => setGratitudes(gratitudes.filter((_, itemIndex) => itemIndex !== index))} type="button">
                      <MaterialSymbol name="close" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="self-start inline-flex items-center gap-2 rounded-xl bg-[#e8efec] px-4 py-2 text-[12px] font-semibold leading-4 text-[#006d43] disabled:opacity-45" disabled={gratitudes.length >= 10} onClick={() => setGratitudes([...gratitudes, ""])} type="button">
                <MaterialSymbol className="text-[16px]" name="add_circle" />
                <span>Thêm điều biết ơn</span>
              </button>
            </>
          ) : null}
        </>
      ) : null}
      <div className={`flex flex-col gap-2.5 ${mode === "creative" ? "mt-1" : ""}`}>
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-[20px] font-semibold leading-7 text-[#1a2f2b]">
            <MaterialSymbol className="text-[#006d43]" fill={mode === "minimal"} name={mode === "minimal" ? "spa" : "edit_note"} />
            <span>{mode === "minimal" ? "Không gian tự do viết nên suy nghĩ của bạn" : "Khoảnh khắc tự sự & Tản văn trong ngày"}</span>
          </h3>
          <span className="shrink-0 text-[11px] font-medium text-[#6d7a70]">{noteLength} ký tự</span>
        </div>
        <div className="rounded-2xl border border-[#e3eae7]/60 bg-[#eef5f2]/40 p-4 shadow-inner focus-within:ring-2 focus-within:ring-[#006d43]/20">
          <AutoGrowTextarea className="min-h-[150px] w-full resize-none bg-transparent text-[14px] leading-6 text-[#161d1b] outline-none placeholder:text-[#bccabe] md:text-[16px] md:leading-7" minRows={mode === "minimal" ? 5 : 6} onChange={(event) => setReflection(event.target.value)} placeholder={mode === "minimal" ? "Thoải mái viết về bất kỳ điều gì bạn cảm thấy biết ơn hoặc muốn giãi bày hôm nay..." : "Ghi lại những rung động nhẹ nhàng trong ngày..."} value={reflection} />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#dde4e1] pt-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1 text-[11px] font-medium leading-4 text-[#3d4a41] shadow-sm">
                <MaterialSymbol className="text-[16px]" name={mode === "minimal" ? "sentiment_satisfied" : "sentiment_satisfied"} />
                <span>72 Sticker Bé Mầm</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1 text-[11px] font-medium leading-4 text-[#3d4a41] shadow-sm">
                <MaterialSymbol className="text-[16px]" name="format_quote" />
                <span>Câu trích dẫn</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">{["#giadinh", "#thiennhien", "#an_yen"].map((tag) => <span className="rounded-lg bg-[#d1e9e0]/40 px-2.5 py-1 text-[11px] font-medium leading-4 text-[#006d43]" key={tag}>{tag}</span>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrivacySettings({
  setVisibility,
  visibility,
}: Readonly<{
  setVisibility: (value: EntryVisibility) => void;
  visibility: EntryVisibility;
}>) {
  return (
    <div className="flex flex-col gap-2.5 border-t border-[#dde4e1] pt-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#3d4a41]">
          <MaterialSymbol className="text-[16px] text-[#006d43]" fill name="lock" />
          Chế độ quyền riêng tư &amp; Chia sẻ
        </span>
        <span className="text-[11px] font-medium text-[#6d7a70]">Tự động mã hóa an toàn</span>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {privacyChoices.map((choice) => {
          const active = visibility === choice.value;
          return (
            <button
              className={`flex flex-col gap-1 rounded-xl p-3 text-left shadow-sm transition-colors ${
                active ? "bg-[#e8efec] ring-1 ring-[#006d43]/20" : "bg-[#eef5f2] hover:bg-[#e3eae7]"
              }`}
              key={choice.value}
              onClick={() => setVisibility(choice.value)}
              type="button"
            >
              <span className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-2 text-[12px] font-bold leading-4 ${active ? "text-[#006d43]" : "text-[#006d3d]"}`}>
                  <MaterialSymbol className="text-[17px]" fill={active} name={choice.icon} />
                  {choice.title} {choice.value === "private" ? "🔒" : "🌸"}
                </span>
                <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${active ? "bg-[#006d43]" : "bg-[#dde4e1]"}`}>
                  {active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                </span>
              </span>
              <span className="text-[11px] leading-4 text-[#3d4a41]">{choice.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DraftActions({
  resetDraft,
  setReflection,
}: Readonly<{
  resetDraft: () => void;
  setReflection: (value: string) => void;
}>) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#dde4e1] pt-3">
      <TinyButton bare icon="restore" label="Khôi phục bản nháp hôm qua" onClick={resetDraft} />
      <TinyButton bare danger icon="delete_sweep" label="Xóa nội dung đang viết" onClick={() => setReflection("")} />
    </div>
  );
}

function AutoGrowTextarea({
  className,
  minRows,
  onChange,
  placeholder,
  value,
}: Readonly<{
  className: string;
  minRows: number;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  value: string;
}>) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "0px";
    element.style.height = `${Math.max(element.scrollHeight, minRows * 28)}px`;
  }, [minRows, value]);

  return (
    <textarea
      className={className}
      onChange={onChange}
      placeholder={placeholder}
      ref={ref}
      rows={minRows}
      style={{ overflow: "hidden" }}
      value={value}
    />
  );
}
