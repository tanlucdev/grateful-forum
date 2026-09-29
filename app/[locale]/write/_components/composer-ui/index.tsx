import { useLayoutEffect, useRef, useState, type ChangeEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { EntryVisibility } from "@/lib/entries/types";
import {
  privacyChoices,
  writeMoods,
  writeWashiOptions,
  type WriteMood,
  type WriteQuote,
  type WriteSticker,
  type WriteWashi,
} from "../composer-data";
import { getGratitudeInputs, getGratitudeSummary, GRATITUDE_PLACEHOLDERS } from "../gratitude-disclosure-state";
import { StickerPicker } from "../sticker-picker";
import { QuotePicker } from "../sticker-quote-picker";

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
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/70 p-3 shadow-sm backdrop-blur-sm md:flex-row md:items-center md:justify-between md:p-2.5 md:pl-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/80 text-primary shadow-sm">
          <MaterialSymbol className="text-[19px]" name="tune" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-bold leading-5 text-foreground sm:text-[14px]">Chế độ viết nhật ký</span>
            <Badge className="gap-1.5" variant="secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Đang dùng: {mode === "minimal" ? "Đơn giản" : "Trang trí"}
            </Badge>
          </div>
          <span className="hidden text-[11px] font-medium leading-4 text-muted-foreground sm:block">
            Tùy chọn phong cách viết tập trung tĩnh tâm hoặc thỏa sức điểm tô kỷ niệm
          </span>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-1 rounded-full bg-input/70 p-1 shadow-inner md:w-auto md:min-w-[220px] md:shrink-0" role="tablist">
        <button
          aria-controls="journal-editor-canvas"
          aria-selected={mode === "minimal"}
          className={`relative inline-flex min-h-9 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-semibold leading-4 outline-offset-2 transition-[background-color,color,box-shadow] before:absolute before:inset-x-0 before:inset-y-[-4px] before:content-[''] focus-visible:outline-2 focus-visible:outline-ring ${
            mode === "minimal" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:bg-card/70 hover:text-primary"
          }`}
          onClick={() => setMode("minimal")}
          role="tab"
          type="button"
        >
          <MaterialSymbol className="shrink-0 text-[14px]" name="spa" />
          <span>Đơn giản</span>
        </button>
        <button
          aria-controls="journal-editor-canvas"
          aria-selected={mode === "creative"}
          className={`relative inline-flex min-h-9 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-semibold leading-4 outline-offset-2 transition-[background-color,color,box-shadow] before:absolute before:inset-x-0 before:inset-y-[-4px] before:content-[''] focus-visible:outline-2 focus-visible:outline-ring ${
            mode === "creative" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:bg-card/70 hover:text-primary"
          }`}
          onClick={() => setMode("creative")}
          role="tab"
          type="button"
        >
          <MaterialSymbol className="shrink-0 text-[14px]" fill name="auto_awesome" />
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/60 px-3 py-1.5 text-primary">
            <MaterialSymbol className="text-[15px]" fill name="calendar_today" />
            <span className="md:hidden">{mobileDate}</span>
            <span className="hidden md:inline">{desktopDate}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Đã lưu tự động lúc 08:24
          </span>
        </div>
        <div className="max-w-3xl space-y-3">
          <h1 className="max-w-xl text-[28px] font-bold leading-9 tracking-normal text-foreground md:text-[32px] md:leading-10">
            Lắng đọng tâm trí, ghi lại hạt mầm biết ơn
          </h1>
          <p className="flex items-start gap-3 text-[16px] leading-6 text-muted-foreground md:text-[17px] md:leading-7">
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent/60 text-primary">
              <MaterialSymbol className="text-[18px]" fill name="spa" />
            </span>
            <span>Dừng lại vài phút cùng <span className="text-primary">Bé Mầm</span> để trân trọng 3 điều nhỏ bé và ấp ủ khoảnh khắc bình yên hôm nay.</span>
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2.5 md:flex-nowrap">
        {props.status ? <span className="shrink-0 text-[12px] font-semibold leading-4 text-primary">{props.status}</span> : null}
        <Button variant="outline" onClick={() => setStatus("Đã lưu nháp.")} type="button">
          <MaterialSymbol className="text-[17px]" name="history" />
          <span>Bản nháp</span>
        </Button>
        <Button variant="outline" onClick={() => setPreviewOpen(true)} type="button">
          <MaterialSymbol className="text-[17px]" name="auto_stories" />
          <span>Xem trước sổ</span>
        </Button>
        <Button className="shadow-sm hover:shadow-sm" disabled={!props.canSubmit} onClick={props.submit} type="button">
          <MaterialSymbol className="text-[17px]" fill name="eco" />
          <span>{props.saving ? "Đang lưu..." : "Lưu trang nhật ký"}</span>
        </Button>
      </div>
    </section>
  );
}

export function NotebookControls({ mode, mood, setMood, setSpace, setWashi, space, washi }: { mode: "minimal" | "creative"; mood: WriteMood; setMood: (mood: WriteMood) => void; setSpace: (space: string) => void; setWashi: (washi: WriteWashi) => void; space: string; washi: WriteWashi }) {
  return (
    <div className="flex flex-col gap-3">
      {mode === "creative" ? (
        <div className="flex flex-col gap-2">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-[10px] font-semibold uppercase leading-4 tracking-[0.16em] text-muted-foreground sm:text-[12px]">
            <MaterialSymbol className="text-[14px]" fill name="drag_indicator" />
            Băng dán Washi trang trí
          </span>
          <div className="flex items-center gap-2.5 overflow-x-auto px-0.5 pb-2">
            {writeWashiOptions.map((option) => {
              const active = washi === option.label;
              return (
                <button className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-semibold leading-4 sm:text-[12px] ${active ? "text-primary" : "text-muted-foreground"}`} key={option.label} onClick={() => setWashi(option.label)} style={{ backgroundColor: active ? option.bg : "var(--secondary)" }} type="button">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: option.accent }} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-3.5 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex w-full min-w-0 flex-col gap-2.5">
          <span className="text-[12px] font-semibold leading-5 text-foreground sm:text-[14px]">Tâm trạng đón nhận lúc này:</span>
          <div className="flex flex-wrap items-center gap-2.5">
            {writeMoods.map((item) => {
              const active = mood === item.label;
              const dotClass = {
                "Bình thản & Ấm áp": "bg-primary",
                "Nhẹ lòng": "bg-accent",
                "Hy vọng": "bg-[var(--fire)]",
                "Lắng đọng": "bg-muted-foreground",
              }[item.label];
              return (
                <button className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 text-[12px] font-semibold leading-5 outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-ring sm:text-[14px] ${active ? "border-primary bg-accent text-[var(--leaf-deep)] shadow-sm" : "border-border bg-card text-muted-foreground hover:border-input hover:bg-card"}`} key={item.label} onClick={() => setMood(item.label)} type="button">
                  <span className={`h-2 w-2 rounded-full ${dotClass}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Label className="text-[12px] font-semibold leading-5 text-foreground sm:text-[14px]" htmlFor="space">Không gian ghi chép:</Label>
          <div className="flex items-center gap-2.5">
            <div className="flex min-h-9 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-3.5 transition-colors focus-within:border-ring focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/15">
              <MaterialSymbol className="text-[16px] text-muted-foreground" name="location_on" />
              <input className="h-8 min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-[12px] font-semibold leading-5 text-foreground outline-none placeholder:text-muted-foreground focus-visible:!outline-none focus-visible:!outline-offset-0 sm:text-[14px]" id="space" onChange={(event) => setSpace(event.target.value)} placeholder="Ví dụ: Ban công góc nhỏ..." value={space} />
            </div>
            <button className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-2xl border border-dashed border-input bg-card px-3 text-[12px] font-semibold leading-5 text-muted-foreground outline-offset-2 transition-colors hover:border-input hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring sm:text-[14px]" onClick={() => document.getElementById("space")?.focus()} type="button">
              + Đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WritingPanel({ gratitudes, gratitudesOpen, mode, noteLength, quote, reflection, setGratitudes, setGratitudesOpen, setQuote, setReflection, setSticker, sticker }: { gratitudes: string[]; gratitudesOpen: boolean; mode: "minimal" | "creative"; noteLength: number; quote: WriteQuote; reflection: string; setGratitudes: (items: string[]) => void; setGratitudesOpen: (open: boolean) => void; setQuote: (value: WriteQuote) => void; setReflection: (value: string) => void; setSticker: (value: WriteSticker) => void; sticker: WriteSticker }) {
  const showGratitudes = mode === "creative" && gratitudesOpen;
  const [quoteOpen, setQuoteOpen] = useState(false);
  const gratitudeInputs = getGratitudeInputs(gratitudes);
  const gratitudeSummary = getGratitudeSummary(gratitudes);
  const gratitudeSummaryClass = gratitudeSummary.complete ? "bg-[var(--sprout)] text-[var(--leaf-deep)]" : "bg-secondary text-muted-foreground";

  function openGratitudes() {
    if (gratitudes.length < 3) setGratitudes(gratitudeInputs);
    setGratitudesOpen(true);
  }

  function updateGratitude(index: number, value: string) {
    setGratitudes(gratitudeInputs.map((item, itemIndex) => itemIndex === index ? value : item));
  }

  return (
    <div className="flex flex-col gap-3">
      {mode === "creative" ? (
        <>
          <button
            aria-controls="gratitude-fields"
            aria-expanded={showGratitudes}
            className="flex min-h-11 w-full items-center gap-3 rounded-2xl border border-border bg-muted/55 p-3 text-left shadow-sm outline-offset-2 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring sm:p-3.5"
            onClick={showGratitudes ? () => setGratitudesOpen(false) : openGratitudes}
            type="button"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/75 text-primary">
              <MaterialSymbol className="text-[20px]" fill name="volunteer_activism" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold leading-[22px] text-foreground sm:text-[16px] sm:leading-6">3 điều biết ơn</span>
              <span className="mt-0.5 block text-[11px] font-medium leading-4 text-muted-foreground sm:text-[12px]">
                Viết nhanh 3 điều nhỏ làm bạn thấy biết ơn
              </span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold leading-4 ${gratitudeSummaryClass}`}>{gratitudeSummary.text}</span>
              <span className="inline-flex items-center gap-1 text-[12px] font-semibold leading-4 text-primary">
                <span>{showGratitudes ? "Thu gọn" : "Nhập 3 điều"}</span>
                <MaterialSymbol className="text-[18px]" name={showGratitudes ? "expand_less" : "expand_more"} />
              </span>
            </span>
          </button>
          {showGratitudes ? (
            <div className="space-y-3" id="gratitude-fields">
              <div className="space-y-2.5">
                {gratitudeInputs.map((item, index) => (
                  <div className="group flex items-start gap-3 rounded-2xl bg-muted/70 p-3.5" key={index}>
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-accent/70 text-[14px] font-bold text-primary">{index + 1}</span>
                    <AutoGrowTextarea className="w-full resize-none bg-transparent text-[16px] leading-6 text-foreground outline-none placeholder:text-muted-foreground/60" minRows={1} onChange={(event) => updateGratitude(index, event.target.value)} placeholder={GRATITUDE_PLACEHOLDERS[index] ?? "Một điều biết ơn khác..."} value={item} />
                    {index >= 3 ? (
                      <button aria-label={`Xóa điều biết ơn ${index + 1}`} className="text-muted-foreground transition-colors hover:text-destructive md:opacity-0 md:group-hover:opacity-100" onClick={() => setGratitudes(gratitudeInputs.filter((_, itemIndex) => itemIndex !== index))} type="button">
                        <MaterialSymbol name="close" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
              <button className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-[12px] font-semibold leading-4 text-primary disabled:opacity-45" disabled={gratitudeInputs.length >= 10} onClick={() => setGratitudes([...gratitudeInputs, ""])} type="button">
                <MaterialSymbol className="text-[16px]" name="add_circle" />
                <span>Thêm điều biết ơn</span>
              </button>
            </div>
          ) : null}
        </>
      ) : null}
      <div className={`flex flex-col gap-2.5 ${mode === "creative" ? "mt-1" : ""}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <h3 className="flex items-center gap-2 text-[16px] font-semibold leading-6 text-foreground sm:text-[20px] sm:leading-7">
            <MaterialSymbol className="text-primary" fill={mode === "minimal"} name={mode === "minimal" ? "spa" : "edit_note"} />
            <span>{mode === "minimal" ? "Không gian tự do viết nên suy nghĩ của bạn" : "Khoảnh khắc tự sự & Tản văn trong ngày"}</span>
          </h3>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <span className="shrink-0 text-[11px] font-medium text-muted-foreground">{noteLength} ký tự</span>
            {reflection.length > 0 ? (
              <button aria-label="Xóa nội dung đang viết" className="text-[11px] font-semibold leading-4 text-muted-foreground underline-offset-4 transition-colors hover:text-destructive hover:underline" onClick={() => setReflection("")} type="button">
                Xóa nội dung
              </button>
            ) : null}
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 shadow-inner focus-within:ring-2 focus-within:ring-primary/20">
          <AutoGrowTextarea className="min-h-[220px] w-full resize-none bg-transparent text-[16px] leading-7 text-foreground outline-none placeholder:text-muted-foreground/60 md:min-h-[280px] md:text-[17px] md:leading-8" minRows={mode === "minimal" ? 8 : 9} onChange={(event) => setReflection(event.target.value)} placeholder={mode === "minimal" ? "Thoải mái viết về bất kỳ điều gì bạn cảm thấy biết ơn hoặc muốn giãi bày hôm nay..." : "Ghi lại những rung động nhẹ nhàng trong ngày..."} value={reflection} />
          <div className="mt-3 flex flex-col items-stretch gap-3 border-t border-input pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              <div className="w-full sm:w-[240px] sm:max-w-full">
                <StickerPicker compact onSelect={setSticker} sticker={sticker} />
              </div>
              <Button className="w-full max-w-full justify-start px-2.5 text-left text-[11px] font-medium sm:w-auto" onClick={() => setQuoteOpen(true)} size="sm" type="button" variant="outline">
                <MaterialSymbol className="text-[16px]" name="format_quote" />
                <span className="max-w-[220px] truncate">“{quote}”</span>
              </Button>
            </div>
            <div className="flex flex-wrap justify-start gap-1.5 sm:justify-end">{["#giadinh", "#thiennhien", "#an_yen"].map((tag) => <span className="rounded-full bg-accent/40 px-2 py-0.5 text-[10px] font-medium leading-4 text-primary" key={tag}>{tag}</span>)}</div>
          </div>
        </div>
      </div>
      <PickerPopup
          open={quoteOpen}
          setOpen={setQuoteOpen}
          quote={quote}
          setQuote={(value) => {
            setQuote(value);
            setQuoteOpen(false);
          }}
        />
    </div>
  );
}

function PickerPopup({
  open,
  quote,
  setOpen,
  setQuote,
}: Readonly<{
  open: boolean;
  quote: WriteQuote;
  setOpen: (open: boolean) => void;
  setQuote: (value: WriteQuote) => void;
}>) {
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="max-w-lg rounded-3xl p-5">
        <DialogHeader>
          <DialogTitle className="text-[20px] leading-7 text-foreground">Chọn câu trích dẫn</DialogTitle>
        </DialogHeader>
        <QuotePicker onSelect={setQuote} quote={quote} />
      </DialogContent>
    </Dialog>
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
    <div className="flex flex-col gap-2.5 border-t border-input pt-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          <MaterialSymbol className="text-[16px] text-primary" fill name="lock" />
          Chế độ quyền riêng tư &amp; Chia sẻ
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">Tự động mã hóa an toàn</span>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {privacyChoices.map((choice) => {
          const active = visibility === choice.value;
          return (
            <button
              className={`flex flex-col gap-1 rounded-xl border bg-muted p-3 text-left shadow-sm transition-colors hover:bg-input ${active ? "border-primary" : "border-transparent"}`}
              key={choice.value}
              onClick={() => setVisibility(choice.value)}
              type="button"
            >
              <span className="flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-2 text-[12px] font-bold leading-4 ${active ? "text-primary" : "text-muted-foreground"}`}>
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border ${active ? "border-primary" : "border-transparent"}`}>
                    <MaterialSymbol className="text-[17px]" name={choice.icon} />
                  </span>
                  {choice.title}
                </span>
                <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${active ? "border-primary bg-primary" : "border-border bg-card"}`}>
                  {active ? <span className="h-1.5 w-1.5 rounded-full bg-card" /> : null}
                </span>
              </span>
              <span className="text-[11px] leading-4 text-muted-foreground">{choice.description}</span>
            </button>
          );
        })}
      </div>
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
      className={`${className} focus-visible:!outline-none focus-visible:!outline-offset-0`}
      onChange={onChange}
      placeholder={placeholder}
      ref={ref}
      rows={minRows}
      style={{ overflow: "hidden" }}
      value={value}
    />
  );
}
