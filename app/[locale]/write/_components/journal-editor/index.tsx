"use client";
import { useLayoutEffect, useRef, useState, type ReactNode, type ComponentProps } from "react";
import { useLocale, useTranslations } from "next-intl";
import { JournalBook } from "@/components/entries/journal-book";
/* eslint-disable @next/next/no-img-element */
import { StickerIcon } from "@/components/entries/sticker-icons";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { StickerId } from "@/lib/entries/stickers";

export function PaperTextarea(props: ComponentProps<"textarea">) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const resize = () => { node.style.height = "auto"; node.style.height = `${node.scrollHeight + 2}px`; };
    resize();
    let width = node.getBoundingClientRect().width;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width !== width) { width = entry.contentRect.width; resize(); }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [props.value]);
  return <textarea {...props} className="min-h-11 w-full min-w-0 scroll-mb-64 resize-none journal-field rounded-xl border border-transparent bg-transparent p-2 text-base leading-8 [overflow-wrap:anywhere] focus:border-primary" ref={ref} rows={props.rows ?? 1} />;
}

type Item = { id: number; text: string };
type Props = {
  decoration: ReactNode; date: string; gratitudes: Item[]; setGratitudes: (items: Item[]) => void;
  mood: string | null; setMood: (value: string | null) => void;
  space: string; setSpace: (value: string) => void; recentSpaces: string[];
  reflection: string; setReflection: (value: string) => void;
  washi: string | null; sticker: StickerId | null; quote: string; imageUrl: string | null;
};
export function JournalEditor(props: Readonly<Props>) {
  const t = useTranslations("write");
  const locale = useLocale();
  const [extrasOpen, setExtrasOpen] = useState(false);
  function removeItem(item: Item, index: number) {
    const next = props.gratitudes[index + 1] ?? props.gratitudes[index - 1];
    props.setGratitudes(props.gratitudes.filter((current) => current.id !== item.id));
    requestAnimationFrame(() => document.getElementById(`gratitude-${next.id}`)?.focus({ preventScroll: true }));
  }
  return <div className="journal-paper"><JournalBook date={props.date} washi={props.washi} left={<div className="journal-editor grid min-w-0 gap-6"><div className="min-w-0 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="flex items-center gap-2 text-base font-bold text-primary"><MaterialSymbol name="favorite" />{t("gratitudes.title")}</h2><span className="text-xs font-semibold tabular-nums text-muted-foreground">{t("gratitudes.progress", { count: props.gratitudes.filter((item) => item.text.trim()).length, total: props.gratitudes.length })}</span></div>
    {props.gratitudes.map((item, index) => <div className="journal-gratitude gap-1 sm:gap-2.5" key={item.id}>
      <label className="sr-only" htmlFor={`gratitude-${item.id}`}>{t("gratitudes.field", { number: index + 1 })}</label>
      <span aria-hidden className="journal-number mt-2">{new Intl.NumberFormat(locale).format(index + 1)}</span>
      <PaperTextarea data-tour={index === 0 ? "gratitude-input" : undefined} id={`gratitude-${item.id}`} maxLength={1000} onChange={(event) => props.setGratitudes(props.gratitudes.map((current) => current.id === item.id ? { ...current, text: event.target.value } : current))} placeholder={t("gratitudes.field", { number: index + 1 })} value={item.text} />
      {props.gratitudes.length > 1 ? <button aria-label={t("gratitudes.remove", { number: index + 1 })} className="min-h-11 min-w-11 shrink-0 rounded-xl text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring" onClick={() => removeItem(item, index)} type="button"><MaterialSymbol name="close" /></button> : null}
    </div>)}
    <button className="journal-add inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-primary disabled:opacity-50" disabled={props.gratitudes.length >= 10} onClick={() => {
      const id = Math.max(...props.gratitudes.map((item) => item.id)) + 1;
      props.setGratitudes([...props.gratitudes, { id, text: "" }]);
      requestAnimationFrame(() => document.getElementById(`gratitude-${id}`)?.focus());
    }} type="button"><MaterialSymbol name="add_circle" />{t("gratitudes.add")}</button>
    </div>
    <div className="min-w-0 space-y-3 border-t border-border pt-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><label className="text-base font-bold text-primary" htmlFor="reflection">{t("reflection.title")}</label><span className="text-xs text-muted-foreground">{t("reflection.optional")}</span></div>
      <PaperTextarea id="reflection" rows={4} maxLength={5000} onChange={(event) => props.setReflection(event.target.value)} placeholder={t("reflection.placeholder")} value={props.reflection} />
    </div>
    <div className="journal-keepsakes min-w-0 space-y-4">
    {props.quote ? <blockquote className="whitespace-pre-wrap text-sm italic leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{props.quote}</blockquote> : null}
    {props.imageUrl ? <div className="journal-photo"><img alt={t("creative.image")} className="h-auto w-full rounded-lg" src={props.imageUrl} /></div> : null}
    {props.sticker ? <StickerIcon className="h-12 w-12" id={props.sticker} /> : null}
    {props.decoration}
    </div>
    <div className="grid min-w-0 gap-3" data-tour="text-extras">
      <button aria-expanded={extrasOpen} aria-controls="journal-extras" className="flex min-h-11 min-w-0 items-center gap-2 rounded-xl px-2 text-left text-sm font-semibold text-primary" onClick={() => setExtrasOpen(!extrasOpen)} type="button"><MaterialSymbol className="text-lg" name={extrasOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"} />{t("extras.title")}</button>
      {!extrasOpen && (props.mood || props.space) ? <p className="line-clamp-2 text-sm text-muted-foreground [overflow-wrap:anywhere]">{[props.mood ? t(`moods.${props.mood as "calm" | "light" | "hopeful" | "reflective"}`) : null, props.space].filter(Boolean).join(" · ")}</p> : null}
      {extrasOpen ? <div className="grid min-w-0 gap-4" id="journal-extras">
        <div className="min-w-0 space-y-3"><div className="flex flex-wrap gap-1" role="group" aria-label={t("book.addMood")}>
          {(["calm", "light", "hopeful", "reflective"] as const).map((mood) => <button aria-pressed={props.mood === mood} className={`min-h-11 rounded-full border border-transparent px-3 text-sm ${props.mood === mood ? "bg-accent font-bold text-primary" : "text-muted-foreground"}`} key={mood} onClick={() => props.setMood(props.mood === mood ? null : mood)} type="button">{t(`moods.${mood}`)}</button>)}
        </div><label className="block text-sm font-semibold" htmlFor="space">{t("space.label")}</label><input className="journal-field min-h-11 w-full min-w-0 rounded-xl border border-input bg-transparent px-3 text-base" id="space" list="recent-spaces" maxLength={160} onChange={(event) => props.setSpace(event.target.value)} placeholder={t("space.placeholder")} value={props.space} /><datalist id="recent-spaces">{props.recentSpaces.map((space) => <option key={space} value={space} />)}</datalist></div>
      </div> : null}
    </div>

  </div>} /></div>;
}
