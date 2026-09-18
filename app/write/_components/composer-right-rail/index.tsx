import Image from "next/image";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { getStickerLabel } from "@/lib/entries/stickers";
import type { EntryVisibility } from "@/lib/entries/types";
import {
  type WriteMood,
  type WriteQuote,
  type WriteSticker,
} from "../composer-data";
import { PrivacySettings } from "../composer-ui";
import { Panel, SectionTitle } from "../composer-primitives";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SideRail({
  clearImage,
  imageStatus,
  previewUrl,
  selectImage,
  setVisibility,
  visibility,
}: {
  clearImage: () => void;
  imageStatus: string;
  previewUrl: string | null;
  selectImage: (file: File) => void;
  setVisibility: (value: EntryVisibility) => void;
  visibility: EntryVisibility;
}) {
  const fileInput = (
    <input accept="image/avif,image/gif,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => {
      const file = event.target.files?.[0];
      if (file) selectImage(file);
      event.target.value = "";
    }} type="file" />
  );

  return (
    <div className="flex flex-col gap-4 lg:col-span-4">
      <Panel>
        <SectionTitle label="Ảnh kỷ niệm trong ngày" />
        <div className="relative mt-4 rounded-2xl bg-card p-4 pb-5 pt-6 shadow-sm">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm bg-accent/80 px-8 py-1 text-[10px] font-bold tracking-[0.2em] text-primary">BEGRATEFUL</div>
          {previewUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Ảnh kỷ niệm đã chọn" className="aspect-[4/3] w-full rounded-xl object-cover" src={previewUrl} />
              <p className="pt-4 text-center text-[18px] font-semibold leading-7 italic text-primary">“Ảnh kỷ niệm hôm nay”</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[13px] font-semibold">
                <label className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl bg-muted px-4 text-muted-foreground transition-colors hover:bg-input hover:text-primary">
                  <MaterialSymbol name="edit" />
                  <span>Đổi ảnh</span>
                  {fileInput}
                </label>
                <Button variant="destructive" onClick={clearImage} type="button">
                  <MaterialSymbol name="delete" />
                  <span>Xóa ảnh</span>
                </Button>
              </div>
            </>
          ) : (
            <label className="flex min-h-[210px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/60 px-5 text-center transition-colors hover:border-primary hover:bg-muted" onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files[0];
              if (file) selectImage(file);
            }}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-sm">
                <MaterialSymbol className="text-[26px]" name="add_photo_alternate" />
              </span>
              <span className="text-[15px] font-semibold leading-5 text-foreground">Chọn ảnh trước</span>
              <span className="text-[12px] font-medium leading-5 text-muted-foreground">Chọn ảnh để lồng vào trang nhật ký.</span>
              <span className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-4 text-[13px] font-semibold text-primary-foreground">
                <MaterialSymbol name="add_photo_alternate" />
                <span>Chọn ảnh</span>
              </span>
              {fileInput}
            </label>
          )}
          {imageStatus ? <p className="mt-2 text-center text-[12px] font-semibold text-primary">{imageStatus}</p> : null}
        </div>
      </Panel>
      <Panel className="bg-accent/40">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-card">
            <Image alt="Bé Mầm" className="h-9 w-9 object-contain" height={64} src="/stitch/landing/mascot.png" width={64} />
          </div>
          <div className="space-y-1">
            <span className="text-[12px] font-bold uppercase tracking-[0.18em] text-primary">Lời dặn chánh niệm của Bé Mầm</span>
            <p className="text-[16px] leading-6 text-foreground">“Hãy gửi một tin nhắn cảm ơn người bạn thương quý vì đã luôn hiện diện và thấu hiểu bạn trong những ngày qua nhé!”</p>
          </div>
        </div>
      </Panel>
      <Panel>
        <PrivacySettings setVisibility={setVisibility} visibility={visibility} />
      </Panel>
    </div>
  );
}

export function PreviewModal({
  close,
  gratitudes,
  imageUrl,
  mood,
  quote,
  reflection,
  sticker,
  submit,
  today,
}: {
  close: () => void;
  gratitudes: string[];
  imageUrl: string | null;
  mood: WriteMood;
  quote: WriteQuote;
  reflection: string;
  sticker: WriteSticker;
  submit: () => void;
  today: string;
}) {
  const stickerLabel = getStickerLabel(sticker, "vi") ?? sticker;

  return (
    <Dialog onOpenChange={(open) => { if (!open) close(); }} open>
      <DialogContent className="max-w-2xl rounded-3xl p-6 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent/50 text-primary"><MaterialSymbol fill name="auto_stories" /></div>
        <DialogHeader>
          <DialogTitle className="text-center text-[24px] leading-8 text-foreground">Xem trước Cuốn Sổ Ký Ức</DialogTitle>
        </DialogHeader>
        <p className="mx-auto mt-2 max-w-md text-[16px] leading-6 text-muted-foreground">Trang nhật ký {today} của bạn đã sẵn sàng được đóng vào cuốn sổ hành trình 365 ngày biết ơn.</p>
        <div className="mt-6 rounded-2xl bg-muted p-5 text-left">
          <div className="flex items-center justify-between gap-3 border-b border-input pb-2">
            <span className="text-[14px] font-semibold text-primary">{today}</span>
            <span className="text-[12px] font-medium text-muted-foreground">☕ {mood}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-card px-2.5 py-1 text-[11px] font-medium leading-4 text-muted-foreground">Sticker: {stickerLabel}</span>
            <span className="rounded-full bg-card px-2.5 py-1 text-[11px] font-medium leading-4 text-muted-foreground">Quote</span>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-[16px] leading-6 text-foreground italic">“{quote}”</p>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="Ảnh kỷ niệm đã chọn" className="mt-4 max-h-56 w-full rounded-xl object-cover" src={imageUrl} />
          ) : null}
          <p className="mt-4 whitespace-pre-wrap text-[16px] leading-6 text-foreground">{reflection}</p>
          {gratitudes.length ? <ul className="mt-4 space-y-1.5 text-[12px] font-medium text-muted-foreground">{gratitudes.map((item, index) => <li className="whitespace-pre-wrap" key={index}>{index + 1}. {item}</li>)}</ul> : null}
        </div>
        <Button className="mt-6" onClick={submit} type="button">
          <MaterialSymbol fill name="eco" />
          <span>Hoàn tất &amp; Lưu vào Cuốn Sổ</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
