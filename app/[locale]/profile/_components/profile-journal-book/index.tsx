"use client";

import { EntryImage } from "@/components/entries/entry-image";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { JournalBookFrame, JournalBookPage } from "@/components/entries/journal-book-frame";
import { StickerIcon } from "@/components/entries/sticker-icons";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { selectJournalEntry } from "@/lib/entries/composer";
import { getSticker } from "@/lib/entries/stickers";
import type { JournalEntry } from "@/lib/profile/types";
import { Link } from "@/i18n/navigation";
import type { ProfileView } from "../profile-view";
import { EntryActionsClient } from "../entry-actions-client";

export function ProfileJournalBook({ mobile = false, view }: Readonly<{ mobile?: boolean; view: ProfileView }>) {
  const t = useTranslations("profile");
  const w = useTranslations("write");
  const pageSize = mobile ? 1 : 2;
  const selection = selectJournalEntry(view.entries, view.requestedEntry);
  const [selectedId, setSelectedId] = useState(view.entries[selection.index]?.id);
  const index = Math.max(0, view.entries.findIndex((entry) => entry.id === selectedId));
  const entries = view.entries.slice(index, index + pageSize);

  return (
    <section className="min-w-0 space-y-4 [overflow-wrap:anywhere]">
      {selection.unavailable ? <p role="status" className="text-sm text-muted-foreground">{w("book.entryUnavailable")}</p> : null}
      {!entries.length ? (
        <div className="rounded-2xl bg-card p-6 text-center">
          <p>{w("book.empty")}</p>
          <Link className="mt-3 inline-flex min-h-11 items-center rounded-xl bg-primary px-4 font-semibold text-primary-foreground" href="/write">{w("book.newPage")}</Link>
        </div>
      ) : (
        <>
          <JournalBookFrame label={w("creative.diaryTitle")} mobile={mobile} washi={entries[0].metadata.washi}>
            {entries.map((entry, offset) => <NotebookPage entry={entry} index={offset} key={entry.id} page={index + offset + 1} />)}
          </JournalBookFrame>
          <nav aria-label={w("book.navigation")} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-card p-3">
            <button className="min-h-11 rounded-lg px-3 font-semibold text-primary disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" disabled={index === 0} onClick={() => setSelectedId(view.entries[Math.max(0, index - pageSize)].id)} type="button">{t("pagination.previous")}</button>
            <span aria-live="polite" className="text-sm">{t("book.position", { first: index + 1, last: index + entries.length, total: view.entries.length })}</span>
            <button className="min-h-11 rounded-lg px-3 font-semibold text-primary disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" disabled={index + pageSize >= view.entries.length} onClick={() => setSelectedId(view.entries[index + pageSize].id)} type="button">{t("pagination.next")}</button>
          </nav>
        </>
      )}
    </section>
  );
}

function NotebookPage({ entry, index, page }: Readonly<{ entry: JournalEntry; index: number; page: number }>) {
  const t = useTranslations("profile");
  const w = useTranslations("write");
  const locale = useLocale();
  const number = new Intl.NumberFormat(locale);
  const date = new Date(entry.createdAt);
  const { metadata } = entry;
  const handwritten = entry.entryKind === "handwritten";
  const gratitudes = metadata.gratitudes;
  const mood = metadata.mood && (["calm", "light", "hopeful", "reflective"].includes(metadata.mood)
    ? w(`moods.${metadata.mood as "calm" | "light" | "hopeful" | "reflective"}`)
    : metadata.mood);

  return (
    <JournalBookPage index={index}>
      <div className="space-y-4">
        <header className="border-b border-[#ebdcca] pb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{w("creative.diaryTitle")} · {t("book.page", { number: page })}</p>
          <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
            <MaterialSymbol className="text-base text-muted-foreground" name="calendar_today" />
            <time dateTime={entry.createdAt}>{new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(date)}</time>
          </div>
        </header>
        <div className="journal-mood">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {mood ? <span className="rounded-full bg-card px-2 py-1 font-bold text-primary shadow-sm">{mood}</span> : null}
            <span className="text-muted-foreground">{new Intl.DateTimeFormat(locale, { timeStyle: "short" }).format(date)} · {t(`visibility.${entry.visibility}`)}</span>
          </div>
          {metadata.quote ? <blockquote className="mt-2 whitespace-pre-wrap text-sm italic leading-relaxed text-muted-foreground">{metadata.quote}</blockquote> : null}
        </div>
        {handwritten ? (
          <Link aria-label={t("actions.viewEntry")} className="block rounded-xl bg-[#fffdf8] p-2 text-primary underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href={`/entries/${entry.id}`}>
            {entry.handwritingPreviewUrl ? <EntryImage alt={t("actions.viewEntry")} src={entry.handwritingPreviewUrl} sizes="(min-width: 768px) 45vw, 90vw" interactive={false} /> : <span className="inline-flex min-h-11 items-center">{t("actions.viewEntry")}</span>}
          </Link>
        ) : gratitudes.length ? (
          <div>
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-primary"><MaterialSymbol name="favorite" />{t("book.gratitudes", { count: gratitudes.length })}</h2>
            <ol className="space-y-2">
              {gratitudes.map((item, itemIndex) => (
                <li className="journal-gratitude" key={itemIndex}>
                  <span aria-hidden="true" className="journal-number">{number.format(itemIndex + 1)}</span>
                  <p className="min-w-0 whitespace-pre-wrap text-sm leading-relaxed">{item}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : <p className="whitespace-pre-wrap text-sm leading-relaxed">{entry.content}</p>}
        {metadata.imageUrl ? <EntryImage src={metadata.imageUrl} sizes="(min-width: 1024px) 480px, (min-width: 768px) 45vw, 90vw" /> : null}
        {metadata.reflection || (metadata.sticker && getSticker(metadata.sticker)) ? (
          <div className="journal-reflection">
            {metadata.sticker && getSticker(metadata.sticker) ? <StickerIcon className="h-12 w-12 shrink-0" id={metadata.sticker} /> : null}
            {metadata.reflection ? <p className="min-w-0 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{metadata.reflection}</p> : null}
          </div>
        ) : null}
      </div>
      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#ebdcca] pt-3 text-xs text-muted-foreground">
        {metadata.space ? <span className="flex min-w-0 items-start gap-1"><MaterialSymbol className="shrink-0 text-base text-primary" name="pin_drop" /><span className="min-w-0">{metadata.space}</span></span> : null}
        <div className="ml-auto flex shrink-0 items-center gap-1"><span className="font-semibold">{t("book.page", { number: page })}</span><EntryActionsClient entry={entry} /></div>
      </footer>
    </JournalBookPage>
  );
}
