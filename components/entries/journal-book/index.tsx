"use client";
/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { JournalBookFrame, JournalBookPage } from "@/components/entries/journal-book-frame";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { StickerIcon } from "@/components/entries/sticker-icons";
import { getSticker } from "@/lib/entries/stickers";
import type { EntryMetadata } from "@/lib/entries/types";

export function JournalBook({ date, washi, left, right }: Readonly<{ date: string; washi?: string | null; left: ReactNode; right?: ReactNode }>) {
  const t = useTranslations("write");
  return <JournalBookFrame label={t("creative.diaryTitle")} washi={washi} single={!right}>
    <JournalBookPage single={!right}><div><header className="mb-4 border-b border-[#ebdcca] pb-3"><h1 className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("creative.diaryTitle")}</h1><p className="mt-1 flex items-center gap-2 text-sm font-semibold"><MaterialSymbol className="text-base text-muted-foreground" name="calendar_today" />{date}</p></header>{left}</div></JournalBookPage>
    {right ? <JournalBookPage index={1}><div><h2 className="mb-4 text-sm font-bold text-primary">{t("creative.memories")}</h2>{right}</div></JournalBookPage> : null}
  </JournalBookFrame>;
}

export function JournalMemories({ imageUrl, sticker, reflection }: Readonly<Pick<EntryMetadata, "imageUrl" | "sticker" | "reflection">>) {
  const t = useTranslations("write");
  return <div className="space-y-4 whitespace-pre-wrap [overflow-wrap:anywhere]">
    {imageUrl ? <div className="journal-photo"><img alt={t("creative.image")} className="h-auto w-full rounded-lg" src={imageUrl} /></div> : null}
    {reflection || (sticker && getSticker(sticker)) ? <div className="journal-reflection">
      {sticker && getSticker(sticker) ? <StickerIcon className="h-12 w-12 shrink-0" id={sticker} /> : null}
      {reflection ? <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">{reflection}</p> : null}
    </div> : null}
  </div>;
}

export function JournalBookContent({ date, metadata, content = "", paragraph = false }: Readonly<{ date: string; metadata: EntryMetadata; content?: string; paragraph?: boolean }>) {
  const t = useTranslations("write");
  const locale = useLocale();
  const number = new Intl.NumberFormat(locale);
  const knownMood = ["calm", "light", "hopeful", "reflective"].includes(metadata.mood ?? "");
  return <JournalBook date={date} washi={metadata.washi} left={<div className="space-y-4 whitespace-pre-wrap [overflow-wrap:anywhere]">
    {metadata.mood || metadata.quote ? <div className="journal-mood">
      {metadata.mood ? <span className="inline-flex rounded-full bg-card px-2 py-1 text-xs font-bold text-primary shadow-sm">{knownMood ? t(`moods.${metadata.mood as "calm" | "light" | "hopeful" | "reflective"}`) : metadata.mood}</span> : null}
      {metadata.quote ? <blockquote className="mt-2 text-sm italic leading-relaxed text-muted-foreground">{metadata.quote}</blockquote> : null}
    </div> : null}
    <h2 className="flex items-center gap-2 text-sm font-bold text-primary"><MaterialSymbol name="favorite" />{t("gratitudes.title")}</h2>
    {paragraph && metadata.gratitudes.length === 1 ? <p className="journal-gratitude text-base leading-8">{metadata.gratitudes[0]}</p> : metadata.gratitudes.length ? <ol className="space-y-2">{metadata.gratitudes.map((item, index) => <li className="journal-gratitude" key={index}><span aria-hidden="true" className="journal-number">{number.format(index + 1)}</span><p className="min-w-0 text-sm leading-relaxed">{item}</p></li>)}</ol> : <p className="text-sm leading-relaxed">{content}</p>}
    {metadata.space ? <p className="flex items-start gap-1 border-t border-[#ebdcca] pt-3 text-xs text-muted-foreground"><MaterialSymbol className="shrink-0 text-base text-primary" name="pin_drop" /><span className="min-w-0">{metadata.space}</span></p> : null}
  </div>} right={metadata.imageUrl || metadata.reflection || getSticker(metadata.sticker) ? <JournalMemories {...metadata} /> : null} />;
}
