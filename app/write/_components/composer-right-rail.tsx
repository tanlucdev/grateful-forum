import Image from "next/image";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { EntryVisibility } from "@/lib/entries/types";
import { privacyChoices } from "./composer-data";
import { NavItem, Panel, SectionTitle, TinyButton } from "./composer-primitives";
import type { WriteMood } from "./composer-data";

export function SideRail({
  resetDraft,
  setReflection,
  setVisibility,
  visibility,
}: {
  resetDraft: () => void;
  setReflection: (value: string) => void;
  setVisibility: (value: EntryVisibility) => void;
  visibility: EntryVisibility;
}) {
  return (
    <div className="flex flex-col gap-6 lg:col-span-5">
      <Panel>
        <SectionTitle helper="Tự động lồng khung" label="Ảnh kỷ niệm trong ngày (Polaroid)" />
        <div className="relative mt-4 rounded-2xl bg-white p-4 pt-6 pb-5 shadow-[0_8px_24px_rgba(26,47,43,0.08)]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm bg-[#d1e9e0]/80 px-10 py-1 text-[10px] font-bold tracking-[0.25em] text-[#006d43]">BEGRATEFUL</div>
          <Image alt="Góc quán quen buổi sớm thu" className="h-auto w-full rounded-xl object-cover" height={720} src="/stitch/write/polaroid-desktop.jpg" width={960} />
          <p className="pt-4 text-center text-[20px] font-semibold leading-7 italic text-[#006d43]">“Góc quán quen buổi sớm thu”</p>
          <div className="mt-3 flex items-center justify-center gap-4 text-[14px] font-medium text-[#3d4a41]">
            <TinyButton bare icon="edit" label="Đổi ảnh" />
            <span className="text-[#bccabe]">•</span>
            <TinyButton bare icon="crop" label="Căn chỉnh" />
          </div>
        </div>
      </Panel>
      <Panel className="bg-[#d1e9e0]/40">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
            <Image alt="Bé Mầm" className="h-9 w-9 object-contain" height={64} src="/stitch/landing/mascot.jpg" width={64} />
          </div>
          <div className="space-y-1">
            <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#006d43]">Lời dặn chánh niệm của Bé Mầm</span>
            <p className="text-[16px] leading-6 text-[#1a2f2b]">“Hãy gửi một tin nhắn cảm ơn người bạn thương quý vì đã luôn hiện diện và thấu hiểu bạn trong những ngày qua nhé!”</p>
          </div>
        </div>
      </Panel>
      <Panel>
        <span className="block text-[12px] font-bold uppercase tracking-[0.18em] text-[#6d7a70]">Chế độ quyền riêng tư &amp; Chia sẻ</span>
        <div className="mt-3 grid gap-2.5">
          {privacyChoices.map((choice) => {
            const active = visibility === choice.value;
            return (
              <button className={`flex items-start justify-between gap-3 rounded-xl p-3.5 text-left ${active ? "bg-white shadow-sm" : "bg-[#eef5f2]/60 hover:bg-[#eef5f2]"}`} key={choice.value} onClick={() => setVisibility(choice.value)} type="button">
                <div className="flex items-start gap-2.5">
                  <MaterialSymbol className={active ? "text-[#006d43]" : "text-[#3d4a41]"} fill={active} name={choice.icon} />
                  <div className="space-y-0.5">
                    <span className={`block text-[14px] font-semibold ${active ? "text-[#006d43]" : "text-[#161d1b]"}`}>{choice.title}</span>
                    <p className="text-[12px] leading-5 text-[#3d4a41]">{choice.description}</p>
                  </div>
                </div>
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${active ? "bg-[#006d43]" : "bg-[#dde4e1]"}`}>{active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}</span>
              </button>
            );
          })}
        </div>
      </Panel>
      <div className="flex items-center justify-between gap-3 border-t border-[#dde4e1] pt-4">
        <TinyButton bare icon="restore" label="Khôi phục bản nháp hôm qua" onClick={resetDraft} />
        <TinyButton bare danger icon="delete_sweep" label="Xóa nội dung đang viết" onClick={() => setReflection("")} />
      </div>
    </div>
  );
}

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#dde4e1] bg-[#f4fbf8]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-20 max-w-md items-center justify-around px-2">
        <NavItem icon="stream" label="Dòng thời gian" />
        <button className="-mt-4 flex flex-col items-center gap-1" type="button">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#006d43] text-white shadow-[0_8px_16px_rgba(0,109,67,0.22)]"><MaterialSymbol className="text-[26px]" fill name="eco" /></span>
          <span className="text-[11px] font-bold text-[#006d43]">Viết</span>
        </button>
        <NavItem icon="calendar_today" label="Lịch biết ơn" />
        <NavItem icon="person" label="Cá nhân" />
      </div>
    </nav>
  );
}

export function PreviewModal({
  close,
  gratitudes,
  mood,
  reflection,
  submit,
  today,
}: {
  close: () => void;
  gratitudes: string[];
  mood: WriteMood;
  reflection: string;
  submit: () => void;
  today: string;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1a2f2b]/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 text-center shadow-2xl">
        <button className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#eef5f2] text-[#3d4a41]" onClick={close} type="button"><MaterialSymbol name="close" /></button>
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#d1e9e0]/50 text-[#006d43]"><MaterialSymbol fill name="auto_stories" /></div>
        <h3 className="text-[24px] font-semibold leading-8 text-[#1a2f2b]">Xem trước Cuốn Sổ Ký Ức</h3>
        <p className="mx-auto mt-2 max-w-md text-[16px] leading-6 text-[#3d4a41]">Trang nhật ký {today} của bạn đã sẵn sàng được đóng vào cuốn sổ hành trình 365 ngày biết ơn.</p>
        <div className="mt-6 rounded-2xl bg-[#eef5f2] p-5 text-left">
          <div className="flex items-center justify-between gap-3 border-b border-[#dde4e1] pb-2">
            <span className="text-[14px] font-semibold text-[#006d43]">{today}</span>
            <span className="text-[12px] font-medium text-[#3d4a41]">☕ {mood}</span>
          </div>
          <p className="mt-3 text-[16px] leading-6 text-[#161d1b] italic">“{reflection.slice(0, 120)}...”</p>
          <ul className="mt-4 space-y-1.5 text-[12px] font-medium text-[#3d4a41]">{gratitudes.map((item, index) => <li key={index}>{index + 1}. {item}</li>)}</ul>
        </div>
        <button className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#006d43] px-5 py-2.5 text-[14px] font-semibold text-white" onClick={submit} type="button">
          <MaterialSymbol fill name="eco" />
          <span>Hoàn tất &amp; Lưu vào Cuốn Sổ</span>
        </button>
      </div>
    </div>
  );
}
