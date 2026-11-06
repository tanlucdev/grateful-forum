"use client";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { STICKER_GROUPS, stickers, type StickerGroup, type StickerId } from "@/lib/entries/stickers";
import { StickerIcon } from "@/components/entries/sticker-icons";
type Category = "all" | StickerGroup;
const categories: readonly Category[] = ["all", ...STICKER_GROUPS.map((item) => item.id)];
export function StickerPicker({ onSelect, sticker }: Readonly<{ onSelect: (value: StickerId | null) => void; sticker: StickerId | null }>) {
  const locale = useLocale() as "vi" | "en";
  const t = useTranslations("write.picker");
  const creative = useTranslations("write.creative");
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
          item.alts.vi,
          item.alts.en,
          ...item.tags.vi,
          ...item.tags.en,
        ].join(" ").toLowerCase();
        return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
      }),
    [category, normalizedQuery],
  );

  return <div className="min-w-0">
    <button aria-pressed={sticker === null} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-primary" onClick={() => onSelect(null)} type="button">{creative("none")}</button>
        <div className="space-y-3 border-b border-border p-4 sm:p-5">
          <label className="flex min-h-11 items-center gap-2 rounded-2xl bg-muted px-3 text-muted-foreground focus-within:bg-card has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:outline-offset-[-2px]">
            <MaterialSymbol className="text-lg text-primary" name="search" />
            <input aria-label={t("search")} className="journal-search min-w-0 flex-1 bg-transparent text-sm font-medium leading-5 outline-none placeholder:text-muted-foreground" onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} value={query} />
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => {
              const active = item === category;
              return (
                <button aria-pressed={active} className={`min-h-11 shrink-0 rounded-full px-3 text-xs font-bold outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-ring ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-accent"}`} key={item} onClick={() => setCategory(item)} type="button">
                  {t(`groups.${item}`)}
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
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
                  <span className="line-clamp-2 text-xs font-bold leading-4">{item.labels[locale]}</span>
                  {active ? <MaterialSymbol className="absolute right-2 top-2 text-lg" fill name="check_circle" /> : null}
                </button>
              );
            })}
          </div>
          {results.length ? null : <p className="py-8 text-center text-sm font-semibold text-muted-foreground">{t("empty")}</p>}
        </div>
</div>;
}
