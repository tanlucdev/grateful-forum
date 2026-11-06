"use client";

import { useId, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Check, Palette, X } from "lucide-react";
import { Popover, Slider } from "radix-ui";
import { INK_COLORS } from "@/lib/entries/ink";
import { hexToHsv, hsvToHex } from "./ink-color";

export function InkColorPicker({ color, onChange }: Readonly<{ color: string; onChange: (color: string) => void }>) {
  const t = useTranslations("write.handwriting");
  const format = useFormatter();
  const id = useId();
  const [hsv, setHsv] = useState(() => hexToHsv(color));
  const [hex, setHex] = useState(color);
  const validHex = /^#[0-9a-f]{6}$/i.test(hex);
  const percent = (value: number) => format.number(value, { style: "percent", maximumFractionDigits: 0 });

  function update(next: typeof hsv) {
    setHsv(next);
    const nextHex = hsvToHex(next.hue, next.saturation, next.value);
    setHex(nextHex);
    onChange(nextHex);
  }

  function pick(next: string) {
    setHsv(hexToHsv(next));
    setHex(next);
    onChange(next);
  }

  function selectPoint(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    update({ ...hsv, saturation: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), value: Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height)) });
  }

  return <Popover.Root onOpenChange={(open) => { if (open) { setHsv(hexToHsv(color)); setHex(color); } }}>
    <Popover.Trigger aria-label={t("chooseColor")} className="flex min-h-11 items-center gap-2 rounded-xl bg-card px-3 text-xs font-semibold outline-offset-2 hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring">
      <span aria-hidden="true" className="size-5 rounded-full border border-foreground/20" style={{ backgroundColor: color }} /><span>{t("inkColor")}</span><Palette aria-hidden="true" className="size-4 text-muted-foreground" />
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content aria-label={t("chooseColor")} align="start" className="journal-controls z-50 w-72 max-w-[calc(100vw-2rem)] space-y-3 rounded-2xl bg-popover p-4 text-popover-foreground shadow-lg ring-1 ring-border" collisionPadding={16} sideOffset={8}>
        <div className="flex items-center justify-between"><p className="text-sm font-bold">{t("chooseColor")}</p><Popover.Close aria-label={t("closeColorPicker")} className="-my-2 -mr-2 flex size-11 items-center justify-center rounded-xl hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"><X aria-hidden="true" className="size-4" /></Popover.Close></div>
        <div
          aria-describedby={`${id}-help`}
          aria-label={t("spectrum")}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(hsv.saturation * 100)}
          aria-valuetext={t("spectrumValue", { saturation: percent(hsv.saturation), brightness: percent(hsv.value) })}
          className="relative h-40 touch-none cursor-crosshair rounded-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const step = event.shiftKey ? 0.1 : 0.01;
            update({ ...hsv, saturation: event.key === "Home" ? 0 : event.key === "End" ? 1 : Math.max(0, Math.min(1, hsv.saturation + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0))), value: Math.max(0, Math.min(1, hsv.value + (event.key === "ArrowUp" ? step : event.key === "ArrowDown" ? -step : 0))) });
          }}
          onPointerDown={(event) => { if (event.button !== 0) return; event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); selectPoint(event); }}
          onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) selectPoint(event); }}
          onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
          role="slider"
          style={{ background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hsv.hue} 100% 50%)` }}
          tabIndex={0}
        ><span aria-hidden="true" className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white ring-1 ring-black/60" style={{ left: `${hsv.saturation * 100}%`, top: `${(1 - hsv.value) * 100}%`, backgroundColor: color }} /></div>
        <Slider.Root aria-label={t("hue")} className="relative flex h-11 touch-none items-center" max={359} min={0} onValueChange={([hue]) => update({ ...hsv, hue })} step={1} value={[hsv.hue]}>
          <Slider.Track className="relative h-3 grow rounded-full" style={{ background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)" }} />
          <Slider.Thumb aria-label={t("hue")} aria-valuetext={format.number(hsv.hue, { maximumFractionDigits: 0, style: "unit", unit: "degree" })} className="block size-5 rounded-full border-2 border-white shadow-sm focus-visible:border-primary focus-visible:outline-none focus-visible:shadow-none before:absolute before:-inset-3 before:content-['']" style={{ backgroundColor: `hsl(${hsv.hue} 100% 50%)` }} />
        </Slider.Root>
        <div className="flex gap-1" role="group" aria-label={t("presets")}>{INK_COLORS.map((preset) => <button aria-label={t("color", { color: preset })} aria-pressed={color.toUpperCase() === preset} className="flex size-11 items-center justify-center rounded-xl hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring" key={preset} onClick={() => pick(preset)} type="button"><span className="flex size-7 items-center justify-center rounded-full" style={{ backgroundColor: preset }}>{color.toUpperCase() === preset ? <Check aria-hidden="true" className="size-4 text-white" /> : null}</span></button>)}</div>
        <label className="flex items-center gap-3 text-xs font-semibold" htmlFor={`${id}-hex`}>{t("hex")}<input aria-describedby={`${id}-hex-help`} aria-invalid={!validHex} autoComplete="off" className="journal-field min-h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 uppercase aria-invalid:border-destructive" id={`${id}-hex`} maxLength={7} onChange={(event) => { const next = event.target.value.toUpperCase(); setHex(next); if (/^#[0-9a-f]{6}$/i.test(next)) pick(next); }} spellCheck={false} value={hex} /></label>
        <p className={`text-xs ${validHex ? "text-muted-foreground" : "text-destructive"}`} id={`${id}-hex-help`}>{t("hexHelp")}</p>
        <p className="sr-only" id={`${id}-help`}>{t("spectrumHelp")}</p>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>;
}
