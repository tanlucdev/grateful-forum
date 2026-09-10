"use client";

import { useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ProfileJournalBook } from "./ProfileJournalBook";
import { MomentsTab } from "./ProfileMomentsTab";
import { AllTab, PublicTab } from "./ProfilePublicTab";
import type { ProfileView } from "./profile-view";

type Tab = "all" | "public" | "moments";
type LayoutMode = "grid" | "journal" | "list";

export function ProfileDesktopTabs({
  initialTab,
  view,
}: Readonly<{ initialTab: Tab; view: ProfileView }>) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [layout, setLayout] = useState<LayoutMode>("journal");
  const entries = tab === "public" ? view.entries.filter((entry) => entry.visibility === "public" || entry.visibility === "anonymous") : view.entries;

  return (
    <section className="flex flex-col space-y-4">
      <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#006d43]/10 bg-[#eef5f2]/80 p-2 shadow-sm lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          <DesktopTab active={tab === "all"} count={view.entryCount} label="Tất cả nhật ký" onClick={() => setTab("all")} />
          <DesktopTab active={tab === "public"} count={view.publicCount} label="Công khai" onClick={() => setTab("public")} />
          <DesktopTab active={tab === "moments"} count={0} label="Bộ sưu tập khoảnh khắc" onClick={() => setTab("moments")} />
          <button
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm transition-all ${layout === "journal" && tab !== "moments" ? "bg-[#006d43] text-white" : "bg-white/70 text-[#3d4a41] hover:text-[#006d43]"}`}
            onClick={() => {
              setTab("all");
              setLayout("journal");
            }}
            type="button"
          >
            <MaterialSymbol className="text-sm" name="auto_stories" />
            <span>Cuốn sổ ký ức</span>
            <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wider">Mới</span>
          </button>
        </div>
        {tab === "moments" ? null : (
          <ListControls layout={layout} onChange={setLayout} />
        )}
      </div>
      {tab === "moments" || layout !== "journal" ? null : <FilterBar />}
      {tab === "moments" ? (
        <MomentsTab layout={layout === "journal" ? "list" : layout} />
      ) : layout === "journal" ? (
        <ProfileJournalBook view={{ ...view, entries }} />
      ) : tab === "public" ? (
        <PublicTab entries={entries} layout={layout} />
      ) : (
        <AllTab entries={entries} layout={layout} />
      )}
      {tab === "moments" || layout !== "journal" ? null : <PageControls total={Math.max(view.entryCount, entries.length)} />}
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
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${active ? "bg-white text-[#006d43] shadow-sm" : "text-[#3d4a41] hover:bg-white/70 hover:text-[#161d1b]"}`}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${active ? "bg-[#006d43]/10 text-[#006d43]" : "bg-[#e8efec] text-[#3d4a41]"}`}>
        {count}
      </span>
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
    <div className="inline-flex self-end rounded-xl border border-[#006d43]/10 bg-white/95 p-1 shadow-sm lg:self-auto">
      <button
        aria-pressed={layout === "grid"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all ${layout === "grid" ? "bg-white text-[#006d43] shadow-sm" : "text-[#3d4a41] hover:text-[#161d1b]"}`}
        onClick={() => onChange("grid")}
        title="Dạng lưới"
        type="button"
      >
        <MaterialSymbol className="text-lg" name="grid_view" />
      </button>
      <button
        aria-pressed={layout === "list"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all ${layout === "list" ? "bg-white text-[#006d43] shadow-sm" : "text-[#3d4a41] hover:text-[#161d1b]"}`}
        onClick={() => onChange("list")}
        title="Dạng danh sách"
        type="button"
      >
        <MaterialSymbol className="text-lg" name="stream" />
      </button>
      <button
        aria-pressed={layout === "journal"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all ${layout === "journal" ? "bg-[#d1e9e0] text-[#006d43] shadow-sm" : "text-[#3d4a41] hover:text-[#161d1b]"}`}
        onClick={() => onChange("journal")}
        title="Cuốn sổ tay"
        type="button"
      >
        <MaterialSymbol className="text-lg" name="auto_stories" />
      </button>
    </div>
  );
}

function FilterBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-[#3d4a41]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 font-bold text-[#1a2f2b]">
          <MaterialSymbol className="text-sm text-[#006d43]" name="tune" />
          Lọc theo:
        </span>
        {["Tất cả", "#giadinh", "#congviec", "#thiennhien"].map((chip, index) => (
          <button
            className={`rounded-lg border px-2.5 py-1 font-medium shadow-sm ${index === 0 ? "border-[#006d43]/20 bg-white text-[#006d43]" : "border-[#006d43]/10 bg-[#eef5f2] text-[#3d4a41] hover:border-[#006d43]/30"}`}
            key={chip}
            type="button"
          >
            {chip}
          </button>
        ))}
      </div>
      <span className="flex items-center gap-1.5 font-semibold text-[#006d43]">
        <MaterialSymbol className="text-sm" name="auto_stories" />
        Chế độ đọc lật trang
      </span>
    </div>
  );
}

function PageControls({ total }: Readonly<{ total: number }>) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#006d43]/10 bg-[#eef5f2]/70 p-4 shadow-sm sm:flex-row">
      <button className="inline-flex items-center gap-1.5 rounded-xl border border-[#e3eae7] bg-white px-4 py-2 text-xs font-bold text-[#161d1b] shadow-sm transition-colors hover:border-[#006d43]/30 hover:text-[#006d43]" type="button">
        <MaterialSymbol className="text-sm" name="arrow_back" />
        <span>Trang trước</span>
      </button>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="flex items-center gap-1.5 text-xs font-bold text-[#1a2f2b]">
          <MaterialSymbol className="text-sm text-[#006d43]" name="auto_stories" />
          Trang 24 - 25 / {Math.max(total, 1)} trang ghi chép
        </span>
        <div className="flex items-center gap-2 text-[10px] font-medium text-[#3d4a41]">
          <span>Tháng 9</span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#e3eae7]">
            <div className="h-full w-[65%] bg-[#006d43]" />
          </div>
          <span className="font-bold text-[#006d43]">Tháng 10</span>
        </div>
      </div>
      <button className="inline-flex items-center gap-1.5 rounded-xl bg-[#006d43] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#006d3d]" type="button">
        <span>Trang kế</span>
        <MaterialSymbol className="text-sm" name="arrow_forward" />
      </button>
    </div>
  );
}
