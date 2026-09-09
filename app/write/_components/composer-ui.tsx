import { useLayoutEffect, useRef, type ChangeEvent } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import {
  writeMoods,
  writeWashiOptions,
  type WriteMood,
  type WriteWashi,
} from "./composer-data";
import { Panel, SectionTitle } from "./composer-primitives";

type BaseProps = {
  canSubmit: boolean;
  saving: boolean;
  status: string;
  submit: () => void;
  today: string;
};

export function WriteIntro({ setPreviewOpen, setStatus, ...props }: BaseProps & { setPreviewOpen: (open: boolean) => void; setStatus: (status: string) => void }) {
  const mobileDate = `Nhật ký hôm nay • ${props.today}`;
  const desktopDate = `Soạn thảo nhật ký hôm nay • ${props.today}`;

  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
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
      <div className="flex flex-wrap items-center gap-3">
        {props.status ? <span className="text-[12px] font-semibold leading-4 text-[#006d43]">{props.status}</span> : null}
        <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#eef5f2] px-4 py-2.5 text-[14px] font-semibold leading-5 text-[#3d4a41]" onClick={() => setStatus("Đã lưu nháp.")} type="button">
          <MaterialSymbol name="history" />
          <span>Bản nháp</span>
        </button>
        <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#eef5f2] px-4 py-2.5 text-[14px] font-semibold leading-5 text-[#3d4a41]" onClick={() => setPreviewOpen(true)} type="button">
          <MaterialSymbol name="auto_stories" />
          <span>Xem trước sổ</span>
        </button>
        <button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#006d43] px-5 py-2.5 text-[14px] font-semibold leading-5 text-white shadow-[0_4px_16px_rgba(0,109,67,0.22)] disabled:opacity-45" disabled={!props.canSubmit} onClick={props.submit} type="button">
          <MaterialSymbol fill name="eco" />
          <span>{props.saving ? "Đang lưu..." : "Lưu trang nhật ký"}</span>
        </button>
      </div>
    </section>
  );
}

export function NotebookControls({ mood, setMood, setSpace, setWashi, space, washi }: { mood: WriteMood; setMood: (mood: WriteMood) => void; setSpace: (space: string) => void; setWashi: (washi: WriteWashi) => void; space: string; washi: WriteWashi }) {
  return (
    <Panel>
      <SectionTitle helper="Chạm để đổi viền sổ" label="Băng dán Washi trang trí" />
      <div className="mt-4 flex flex-wrap gap-2.5">
        {writeWashiOptions.map((option) => {
          const active = washi === option.label;
          return (
            <button className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold leading-5 ${active ? "text-[#00331d]" : "text-[#3d4a41]"}`} key={option.label} onClick={() => setWashi(option.label)} style={{ backgroundColor: active ? option.bg : "#e8efec" }} type="button">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: option.accent }} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 grid gap-4 rounded-2xl bg-[#eef5f2]/70 p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <span className="mb-2 block text-[14px] font-medium text-[#3d4a41]">Tâm trạng hiện tại:</span>
          <div className="grid grid-cols-2 gap-2">
            {writeMoods.map((item) => {
              const active = mood === item.label;
              return (
                <button className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold leading-5 ${active ? "bg-[#d1e9e0]/70 text-[#006d43]" : "bg-white text-[#3d4a41]"}`} key={item.label} onClick={() => setMood(item.label)} type="button">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-[14px] font-medium text-[#3d4a41]" htmlFor="space">Không gian ghi chép:</label>
          <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5">
            <MaterialSymbol className="text-[#006d43]" fill name="pin_drop" />
            <input className="w-full bg-transparent text-[16px] leading-6 outline-none placeholder:text-[#bccabe]" id="space" onChange={(event) => setSpace(event.target.value)} placeholder="Ví dụ: Bàn làm việc, Quán cà phê quen..." value={space} />
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function WritingPanel({ gratitudes, noteLength, reflection, setGratitudes, setReflection }: { gratitudes: string[]; noteLength: number; reflection: string; setGratitudes: (items: string[]) => void; setReflection: (value: string) => void }) {
  return (
    <Panel>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#006d43] text-[12px] font-bold text-white">3</span>
          <h2 className="text-[20px] font-semibold leading-7 text-[#1a2f2b]">3 Điều biết ơn hôm nay</h2>
        </div>
        <span className="rounded-full bg-[#d1e9e0]/50 px-2.5 py-1 text-[11px] font-semibold leading-4 text-[#006d43]">#NhẹNhàngNuôiDưỡng</span>
      </div>
      <div className="mt-4 space-y-2.5">
        {gratitudes.map((item, index) => (
          <div className="group flex items-start gap-3 rounded-2xl bg-[#eef5f2]/70 p-3.5" key={index}>
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#d1e9e0]/70 text-[14px] font-bold text-[#006d43]">{index + 1}</span>
            <AutoGrowTextarea className="w-full resize-none bg-transparent text-[16px] leading-6 text-[#161d1b] outline-none placeholder:text-[#bccabe]" minRows={2} onChange={(event) => setGratitudes(gratitudes.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} placeholder="Điều biết ơn của bạn..." value={item} />
            <button aria-label={`Xóa điều biết ơn ${index + 1}`} className="text-[#bccabe] hover:text-[#ba1a1a]" onClick={() => setGratitudes(gratitudes.map((value, itemIndex) => itemIndex === index ? "" : value))} type="button">
              <MaterialSymbol name="close" />
            </button>
          </div>
        ))}
      </div>
      <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#e8efec] px-4 py-2.5 text-[14px] font-semibold leading-5 text-[#006d43]" onClick={() => setGratitudes([...gratitudes, ""])} type="button">
        <MaterialSymbol name="add_circle" />
        <span>Thêm điều biết ơn thứ tư</span>
      </button>
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-[20px] font-semibold leading-7 text-[#1a2f2b]">
            <MaterialSymbol className="text-[#006d43]" name="edit_note" />
            <span>Khoảnh khắc tự sự &amp; Tản văn trong ngày</span>
          </h3>
          <span className="text-[12px] font-medium text-[#6d7a70]">{noteLength} ký tự</span>
        </div>
        <div className="rounded-2xl bg-[#eef5f2]/60 p-4">
          <AutoGrowTextarea className="min-h-[180px] w-full resize-none bg-transparent text-[16px] leading-7 text-[#161d1b] outline-none placeholder:text-[#bccabe]" minRows={6} onChange={(event) => setReflection(event.target.value)} placeholder="Ghi lại những rung động nhẹ nhàng trong ngày..." value={reflection} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#dde4e1] pt-3">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#d1e9e0]/40 px-2.5 py-1 text-[11px] font-medium leading-4 text-[#006d43]">Sticker và câu trích dẫn được chọn ở khay bên phải</span>
            </div>
            <div className="flex flex-wrap gap-1.5">{["#giadinh", "#thiennhien", "#an_yen"].map((tag) => <span className="rounded-md bg-[#d1e9e0]/40 px-2 py-0.5 text-[11px] font-medium leading-4 text-[#006d43]" key={tag}>{tag}</span>)}</div>
          </div>
        </div>
      </div>
    </Panel>
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
