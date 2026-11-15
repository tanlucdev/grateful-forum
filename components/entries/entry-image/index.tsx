"use client";
/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Paperclip, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { canOptimizeImage, nextImageLoadState, type ImageLoadState } from "@/lib/entry-media/image-sources";

type Props = Readonly<{
  src: string;
  alt?: string;
  sizes: string;
  thumbnail?: boolean;
  interactive?: boolean;
}>;

export function EntryImage(props: Props) {
  return <EntryImageContent key={props.src} {...props} />;
}

function EntryImageContent({ src, alt, sizes, thumbnail = false, interactive = true }: Props) {
  const t = useTranslations("write.media");
  const [open, setOpen] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const ratio = dimensions ? dimensions.width / dimensions.height : 4 / 3;
  const photoStyle = thumbnail ? undefined : {
    width: `min(100%, 22.5rem, ${dimensions?.width ?? 360}px, calc(min(40svh, 17.5rem) * ${ratio}))`,
    aspectRatio: ratio,
  };
  const label = alt ?? t("alt");
  const frame = <span className="relative block w-full overflow-hidden rounded-lg bg-muted" style={interactive ? { aspectRatio: thumbnail ? "4 / 3" : ratio } : photoStyle ?? { aspectRatio: "4 / 3" }}>
    <ImageContent src={src} alt={label} sizes={thumbnail ? sizes : "(min-width: 400px) 360px, 90vw"} cover={thumbnail} onDimensions={thumbnail ? undefined : setDimensions} />
  </span>;
  if (!interactive) return frame;
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><button aria-label={t("open")} className="relative block min-h-11 w-full min-w-11 max-w-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" style={photoStyle} type="button">{frame}{!thumbnail ? <Paperclip aria-hidden="true" className="pointer-events-none absolute -top-3 left-3 z-10 size-8 -rotate-35 text-[#a08c70] drop-shadow-sm" strokeWidth={1.5} /> : null}</button></DialogTrigger>
    <DialogContent aria-describedby={undefined} className="w-[calc(100%-2rem)] max-w-5xl gap-3 sm:max-w-5xl motion-reduce:animate-none" showCloseButton={false}>
      <div className="flex min-w-0 items-center justify-between gap-3">
        <DialogTitle className="min-w-0">{t("title")}</DialogTitle>
        <DialogClose aria-label={t("close")} className="flex size-11 shrink-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-primary"><X aria-hidden="true" className="size-5" /></DialogClose>
      </div>
      {open ? <div className="relative h-[min(75svh,48rem)] min-w-0 overflow-hidden rounded-lg bg-muted"><ImageContent original src={src} alt={label} sizes="100vw" /></div> : null}
    </DialogContent>
  </Dialog>;
}

function ImageContent({ src, alt, sizes, cover = false, original = false, onDimensions }: Readonly<{ src: string; alt: string; sizes: string; cover?: boolean; original?: boolean; onDimensions?: (dimensions: { width: number; height: number }) => void }>) {
  const t = useTranslations("write.media");
  const [state, setState] = useState<ImageLoadState>(original || !canOptimizeImage(src) ? "original" : "optimized");
  const className = `absolute inset-0 h-full w-full ${cover ? "object-cover" : "object-contain"}`;
  if (state === "failed") return <span className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-muted-foreground" role="status">{t("error")}</span>;
  const onError = () => setState(nextImageLoadState);
  const onLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height } = event.currentTarget;
    if (width && height) onDimensions?.({ width, height });
  };
  return state === "optimized"
    ? <Image alt={alt} className={className} fill onError={onError} onLoad={onLoad} quality={75} sizes={sizes} src={src} />
    : <img alt={alt} className={className} loading={original ? "eager" : "lazy"} onError={onError} onLoad={onLoad} src={src} />;
}
