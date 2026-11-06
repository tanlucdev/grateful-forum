"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import type { StickerId } from "@/lib/entries/stickers";
import { StickerPicker } from "../sticker-picker";
import { PaperTextarea } from "../journal-editor";

type Props = {
  washi: string | null; setWashi: (value: string | null) => void;
  quote: string; setQuote: (value: string) => void;
  sticker: StickerId | null; setSticker: (value: StickerId | null) => void;
  image: File | null; setImage: (value: File | null) => void;
  imageError: "book.invalidImage" | null;
};
const tools = [{ key: "image", icon: "photo_library" }, { key: "sticker", icon: "sentiment_satisfied" }, { key: "washi", icon: "texture" }, { key: "quote", icon: "format_quote" }] as const;
export function JournalDecoration(props: Readonly<Props>) {
  const t = useTranslations("write");
  const opener = useRef<HTMLButtonElement | null>(null);
  const [tool, setTool] = useState<(typeof tools)[number]["key"]>("image");
  return <Dialog><div aria-label={t("creative.title")} className="mb-5 flex flex-wrap gap-2">{tools.map(({ key, icon }) => <DialogTrigger asChild key={key}><button className="min-h-11 rounded-xl bg-card px-3 text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-ring" onClick={(event) => { opener.current = event.currentTarget; setTool(key); }} type="button"><MaterialSymbol className="mr-2" name={icon} />{t(`creative.${key}`)}</button></DialogTrigger>)}</div>
    <DialogContent onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus(); }} aria-describedby={undefined} overlayClassName="z-[100]" className="journal-controls z-[101] !bottom-0 !left-0 !top-auto max-h-[85dvh] !w-full !max-w-none !translate-x-0 !translate-y-0 overflow-y-auto rounded-b-none p-5 lg:!bottom-auto lg:!left-auto lg:!right-5 lg:!top-24 lg:!max-w-md lg:rounded-xl" showCloseButton={false}>
      <div className="flex items-center justify-between gap-3"><DialogTitle>{t(`creative.${tool}`)}</DialogTitle><DialogClose asChild><button className="min-h-11 rounded-xl bg-primary px-4 font-semibold text-white" type="button">{t("book.done")}</button></DialogClose></div>
      {tool === "sticker" ? <StickerPicker onSelect={props.setSticker} sticker={props.sticker} /> : null}
      {tool === "washi" ? <div className="grid grid-cols-3 gap-2">{(["none", "calm", "warm"] as const).map((value) => <button aria-pressed={(props.washi ?? "none") === value} className="min-h-20 rounded-xl bg-muted p-2 text-sm aria-pressed:ring-2 aria-pressed:ring-primary" key={value} onClick={() => props.setWashi(value === "none" ? null : value)} type="button"><span aria-hidden className={`mx-auto mb-2 block h-4 w-12 ${value === "calm" ? "bg-accent-mint" : value === "warm" ? "bg-[var(--fire-soft)]" : "border border-dashed border-muted-foreground"}`} />{t(`creative.${value}`)}</button>)}</div> : null}
      {tool === "quote" ? <div><label htmlFor="quote">{t("creative.quote")}</label><PaperTextarea id="quote" maxLength={240} onChange={(event) => props.setQuote(event.target.value)} placeholder={t("creative.quotePlaceholder")} value={props.quote} /><button className="min-h-11 rounded-lg px-3 text-destructive" onClick={() => props.setQuote("")} type="button">{t("book.removeQuote")}</button></div> : null}
      {tool === "image" ? <div><label className="flex min-h-28 cursor-pointer flex-col justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm has-[:focus-visible]:border-primary has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:outline-offset-[-2px]"><span className="break-all">{props.image?.name ?? t("creative.chooseImage")}</span><span>{t("book.imageHint")}</span><input accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) props.setImage(file); event.target.value = ""; }} type="file" /></label>{props.image ? <button className="min-h-11 rounded-lg px-3 text-destructive" onClick={() => props.setImage(null)} type="button">{t("creative.removeImage")}</button> : null}{props.imageError ? <p className="mt-2 text-sm text-destructive" role="alert">{t(props.imageError)}</p> : null}</div> : null}
    </DialogContent>
  </Dialog>;
}
