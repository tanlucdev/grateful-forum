"use client";

import Image from "next/image";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import {
  allEntries,
  publicEntries,
  type DesktopJournalEntry,
} from "./profile-desktop-tab-data";

type LayoutMode = "grid" | "list";

export function AllTab({ layout }: Readonly<{ layout: LayoutMode }>) {
  return <JournalEntries entries={allEntries} layout={layout} />;
}

export function PublicTab({ layout }: Readonly<{ layout: LayoutMode }>) {
  return <JournalEntries entries={publicEntries} layout={layout} />;
}

function JournalEntries({
  entries,
  layout,
}: Readonly<{
  entries: readonly DesktopJournalEntry[];
  layout: LayoutMode;
}>) {
  return (
    <div className="flex flex-col space-y-4">
      <ListFilterBar />
      <div className={layout === "list" ? "flex flex-col gap-4" : "grid grid-cols-1 gap-5 lg:grid-cols-3"}>
        {entries.map((entry) =>
          layout === "list" ? (
            <ListEntryCard entry={entry} key={entry.date} />
          ) : (
            <GridEntryCard entry={entry} key={entry.date} />
          ),
        )}
      </div>
    </div>
  );
}

function ListFilterBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium leading-[14px] text-[#3d4a41]">Lọc theo:</span>
        <button className="rounded-full bg-[#006d43] px-3 py-1 text-[11px] font-semibold leading-[14px] text-white shadow-sm" type="button">
          Tất cả
        </button>
        {["#giadinh", "#congviec", "#thiennhien"].map((chip) => (
          <button className="rounded-full bg-white px-3 py-1 text-[11px] font-medium leading-[14px] text-[#3d4a41] transition-colors hover:bg-[#e8efec]" key={chip} type="button">
            {chip}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
        <MaterialSymbol className="text-sm" name="sort" />
        <span>Mới nhất</span>
      </div>
    </div>
  );
}

function ListEntryCard({ entry }: Readonly<{ entry: DesktopJournalEntry }>) {
  return (
    <article className="group flex flex-col items-start justify-between gap-5 rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md md:flex-row">
      <div className="flex w-full flex-1 flex-col gap-4 sm:flex-row">
        {entry.media ? <EntryImage media={entry.media} /> : <MilestoneMini />}
        <div className="flex flex-1 flex-col justify-between space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${entry.accent}`} />
              <span className="text-xs font-medium leading-4 tracking-[0.04em] text-[#3d4a41]">{entry.date}</span>
              <MaterialSymbol className={`text-base ${entry.iconClass}`} fill name={entry.icon} />
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium leading-[14px] ${entry.visibility === "public" ? "bg-[#006d43]/10 text-[#006d43]" : "bg-[#eef5f2] text-[#3d4a41]"}`}>
                {entry.visibility === "public" ? "Công khai" : "Riêng tư"}
              </span>
              <button className="rounded-full p-1 text-[#3d4a41] transition-colors hover:text-[#161d1b]" title="Thêm tùy chọn" type="button">
                <MaterialSymbol className="text-base" name="more_horiz" />
              </button>
            </div>
          </div>
          <p className="text-base leading-6 text-[#161d1b]">{entry.text}</p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <span className="rounded-md bg-[#eef5f2] px-2.5 py-0.5 text-[11px] font-medium leading-[14px] text-[#3d4a41]" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-[#3d4a41]">
              <SmallAction count={entry.likes} icon="favorite" />
              <SmallAction count={entry.comments} icon="chat_bubble" />
              <button className="transition-colors hover:text-[#006d43]" title="Lưu bài viết" type="button">
                <MaterialSymbol className="text-base" name="bookmark_border" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function GridEntryCard({ entry }: Readonly<{ entry: DesktopJournalEntry }>) {
  return (
    <article className="group flex min-h-[360px] flex-col justify-between rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${entry.accent}`} />
            <span className="text-xs font-medium leading-4 tracking-[0.04em] text-[#3d4a41]">{entry.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <MaterialSymbol className={`text-base ${entry.iconClass}`} fill name={entry.icon} />
            <button className="rounded-full p-1 text-[#3d4a41] transition-colors hover:text-[#161d1b]" title="Thêm tùy chọn" type="button">
              <MaterialSymbol className="text-base" name="more_horiz" />
            </button>
          </div>
        </div>
        {entry.media ? <GridImage media={entry.media} /> : <MilestoneMini compact />}
        <p className="line-clamp-3 text-base leading-6 text-[#161d1b]">{entry.text}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {entry.tags.map((tag) => (
            <span className="rounded-md bg-[#eef5f2] px-2.5 py-0.5 text-[11px] font-medium leading-[14px] text-[#3d4a41]" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[#eef5f2] pt-4">
        <div className="flex items-center gap-3 text-[#3d4a41]">
          <SmallAction count={entry.likes} icon="favorite" />
          <SmallAction count={entry.comments} icon="chat_bubble" />
        </div>
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium leading-[14px] ${entry.visibility === "public" ? "bg-[#006d43]/10 text-[#006d43]" : "bg-[#eef5f2] text-[#3d4a41]"}`}>
          {entry.visibility === "public" ? "Công khai" : "Riêng tư"}
        </span>
      </div>
    </article>
  );
}

function EntryImage({
  media,
}: Readonly<{ media: NonNullable<DesktopJournalEntry["media"]> }>) {
  return (
    <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-[#e8efec] sm:h-28 sm:w-44">
      <Image alt="" className="object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(min-width: 640px) 176px, 100vw" src={media.image} />
      <div className={`absolute ${media.labelPosition === "top" ? "left-2 top-2 rounded-full" : "bottom-2 right-2 rounded-lg"} flex items-center gap-1 bg-white/85 px-2 py-0.5 text-[11px] font-medium leading-[14px] text-[#161d1b] shadow-sm backdrop-blur-md`}>
        <MaterialSymbol className="text-xs text-[#006d43]" fill={media.labelIcon === "favorite"} name={media.labelIcon} />
        <span>{media.label}</span>
      </div>
    </div>
  );
}

function GridImage({
  media,
}: Readonly<{ media: NonNullable<DesktopJournalEntry["media"]> }>) {
  return (
    <div className="relative h-40 overflow-hidden rounded-xl bg-[#e8efec]">
      <Image alt="" className="object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(min-width: 1024px) 344px, 100vw" src={media.image} />
      <div className={`absolute ${media.labelPosition === "top" ? "left-3 top-3 rounded-full" : "bottom-3 right-3 rounded-lg"} flex items-center gap-1 bg-white/85 px-2.5 py-1 text-[11px] font-medium leading-[14px] text-[#161d1b] shadow-sm backdrop-blur-md`}>
        <MaterialSymbol className="text-xs text-[#006d43]" fill={media.labelIcon === "favorite"} name={media.labelIcon} />
        <span>{media.label}</span>
      </div>
    </div>
  );
}

function MilestoneMini({ compact = false }: Readonly<{ compact?: boolean }>) {
  return (
    <div className={`flex w-full shrink-0 flex-col justify-between rounded-xl bg-[#d1e9e0]/30 p-3.5 ${compact ? "h-40" : "h-auto sm:h-28 sm:w-44"}`}>
      <div className="flex items-center gap-1.5 text-[#006d43]">
        <MaterialSymbol className="text-sm" fill name="task_alt" />
        <span className="text-xs font-semibold leading-4 tracking-[0.04em]">Cột mốc</span>
      </div>
      <p className="line-clamp-2 text-[11px] font-medium leading-[14px] text-[#3d4a41]">
        Đã gửi toàn bộ tài liệu dự án trước 18:00
      </p>
      <div className="flex items-center gap-1 text-[11px] font-medium text-[#006d43]">
        <MaterialSymbol className="text-xs" name="verified" />
        <span>Hoàn thành tốt</span>
      </div>
    </div>
  );
}

function SmallAction({
  count,
  icon,
}: Readonly<{ count: number; icon: string }>) {
  return (
    <button className="flex items-center gap-1 transition-colors hover:text-[#a5393e]" type="button">
      <MaterialSymbol className="text-base" name={icon} />
      <span className="text-[11px] font-medium leading-[14px]">{count}</span>
    </button>
  );
}
