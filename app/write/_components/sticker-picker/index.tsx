"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { getStickerLabel, STICKER_GROUPS, stickers, type StickerGroup, type StickerId } from "@/lib/entries/stickers";
import { StickerIcon } from "../sticker-icons";

type StickerPickerProps = {
  compact?: boolean;
  onSelect: (value: StickerId) => void;
  sticker: StickerId;
};

type Category = "all" | StickerGroup;

const categories: readonly { id: Category; label: string }[] = [
  { id: "all", label: "Tất cả" },
  ...STICKER_GROUPS,
];

export function StickerPicker({ compact = false, onSelect, sticker }: Readonly<StickerPickerProps>) {
  const [open, setOpen] = useState(false);
  const label = getStickerLabel(sticker, "vi") ?? sticker;

  return (
    <>
      <button
        className={`flex w-full items-center gap-2 text-left outline-offset-2 ring-1 ring-accent transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-ring ${
          compact ? "min-h-9 rounded-xl bg-card px-2.5 py-1" : "min-h-14 rounded-2xl bg-muted/80 px-3 py-2"
        }`}
        onClick={() => setOpen(true)}
        type="button"
      >
        <StickerIcon className={`${compact ? "h-7 w-7" : "h-10 w-10"} shrink-0`} id={sticker} />
        <span className="min-w-0 flex-1">
          {compact ? null : <span className="block text-xs font-semibold leading-4 text-muted-foreground">Sticker hiện tại</span>}
          <span className={`${compact ? "text-xs leading-4" : "text-sm leading-5"} block truncate font-bold text-foreground`}>{compact ? `Sticker: ${label}` : label}</span>
        </span>
        <MaterialSymbol className="text-lg text-primary" name="keyboard_arrow_down" />
      </button>
      {open ? (
        <StickerPickerModal
          close={() => setOpen(false)}
          onSelect={(value) => {
            onSelect(value);
            setOpen(false);
          }}
          sticker={sticker}
        />
      ) : null}
    </>
  );
}

function StickerPickerModal({
  close,
  onSelect,
  sticker,
}: Readonly<StickerPickerProps & { close: () => void }>) {
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      stickers.filter((item) => {
        const matchesCategory = category === "all" || item.group === category;
        const haystack = [
          item.id,
          item.labels.vi,
          item.labels.en,
          ...item.tags.vi,
          ...item.tags.en,
        ].join(" ").toLowerCase();
        return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
      }),
    [category, normalizedQuery],
  );

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = document.querySelector<HTMLElement>("[data-sticker-picker-modal]");
    const siblings = Array.from(document.body.children).filter((child) => !child.hasAttribute("data-sticker-picker-portal"));
    const previousOverflow = document.body.style.overflow;
    siblings.forEach((child) => child.setAttribute("inert", ""));
    document.body.style.overflow = "hidden";
    root?.querySelector<HTMLElement>("[data-sticker-picker-close]")?.focus();

    function closeOnKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !root) return;

      const focusable = Array.from(root.querySelectorAll<HTMLElement>("button, input, [href], [tabindex]:not([tabindex='-1'])")).filter((element) => !element.hasAttribute("disabled"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", closeOnKey);
    return () => {
      window.removeEventListener("keydown", closeOnKey);
      siblings.forEach((child) => child.removeAttribute("inert"));
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [close]);

  return createPortal(
    <div aria-label="Chọn sticker" aria-modal="true" className="fixed inset-0 z-[100] flex items-end justify-center bg-foreground/35 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-5 sm:py-8" data-sticker-picker-modal onClick={close} role="dialog">
      <div className="flex max-h-[calc(100dvh-32px)] w-full max-w-3xl flex-col rounded-3xl bg-card shadow-2xl ring-1 ring-border" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-border p-4 sm:p-5">
          <div className="min-w-0">
            <h4 className="text-xl font-semibold leading-7 text-foreground">Chọn sticker Bé Mầm</h4>
            <p className="mt-1 text-xs font-medium leading-4 text-muted-foreground">{stickers.length} sticker native SVG</p>
          </div>
          <button aria-label="Đóng popup" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground outline-offset-2 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring" data-sticker-picker-close onClick={close} type="button">
            <MaterialSymbol name="close" />
          </button>
        </div>
        <div className="space-y-3 border-b border-border p-4 sm:p-5">
          <label className="flex min-h-11 items-center gap-2 rounded-2xl bg-muted px-3 text-muted-foreground focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/25">
            <MaterialSymbol className="text-lg text-primary" name="search" />
            <input className="min-w-0 flex-1 bg-transparent text-sm font-medium leading-5 outline-none placeholder:text-muted-foreground" onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo id, nhãn, tag..." value={query} />
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => {
              const active = item.id === category;
              return (
                <button className={`h-9 shrink-0 rounded-full px-3 text-xs font-bold outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-ring ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-accent"}`} key={item.id} onClick={() => setCategory(item.id)} type="button">
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {results.map((item) => {
              const active = sticker === item.id;
              return (
                <button
                  aria-pressed={active}
                  className={`relative flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-2xl p-3 text-center outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-ring ${
                    active ? "bg-accent/80 text-primary ring-2 ring-primary" : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  type="button"
                >
                  <StickerIcon className="h-12 w-12" id={item.id} />
                  <span className="line-clamp-2 text-xs font-bold leading-4">{item.labels.vi}</span>
                  {active ? <MaterialSymbol className="absolute right-2 top-2 text-lg" fill name="check_circle" /> : null}
                </button>
              );
            })}
          </div>
          {results.length ? null : <p className="py-8 text-center text-sm font-semibold text-muted-foreground">Không tìm thấy sticker phù hợp.</p>}
        </div>
      </div>
    </div>,
    getStickerPickerPortal(),
  );
}

function getStickerPickerPortal() {
  let portal = document.querySelector<HTMLElement>("[data-sticker-picker-portal]");
  if (!portal) {
    portal = document.createElement("div");
    portal.setAttribute("data-sticker-picker-portal", "");
    document.body.append(portal);
  }
  return portal;
}
