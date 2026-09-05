"use client";

import { useState } from "react";
import { MomentsTab } from "./ProfileMomentsTab";
import { AllTab, PublicTab } from "./ProfilePublicTab";

type Tab = "all" | "public" | "moments";
type LayoutMode = "grid" | "list";

export function ProfileDesktopTabs({
  initialTab,
}: Readonly<{ initialTab: Tab }>) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [layout, setLayout] = useState<LayoutMode>("list");

  return (
    <section className="flex flex-col space-y-6">
      <div className={`flex items-center justify-between gap-4 pb-2 ${tab === "moments" ? "flex-wrap" : ""}`}>
        <div className="flex items-center gap-6">
          <DesktopTab active={tab === "all"} count={28} label="Tất cả nhật ký" onClick={() => setTab("all")} />
          <DesktopTab active={tab === "public"} count={12} label="Công khai" onClick={() => setTab("public")} />
          <DesktopTab active={tab === "moments"} count={tab === "moments" ? 16 : 4} label="Bộ sưu tập khoảnh khắc" onClick={() => setTab("moments")} />
        </div>
        {tab === "moments" ? (
          <MomentControls layout={layout} onChange={setLayout} />
        ) : (
          <ListControls layout={layout} onChange={setLayout} />
        )}
      </div>
      {tab === "moments" ? (
        <MomentsTab layout={layout} />
      ) : tab === "public" ? (
        <PublicTab layout={layout} />
      ) : (
        <AllTab layout={layout} />
      )}
    </section>
  );
}

function DesktopTab({
  active = false,
  count,
  label,
  onClick,
}: Readonly<{ active?: boolean; count: number; label: string; onClick?: () => void }>) {
  return (
    <button
      className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap pb-3 text-xl font-semibold leading-7 transition-colors ${active ? "font-bold text-[#006d43]" : "text-[#3d4a41] hover:text-[#161d1b]"}`}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium leading-[14px] ${active ? "bg-[#006d43]/10 font-bold text-[#006d43]" : "bg-[#e8efec] text-[#3d4a41]"}`}>
        {count}
      </span>
      {active ? <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#006d43]" /> : null}
    </button>
  );
}

function ListControls({
  layout,
  onChange,
}: Readonly<{
  layout: LayoutMode;
  onChange: (layout: LayoutMode) => void;
}>) {
  return (
    <div className="hidden items-center rounded-xl bg-[#eef5f2] p-0.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)] sm:inline-flex">
      <button
        aria-pressed={layout === "grid"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all ${layout === "grid" ? "bg-white text-[#006d43] shadow-sm" : "text-[#3d4a41] hover:text-[#161d1b]"}`}
        onClick={() => onChange("grid")}
        title="Dạng lưới"
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">grid_view</span>
      </button>
      <button
        aria-pressed={layout === "list"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all ${layout === "list" ? "bg-white text-[#006d43] shadow-sm" : "text-[#3d4a41] hover:text-[#161d1b]"}`}
        onClick={() => onChange("list")}
        title="Dạng danh sách"
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
      </button>
    </div>
  );
}

function MomentControls({
  layout,
  onChange,
}: Readonly<{
  layout: LayoutMode;
  onChange: (layout: LayoutMode) => void;
}>) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 pb-2.5">
      <div className="hidden items-center gap-1.5 rounded-xl bg-[#eef5f2] px-2.5 py-1 text-[#3d4a41] sm:flex">
        {["Tất cả", "Thiên nhiên & Cảnh sắc", "Gia đình & Bạn bè", "Góc nhỏ an yên", "Tháng này"].map((chip, index) => (
          <span
            className={`cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-medium leading-[14px] transition-colors ${index === 0 ? "bg-white font-semibold text-[#006d43] shadow-sm" : "hover:text-[#161d1b]"}`}
            key={chip}
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="hidden items-center rounded-xl bg-[#eef5f2] p-0.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)] sm:inline-flex">
        <button
          aria-pressed={layout === "grid"}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all ${layout === "grid" ? "bg-white text-[#006d43] shadow-sm" : "text-[#3d4a41] hover:text-[#161d1b]"}`}
          onClick={() => onChange("grid")}
          title="Dạng lưới"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">grid_view</span>
        </button>
        <button
          aria-pressed={layout === "list"}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all ${layout === "list" ? "bg-white text-[#006d43] shadow-sm" : "text-[#3d4a41] hover:text-[#161d1b]"}`}
          onClick={() => onChange("list")}
          title="Dạng danh sách"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
        </button>
      </div>
    </div>
  );
}
