"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { INK_COLORS, INK_SIZE } from "@/lib/entries/ink";
import { INK_PAPER_COLOR, renderInkDocument } from "@/lib/entries/ink-renderer";
import type { InkDocument, InkPaperStyle, InkPoint, InkStamp, InkStroke } from "@/lib/entries/types";

export type HandwritingComposerHandle = { exportPreview: () => Promise<File> };

type Props = { document: InkDocument; onChange: (document: InkDocument) => void };

export const HandwritingComposer = forwardRef<HandwritingComposerHandle, Props>(function HandwritingComposer({ document, onChange }, ref) {
  const t = useTranslations("write");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef<{ pointerId: number; stroke: InkStroke } | null>(null);
  const [color, setColor] = useState<(typeof INK_COLORS)[number]>(INK_COLORS[0]);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [redo, setRedo] = useState<InkStroke[][]>([]);
  const orientation = typeof window !== "undefined" && window.innerWidth > window.innerHeight ? "landscape" : "portrait";

  useEffect(() => {
      if (document.orientation !== orientation && document.strokes.length === 0) onChange({ ...document, orientation });
  }, [document, onChange, orientation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      const context = canvas.getContext("2d");
      if (context) renderInkDocument(context, document, canvas.width, canvas.height, ratio);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => observer.disconnect();
  }, [document]);

  useImperativeHandle(ref, () => ({
    exportPreview: () => exportCanvas(canvasRef.current, document),
  }), [document]);

  function point(event: React.PointerEvent<HTMLCanvasElement>): InkPoint {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.round(((event.clientX - rect.left) / rect.width) * INK_SIZE),
      y: Math.round(((event.clientY - rect.top) / rect.height) * INK_SIZE),
      pressure: Math.round((event.pressure || 0.5) * 100) / 100,
    };
  }

  function commit(strokes: InkStroke[]) {
    setRedo([]);
    onChange({ ...document, strokes });
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    if (drawingRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const current = point(event);
    if (tool === "eraser") {
      const next = document.strokes.filter((stroke) => !strokeNearPoint(stroke, current));
      if (next.length !== document.strokes.length) commit(next);
      return;
    }
    drawingRef.current = { pointerId: event.pointerId, stroke: { color, points: [current] } };
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    const active = drawingRef.current;
    if (!active || active.pointerId !== event.pointerId) return;
    active.stroke.points.push(point(event));
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) renderInkDocument(context, { ...document, strokes: [...document.strokes, active.stroke] }, canvas.width, canvas.height, window.devicePixelRatio || 1);
  }

  function finish(event: React.PointerEvent<HTMLCanvasElement>) {
    const active = drawingRef.current;
    if (!active || active.pointerId !== event.pointerId) return;
    drawingRef.current = null;
    commit([...document.strokes, active.stroke]);
  }

  function undo() {
    if (!document.strokes.length) return;
    setRedo((current) => [...current, document.strokes.slice(-1)]);
    onChange({ ...document, strokes: document.strokes.slice(0, -1) });
  }

  function redoStroke() {
    const stroke = redo.at(-1);
    if (!stroke) return;
    setRedo((current) => current.slice(0, -1));
    onChange({ ...document, strokes: [...document.strokes, ...stroke] });
  }

  function clear() {
    if (document.strokes.length && window.confirm(t("handwriting.clearConfirm"))) {
      setRedo([]);
      onChange({ ...document, strokes: [] });
    }
  }

  function setPaperStyle(paperStyle: InkPaperStyle) {
    onChange({ ...document, paperStyle });
  }

  function setStamp(stamp: InkStamp) {
    onChange({ ...document, stamp });
  }

  return (
    <section className="space-y-3" aria-label={t("handwriting.canvasLabel")}>
      <div className="space-y-3 rounded-2xl bg-muted/70 p-3">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2" role="group" aria-label={t("handwriting.toolLabel")}>
            <Tool active={tool === "pen"} icon="edit" label={t("handwriting.pen")} onClick={() => setTool("pen")} />
            <Tool active={tool === "eraser"} icon="ink_eraser" label={t("handwriting.eraser")} onClick={() => setTool("eraser")} />
            <Tool disabled={!document.strokes.length} icon="undo" label={t("handwriting.undo")} onClick={undo} />
            <Tool disabled={!redo.length} icon="redo" label={t("handwriting.redo")} onClick={redoStroke} />
          </div>
          <div className="flex items-center gap-2" role="group" aria-label={t("handwriting.colorLabel")}>
            {INK_COLORS.map((item) => <button aria-label={t("handwriting.color", { color: item })} aria-pressed={color === item} className={`h-11 w-11 rounded-full border-4 ${color === item ? "border-foreground" : "border-card"}`} key={item} onClick={() => { setColor(item); setTool("pen"); }} style={{ backgroundColor: item }} type="button" />)}
            <Tool danger disabled={!document.strokes.length} icon="delete" label={t("handwriting.clear")} onClick={clear} />
          </div>
        </div>
        <fieldset className="min-w-0">
          <legend className="mb-1.5 text-xs font-semibold text-foreground">{t("handwriting.paperStyleLabel")}</legend>
          <div className="inline-flex max-w-full items-stretch gap-1 rounded-xl bg-card/70 p-1">
            {(["blank", "ruled", "dot", "grid"] as const).map((paperStyle) => <label className={`flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-3 text-xs font-semibold transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-primary ${document.paperStyle === paperStyle ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`} key={paperStyle}><input checked={document.paperStyle === paperStyle} className="sr-only" name="ink-paper-style" onChange={() => setPaperStyle(paperStyle)} type="radio" value={paperStyle} />{t(`handwriting.${paperStyle}`)}</label>)}
          </div>
        </fieldset>
        <fieldset className="min-w-0">
          <legend className="mb-1.5 text-xs font-semibold text-foreground">{t("handwriting.stampLabel")}</legend>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["none", "sprout", "heart", "star", "sun", "moon", "flower"] as const).map((stamp) => <label className={`flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-xl px-3 text-xs font-semibold transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-primary ${document.stamp === stamp ? "bg-card text-primary shadow-sm" : "bg-card/70 text-muted-foreground hover:text-foreground"}`} key={stamp}><input checked={document.stamp === stamp} className="sr-only" name="ink-stamp" onChange={() => setStamp(stamp)} type="radio" value={stamp} />{t(`handwriting.stamp.${stamp}`)}</label>)}
          </div>
        </fieldset>
      </div>
      <div className={`relative overflow-hidden rounded-2xl shadow-inner ${document.orientation === "landscape" ? "aspect-[16/10]" : "aspect-[3/4]"}`} style={{ backgroundColor: INK_PAPER_COLOR }}>
        <canvas
          aria-describedby="handwriting-help"
          aria-label={t("handwriting.canvasLabel")}
          className="absolute inset-0 h-full w-full touch-none cursor-crosshair"
          onPointerCancel={finish}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={finish}
          ref={canvasRef}
        />
        {!document.strokes.length ? <p className="pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2 text-center text-sm text-muted-foreground">{t("handwriting.empty")}</p> : null}
      </div>
      <p className="text-xs leading-5 text-muted-foreground" id="handwriting-help">{t("handwriting.help")} {t("handwriting.paperStyleHelp")}</p>
    </section>
  );
});

function Tool({ active = false, danger = false, disabled = false, icon, label, onClick }: { active?: boolean; danger?: boolean; disabled?: boolean; icon: string; label: string; onClick: () => void }) {
  return <Button aria-label={label} className={`${active ? "text-primary-foreground before:bg-primary hover:before:bg-[var(--primary-hover)]" : danger ? "text-destructive hover:before:bg-destructive/10" : "hover:before:bg-muted"} relative h-11 w-11 bg-transparent hover:bg-transparent before:absolute before:inset-0.5 before:rounded-[10px] before:transition-colors`} disabled={disabled} onClick={onClick} size="icon-sm" title={label} type="button" variant={active ? "default" : "ghost"}><MaterialSymbol className="relative" name={icon} /></Button>;
}

function strokeNearPoint(stroke: InkStroke, point: InkPoint) {
  return stroke.points.some((item) => Math.hypot(item.x - point.x, item.y - point.y) < 250);
}

function exportCanvas(canvas: HTMLCanvasElement | null, inkDocument: InkDocument) {
  return new Promise<File>((resolve, reject) => {
    if (!canvas) return reject(new Error("preview-unavailable"));
    const maxEdge = 1_600;
    const scale = Math.min(1, maxEdge / Math.max(canvas.width, canvas.height));
    const preview = document.createElement("canvas");
    preview.width = Math.round(canvas.width * scale);
    preview.height = Math.round(canvas.height * scale);
    const context = preview.getContext("2d");
    if (!context) return reject(new Error("preview-unavailable"));
    renderInkDocument(context, inkDocument, preview.width, preview.height, preview.width / Math.max(1, canvas.clientWidth));
    preview.toBlob((blob) => blob ? resolve(new File([blob], "handwritten-entry.webp", { type: "image/webp" })) : reject(new Error("preview-unavailable")), "image/webp", 0.9);
  });
}
