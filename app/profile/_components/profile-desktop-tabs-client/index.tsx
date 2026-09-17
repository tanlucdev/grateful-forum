"use client";

import { useState } from "react";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { ProfileJournalBook } from "../profile-journal-book";
import { MomentsTab } from "../profile-moments-tab";
import { AllTab, PublicTab } from "../profile-public-tab";
import type { ProfileView } from "../profile-view";

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
      <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-primary/10 bg-muted/80 p-2 shadow-sm lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          <DesktopTab active={tab === "all"} count={view.entryCount} label="Tất cả nhật ký" onClick={() => setTab("all")} />
          <DesktopTab active={tab === "public"} count={view.publicCount} label="Công khai" onClick={() => setTab("public")} />
          <DesktopTab active={tab === "moments"} count={0} label="Bộ sưu tập khoảnh khắc" onClick={() => setTab("moments")} />
          <button
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm transition-all ${layout === "journal" && tab !== "moments" ? "bg-primary text-primary-foreground" : "bg-card/70 text-muted-foreground hover:text-primary"}`}
            onClick={() => {
              setTab("all");
              setLayout("journal");
            }}
            type="button"
          >
            <MaterialSymbol className="text-sm" name="auto_stories" />
            <span>Cuốn sổ ký ức</span>
            <span className="rounded-md bg-card/20 px-1.5 py-0.5 text-[9px] uppercase tracking-wider">Mới</span>
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
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors ${active ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:bg-card/70 hover:text-foreground"}`}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
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
    <div className="inline-flex self-end rounded-xl border border-primary/10 bg-card/95 p-1 shadow-sm lg:self-auto">
      <button
        aria-pressed={layout === "grid"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all ${layout === "grid" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => onChange("grid")}
        title="Dạng lưới"
        type="button"
      >
        <MaterialSymbol className="text-lg" name="grid_view" />
      </button>
      <button
        aria-pressed={layout === "list"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all ${layout === "list" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => onChange("list")}
        title="Dạng danh sách"
        type="button"
      >
        <MaterialSymbol className="text-lg" name="stream" />
      </button>
      <button
        aria-pressed={layout === "journal"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-all ${layout === "journal" ? "bg-accent text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
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
    <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-muted-foreground">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 font-bold text-foreground">
          <MaterialSymbol className="text-sm text-primary" name="tune" />
          Lọc theo:
        </span>
        {["Tất cả", "#giadinh", "#congviec", "#thiennhien"].map((chip, index) => (
          <button
            className={`rounded-lg border px-2.5 py-1 font-medium shadow-sm ${index === 0 ? "border-primary/20 bg-card text-primary" : "border-primary/10 bg-muted text-muted-foreground hover:border-primary/30"}`}
            key={chip}
            type="button"
          >
            {chip}
          </button>
        ))}
      </div>
      <span className="flex items-center gap-1.5 font-semibold text-primary">
        <MaterialSymbol className="text-sm" name="auto_stories" />
        Chế độ đọc lật trang
      </span>
    </div>
  );
}

function PageControls({ total }: Readonly<{ total: number }>) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/10 bg-muted/70 p-4 shadow-sm sm:flex-row">
      <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground shadow-sm transition-colors hover:border-primary/30 hover:text-primary" type="button">
        <MaterialSymbol className="text-sm" name="arrow_back" />
        <span>Trang trước</span>
      </button>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <MaterialSymbol className="text-sm text-primary" name="auto_stories" />
          Trang 24 - 25 / {Math.max(total, 1)} trang ghi chép
        </span>
        <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
          <span>Tháng 9</span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-input">
            <div className="h-full w-[65%] bg-primary" />
          </div>
          <span className="font-bold text-primary">Tháng 10</span>
        </div>
      </div>
      <button className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-colors hover:bg-[var(--leaf-deep)]" type="button">
        <span>Trang kế</span>
        <MaterialSymbol className="text-sm" name="arrow_forward" />
      </button>
    </div>
  );
}
