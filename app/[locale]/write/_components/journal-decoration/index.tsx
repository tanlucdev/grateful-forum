"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { washiIds, washiStyle } from "@/lib/entries/washi";
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
  const selected = { image: !!props.image, sticker: !!props.sticker, washi: !!props.washi, quote: !!props.quote.trim() };
  return <Dialog><div aria-label={t("creative.title")} data-tour="text-decoration" className="journal-decoration grid min-w-0 justify-items-center gap-4 border-y border-border py-5">
    <p className="text-sm font-semibold text-muted-foreground">{t("creative.toolsTitle")}</p>
    <div className="journal-decoration-tools grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-4">
      {tools.map(({ key, icon }) => <DialogTrigger asChild key={key}>
        <button className="journal-decoration-tool relative flex min-h-24 min-w-0 flex-col items-center justify-start gap-2 rounded-2xl px-2 py-3 text-primary" data-selected={selected[key]} onClick={(event) => { opener.current = event.currentTarget; setTool(key); }} type="button">
          <span className="journal-tool-icon flex size-10 items-center justify-center rounded-full bg-secondary"><MaterialSymbol className="text-xl" name={icon} /></span>
          <span className="journal-tool-label">{t(`creative.tools.${key}`)}</span>
          {selected[key] ? <><MaterialSymbol className="absolute right-2 top-2 text-sm" name="check_circle" /><span className="sr-only">{t("creative.added")}</span></> : null}
        </button>
      </DialogTrigger>)}
    </div>
  </div>
    <DialogContent onCloseAutoFocus={(event) => { event.preventDefault(); opener.current?.focus(); }} aria-describedby={undefined} overlayClassName="z-[100]" className="journal-controls journal-decoration-dialog z-[101] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden rounded-2xl p-4 sm:p-6 sm:max-w-lg" showCloseButton={false}>
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-border pb-3"><DialogTitle className="text-lg font-bold leading-snug">{t(`creative.${tool}`)}</DialogTitle><DialogClose asChild><button className="min-h-11 rounded-xl bg-primary px-4 font-semibold text-white" type="button">{t("book.done")}</button></DialogClose></div>
      <div className="min-h-0 min-w-0 overflow-y-auto overscroll-contain">
      {tool === "sticker" ? <StickerPicker onSelect={props.setSticker} sticker={props.sticker} /> : null}
      {tool === "washi" ? <div className="space-y-3"><p className="text-sm text-muted-foreground">{t("creative.washiDescription")}</p><div className="grid grid-cols-3 gap-2">{(["none", ...washiIds] as const).map((value) => <button aria-pressed={(props.washi ?? "none") === value} className="min-h-20 rounded-xl border border-transparent bg-muted p-2 text-xs aria-pressed:border-primary" key={value} onClick={() => props.setWashi(value === "none" ? null : value)} type="button"><span aria-hidden className="mx-auto mb-2 block h-5 w-12 rotate-3 rounded-sm border border-border" style={value === "none" ? undefined : washiStyle(value)} />{t(`creative.${value}`)}</button>)}</div></div> : null}
      {tool === "quote" ? <div><label htmlFor="quote">{t("creative.quote")}</label><PaperTextarea id="quote" maxLength={240} onChange={(event) => props.setQuote(event.target.value)} placeholder={t("creative.quotePlaceholder")} value={props.quote} /><button className="min-h-11 rounded-lg px-3 text-destructive" onClick={() => props.setQuote("")} type="button">{t("book.removeQuote")}</button></div> : null}
      {tool === "image" ? <div><label className="flex min-h-28 cursor-pointer flex-col justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary has-[:focus-visible]:outline-offset-[-2px]"><span className="break-all">{props.image?.name ?? t("creative.chooseImage")}</span><span>{t("book.imageHint")}</span><input accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) props.setImage(file); event.target.value = ""; }} type="file" /></label>{props.image ? <button className="min-h-11 rounded-lg px-3 text-destructive" onClick={() => props.setImage(null)} type="button">{t("creative.removeImage")}</button> : null}{props.imageError ? <p className="mt-2 text-sm text-destructive" role="alert">{t(props.imageError)}</p> : null}</div> : null}
      </div>
    </DialogContent>
  </Dialog>;
}
