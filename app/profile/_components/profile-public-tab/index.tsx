"use client";

import { MaterialSymbol } from "@/components/ui/material-symbol";
import { getStickerLabel } from "@/lib/entries/stickers";
import type { JournalEntry } from "@/lib/profile/types";
import { formatRelative, visibilityLabel } from "../profile-view";

type LayoutMode = "grid" | "list";

export function AllTab({ entries, layout }: Readonly<{ entries: JournalEntry[]; layout: LayoutMode }>) {
  return entries.length ? <LiveJournalEntries entries={entries} layout={layout} /> : <EmptyEntries />;
}

export function PublicTab({ entries, layout }: Readonly<{ entries: JournalEntry[]; layout: LayoutMode }>) {
  return entries.length ? <LiveJournalEntries entries={entries} layout={layout} /> : <EmptyEntries />;
}

function LiveJournalEntries({
  entries,
  layout,
}: Readonly<{
  entries: JournalEntry[];
  layout: LayoutMode;
}>) {
  return (
    <div className="flex flex-col space-y-4">
      <ListFilterBar />
      <div className={layout === "list" ? "flex flex-col gap-4" : "grid grid-cols-1 gap-5 lg:grid-cols-3"}>
        {entries.map((entry) => (
          <LiveEntryCard entry={entry} grid={layout === "grid"} key={entry.id} />
        ))}
      </div>
    </div>
  );
}

function LiveEntryCard({ entry, grid }: Readonly<{ entry: JournalEntry; grid: boolean }>) {
  const hasMetadata = entry.metadata.gratitudes.length || entry.metadata.reflection || entry.metadata.quote || entry.metadata.imageUrl;

  return (
    <article className={`${grid ? "min-h-[320px]" : ""} group flex flex-col gap-3 rounded-xl bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium leading-4 tracking-[0.04em] text-muted-foreground">{formatRelative(entry.createdAt)}</span>
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium leading-[14px] ${entry.visibility === "public" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
          {visibilityLabel(entry.visibility)}
        </span>
      </div>
      {hasMetadata ? (
        <div className="flex flex-col gap-3">
          {entry.metadata.quote ? <p className="whitespace-pre-wrap text-sm italic leading-5 text-muted-foreground">{"“"}{entry.metadata.quote}{"”"}</p> : null}
          {entry.metadata.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className="h-40 w-full rounded-xl object-cover" src={entry.metadata.imageUrl} />
          ) : null}
          {entry.metadata.gratitudes.length ? (
            <ul className="space-y-1 text-base leading-6 text-foreground">
              {entry.metadata.gratitudes.map((item, index) => (
                <li className="whitespace-pre-wrap" key={`${index}-${item}`}>
                  {index + 1}. {item}
                </li>
              ))}
            </ul>
          ) : null}
          {entry.metadata.reflection ? <p className="whitespace-pre-wrap text-base leading-6 text-foreground">{entry.metadata.reflection}</p> : null}
          <div className="flex flex-wrap gap-1.5">
            {[entry.metadata.mood, getStickerLabel(entry.metadata.sticker, "vi"), entry.metadata.space].filter(Boolean).map((item) => (
              <span className="rounded-md bg-muted px-2.5 py-0.5 text-[11px] font-medium leading-[14px] text-muted-foreground" key={item}>{item}</span>
            ))}
          </div>
        </div>
      ) : (
        <p className="whitespace-pre-wrap text-base leading-6 text-foreground">{entry.content}</p>
      )}
      <div className="mt-auto flex items-center gap-3 border-t border-border pt-3 text-muted-foreground">
        <SmallAction count={0} icon="favorite" />
        <SmallAction count={0} icon="chat_bubble" />
      </div>
    </article>
  );
}

function ListFilterBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium leading-[14px] text-muted-foreground">Lọc theo:</span>
        <button className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold leading-[14px] text-primary-foreground shadow-sm" type="button">
          Tất cả
        </button>
        {["#giadinh", "#congviec", "#thiennhien"].map((chip) => (
          <button className="rounded-full bg-card px-3 py-1 text-[11px] font-medium leading-[14px] text-muted-foreground transition-colors hover:bg-secondary" key={chip} type="button">
            {chip}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[11px] font-medium leading-[14px] text-muted-foreground">
        <MaterialSymbol className="text-sm" name="sort" />
        <span>Mới nhất</span>
      </div>
    </div>
  );
}

function EmptyEntries() {
  return (
    <div className="rounded-xl bg-card p-8 text-center shadow-sm">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-primary">
        <MaterialSymbol fill name="edit_note" />
      </div>
      <h3 className="text-lg font-semibold leading-7 text-foreground">Chưa có nhật ký</h3>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">Những điều biết ơn của bạn sẽ xuất hiện ở đây.</p>
    </div>
  );
}

function SmallAction({
  count,
  icon,
}: Readonly<{ count: number; icon: string }>) {
  return (
    <button className="flex items-center gap-1 transition-colors hover:text-[var(--fire)]" type="button">
      <MaterialSymbol className="text-base" name={icon} />
      <span className="text-[11px] font-medium leading-[14px]">{count}</span>
    </button>
  );
}
