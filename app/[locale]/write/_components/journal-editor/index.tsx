"use client";
import { useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import { useLocale, useTranslations } from "next-intl";
import { JournalBook, JournalMemories } from "@/components/entries/journal-book";
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
  return <textarea {...props} className="min-h-11 w-full min-w-0 scroll-mb-64 resize-none journal-field rounded-xl border border-transparent bg-transparent p-2 text-base leading-8 [overflow-wrap:anywhere] focus:border-primary" ref={ref} rows={1} />;
}

type Item = { id: number; text: string };
type Props = {
  date: string; gratitudes: Item[]; setGratitudes: (items: Item[]) => void;
  mood: string | null; setMood: (value: string | null) => void;
  space: string; setSpace: (value: string) => void; recentSpaces: string[];
  reflection: string; setReflection: (value: string) => void;
  washi: string | null; sticker: StickerId | null; quote: string; imageUrl: string | null;
};
export function JournalEditor(props: Readonly<Props>) {
  const t = useTranslations("write");
  const locale = useLocale();
  const [moodOpen, setMoodOpen] = useState(false);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  function removeItem(item: Item, index: number) {
    const next = props.gratitudes[index + 1] ?? props.gratitudes[index - 1];
    props.setGratitudes(props.gratitudes.filter((current) => current.id !== item.id));
    requestAnimationFrame(() => document.getElementById(`gratitude-${next.id}`)?.focus({ preventScroll: true }));
  }
  return <JournalBook date={props.date} washi={props.washi} left={<div className="space-y-4">
    <div className="journal-mood space-y-3">
      <div className="grid min-w-0 gap-3">
        <button aria-expanded={moodOpen} className="min-h-11 justify-self-start rounded-full bg-card px-3 text-sm font-bold text-primary shadow-sm" onClick={() => setMoodOpen(!moodOpen)} type="button">{props.mood ? t(`moods.${props.mood as "calm" | "light" | "hopeful" | "reflective"}`) : t("book.addMood")}</button>
        {moodOpen ? <div className="flex flex-wrap gap-2">{(["calm", "light", "hopeful", "reflective"] as const).map((mood) => <button aria-pressed={props.mood === mood} className={`min-h-11 rounded-full px-3 text-sm ${props.mood === mood ? "bg-primary text-white" : "bg-accent"}`} key={mood} onClick={() => props.setMood(props.mood === mood ? null : mood)} type="button">{t(`moods.${mood}`)}</button>)}</div> : null}
      </div>
      {props.quote ? <blockquote className="whitespace-pre-wrap text-sm italic leading-relaxed text-muted-foreground">{props.quote}</blockquote> : null}
    </div>
    <h2 className="flex items-center gap-2 text-sm font-bold text-primary"><MaterialSymbol name="favorite" />{t("gratitudes.title")}</h2>
    {props.gratitudes.map((item, index) => <div className="journal-gratitude gap-1 sm:gap-2.5" key={item.id}>
      <label className="sr-only" htmlFor={`gratitude-${item.id}`}>{t("gratitudes.field", { number: index + 1 })}</label>
      <span aria-hidden className="journal-number mt-2">{new Intl.NumberFormat(locale).format(index + 1)}</span>
      <PaperTextarea autoFocus={index === 0} data-tour={index === 0 ? "gratitude-input" : undefined} id={`gratitude-${item.id}`} maxLength={1000} onChange={(event) => props.setGratitudes(props.gratitudes.map((current) => current.id === item.id ? { ...current, text: event.target.value } : current))} placeholder={t("gratitudes.placeholder", { number: index + 1 })} value={item.text} />
      {props.gratitudes.length > 1 ? <button aria-label={t("gratitudes.remove", { number: index + 1 })} className="min-h-11 min-w-11 rounded-xl text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring" onClick={() => removeItem(item, index)} type="button"><MaterialSymbol name="close" /></button> : null}
    </div>)}
    <button className="min-h-11 rounded-xl px-3 text-sm font-semibold text-primary disabled:opacity-50" disabled={props.gratitudes.length >= 10} onClick={() => props.setGratitudes([...props.gratitudes, { id: Math.max(...props.gratitudes.map((item) => item.id)) + 1, text: "" }])} type="button">+ {t("gratitudes.add")}</button>
    <div className="grid min-w-0 gap-3 border-t border-[#ebdcca] pt-3"><button aria-expanded={spaceOpen} className="min-h-11 justify-self-start rounded-xl px-3 text-sm font-semibold text-primary" onClick={() => setSpaceOpen(!spaceOpen)} type="button"><MaterialSymbol className="mr-1 text-base" name="pin_drop" />{t("space.label")}</button>
      {spaceOpen ? <><label className="sr-only" htmlFor="space">{t("space.label")}</label><input autoFocus className="min-h-11 w-full journal-field min-w-0 rounded-xl border border-input bg-transparent px-3 focus:border-primary" id="space" list="recent-spaces" maxLength={160} onChange={(event) => props.setSpace(event.target.value)} placeholder={t("space.placeholder")} value={props.space} /><datalist id="recent-spaces">{props.recentSpaces.map((space) => <option key={space} value={space} />)}</datalist></> : props.space ? <p className="whitespace-pre-wrap text-sm [overflow-wrap:anywhere]">{props.space}</p> : null}
    </div>
  </div>} right={<>
    <JournalMemories imageUrl={props.imageUrl} reflection={null} sticker={null} />
    <div className="journal-reflection mt-4">
      {props.sticker ? <StickerIcon className="h-12 w-12 shrink-0" id={props.sticker} /> : null}
      <div className="grid min-w-0 flex-1 gap-3">
        <button aria-expanded={reflectionOpen} className="min-h-11 justify-self-start rounded-xl px-3 text-sm font-semibold text-primary" onClick={() => setReflectionOpen(!reflectionOpen)} type="button">{t("reflection.title")}</button>
        {reflectionOpen ? <><label className="sr-only" htmlFor="reflection">{t("reflection.title")}</label><PaperTextarea autoFocus id="reflection" maxLength={5000} onChange={(event) => props.setReflection(event.target.value)} placeholder={t("reflection.placeholder")} value={props.reflection} /></> : props.reflection ? <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{props.reflection}</p> : null}
      </div>
    </div>
  </>} />;
}
