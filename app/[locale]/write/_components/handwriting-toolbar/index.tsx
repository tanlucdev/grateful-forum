"use client";

import { useId } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Eraser, Hand, Highlighter, Pencil, Redo2, Trash2, Undo2, type LucideIcon } from "lucide-react";
import { Slider } from "radix-ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { InkTool } from "@/lib/entries/types";
import { InkColorPicker } from "../ink-color-picker";

const strokeSizes = [{ width: 3, label: "thin" }, { width: 5, label: "medium" }, { width: 9, label: "bold" }] as const;

export type HandwritingTool = InkTool | "eraser" | "pan";
type Props = {
  tool: HandwritingTool; onToolChange: (tool: HandwritingTool) => void;
  color: string; onColorChange: (color: string) => void;
  width: number; onWidthChange: (width: number) => void;
  opacity: number; onOpacityChange: (opacity: number) => void;
  zoom: number; onZoomChange: (zoom: number) => void;
  canUndo: boolean; canRedo: boolean; canClear: boolean;
  onUndo: () => void; onRedo: () => void; onClear: () => void;
};

export function HandwritingToolbar(props: Props) {
  const t = useTranslations("write.handwriting");
  const format = useFormatter();
  const sizeId = useId();
  const isDrawing = props.tool === "pen" || props.tool === "highlighter";
  const sizePreset = strokeSizes.find(({ width }) => width === props.width);
  return <div className="space-y-3 rounded-2xl bg-muted/70 p-3" role="group" aria-label={t("toolLabel")}>
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex flex-wrap gap-1" role="group" aria-label={t("toolLabel")}>
        {([{ tool: "pen", icon: Pencil }, { tool: "highlighter", icon: Highlighter }, { tool: "eraser", icon: Eraser }, { tool: "pan", icon: Hand }] as const).map(({ tool, icon }) => <Tool active={props.tool === tool} icon={icon} key={tool} label={t(tool)} onClick={() => props.onToolChange(tool)} showLabel />)}
      </div>
      <div className="flex gap-1" role="group" aria-label={t("history")}>
        <Tool disabled={!props.canUndo} icon={Undo2} label={t("undo")} onClick={props.onUndo} />
        <Tool disabled={!props.canRedo} icon={Redo2} label={t("redo")} onClick={props.onRedo} />
        <Tool danger disabled={!props.canClear} icon={Trash2} label={t("clear")} onClick={props.onClear} />
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3">
      <InkColorPicker color={props.color} onChange={props.onColorChange} />
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground" id={sizeId}>{t("size")}</span>
        <Select disabled={!isDrawing} onValueChange={(value) => props.onWidthChange(Number(value))} value={String(props.width)}>
          <SelectTrigger aria-labelledby={sizeId} className="min-h-11 min-w-24 gap-3 rounded-xl border-0 bg-card pr-4 pl-4 text-xs font-semibold"><SelectValue>{sizePreset ? t(sizePreset.label) : format.number(props.width)}</SelectValue></SelectTrigger>
          <SelectContent className="p-1" position="popper">{strokeSizes.map(({ width, label }) => <SelectItem className="min-h-11 rounded-lg pr-10 pl-3 [&>span:first-child]:right-3" key={width} value={String(width)}>{t(label)}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid min-w-0 flex-1 basis-96 grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="col-span-2 sm:col-span-1"><InkSlider disabled={!isDrawing} label={t("size")} max={80} min={1} onChange={props.onWidthChange} value={props.width} valueText={format.number(props.width)} /></div>
        <InkSlider disabled={!isDrawing} label={t("opacity")} max={100} min={10} onChange={(value) => props.onOpacityChange(value / 100)} step={5} value={Math.round(props.opacity * 100)} valueText={format.number(props.opacity, { style: "percent" })} />
        <InkSlider label={t("zoom")} max={200} min={50} onChange={props.onZoomChange} step={10} value={props.zoom} valueText={format.number(props.zoom / 100, { style: "percent" })} />
      </div>
    </div>
  </div>;
}

function Tool({ active, danger, disabled, icon: Icon, label, onClick, showLabel }: Readonly<{ active?: boolean; danger?: boolean; disabled?: boolean; icon: LucideIcon; label: string; onClick: () => void; showLabel?: boolean }>) {
  return <button aria-label={label} aria-pressed={active} className={`flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-3 text-xs font-semibold transition-colors outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-35 ${active ? "bg-primary text-primary-foreground" : danger ? "text-destructive enabled:hover:bg-destructive/10" : "text-foreground enabled:hover:bg-card"}`} disabled={disabled} onClick={onClick} title={label} type="button"><Icon aria-hidden="true" className="size-[18px] shrink-0" />{showLabel ? label : null}</button>;
}

export function InkSlider({ disabled, label, max, min = 0, onChange, step = 1, value, valueText, className = "" }: Readonly<{ disabled?: boolean; label: string; max: number; min?: number; onChange: (value: number) => void; step?: number; value: number; valueText: string; className?: string }>) {
  const id = useId();
  return <div className="min-w-0">
    <div className="flex items-center justify-between gap-2 text-xs"><span className="font-semibold text-muted-foreground" id={id}>{label}</span><output className="tabular-nums text-muted-foreground">{valueText}</output></div>
    <Slider.Root aria-labelledby={id} className={`relative flex h-8 w-full touch-none items-center select-none data-disabled:opacity-35 ${className}`} disabled={disabled} max={max} min={min} onValueChange={([next]) => onChange(next)} step={step} value={[value]}>
      <Slider.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-primary/15"><Slider.Range className="absolute h-full rounded-full bg-primary" /></Slider.Track>
      <Slider.Thumb aria-label={label} aria-valuetext={valueText} className="block size-4 rounded-full border-2 border-primary bg-card shadow-sm outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring before:absolute before:-inset-3 before:content-['']" />
    </Slider.Root>
  </div>;
}
