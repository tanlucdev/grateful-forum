"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ScrollArea } from "radix-ui";
import { eraseInkStrokes, INK_COLORS, INK_SIZE } from "@/lib/entries/ink";
import { INK_PAPER_COLOR, renderInkDocument } from "@/lib/entries/ink-renderer";
import type { InkDocument, InkPaperStyle, InkPoint, InkStamp, InkStroke, InkTool } from "@/lib/entries/types";
import { HandwritingToolbar } from "../handwriting-toolbar";

export type HandwritingComposerHandle = { exportPreview: () => Promise<File> };
type Props = { document: InkDocument; onChange: (document: InkDocument) => void };
type Drawing = { pointerId: number; kind: "ink"; stroke: InkStroke; original: InkDocument } | { pointerId: number; kind: "erase"; path: InkPoint[]; original: InkDocument } | { pointerId: number; kind: "pan"; x: number; y: number; panX: number; panY: number };

export const HandwritingComposer = forwardRef<HandwritingComposerHandle, Props>(function HandwritingComposer({ document, onChange }, ref) {
  const t = useTranslations("write");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const redrawRef = useRef<() => void>(() => {});
  const frameRef = useRef<number | null>(null);
  const documentRef = useRef(document);
  const drawingRef = useRef<Drawing | null>(null);
  const [color, setColor] = useState<string>(INK_COLORS[0]);
  const [tool, setTool] = useState<InkTool | "eraser" | "pan">("pen");
  const [width, setWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [undo, setUndo] = useState<InkDocument[]>([]);
  const [redo, setRedo] = useState<InkDocument[]>([]);
  const [zoom, setZoom] = useState(100);
  const [decorateOpen, setDecorateOpen] = useState(false);

  useEffect(() => { documentRef.current = document; }, [document]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const width = Math.round(rect.width * ratio);
      const height = Math.round(rect.height * ratio);
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      const context = canvas.getContext("2d");
      if (context) renderInkDocument(context, documentRef.current, canvas.width, canvas.height, ratio);
    };
    redrawRef.current = draw;
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    draw();
    return () => { observer.disconnect(); if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); frameRef.current = null; };
  }, [document, zoom]);

  useImperativeHandle(ref, () => ({ exportPreview: () => exportCanvas(documentRef.current) }), []);

  function point(event: Pick<PointerEvent, "clientX" | "clientY" | "pressure" | "pointerType">): InkPoint {
    const surface = canvasRef.current?.getBoundingClientRect();
    if (!surface) return { x: 0, y: 0, pressure: 0.5 };
    const clamp = (value: number) => Math.max(0, Math.min(INK_SIZE, Math.round(value)));
    const active = drawingRef.current;
    const pressure = event.pointerType === "pen" ? event.pressure > 0 ? event.pressure : active?.kind === "ink" ? active.stroke.points.at(-1)?.pressure ?? 0.5 : 0.5 : 0.5;
    return { x: clamp(((event.clientX - surface.left) / surface.width) * INK_SIZE), y: clamp(((event.clientY - surface.top) / surface.height) * INK_SIZE), pressure: Math.round(pressure * 100) / 100 };
  }

  function commit(next: InkDocument, previous = documentRef.current) {
    setUndo((items) => [...items, previous]);
    setRedo([]);
    publish(next);
  }

  function publish(next: InkDocument) {
    documentRef.current = next;
    onChange(next);
  }

  function preview(next: InkDocument) {
    documentRef.current = next;
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => { frameRef.current = null; redrawRef.current(); });
  }

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    if (drawingRef.current || event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const original = documentRef.current;
    if (tool === "pan") { drawingRef.current = { pointerId: event.pointerId, kind: "pan", x: event.clientX, y: event.clientY, panX: viewportRef.current?.scrollLeft ?? 0, panY: viewportRef.current?.scrollTop ?? 0 }; return; }
    const current = point(event);
    if (tool === "eraser") { drawingRef.current = { pointerId: event.pointerId, kind: "erase", path: [current], original }; preview({ ...original, strokes: eraseInkStrokes(original.strokes, [current], 180) }); return; }
    drawingRef.current = { pointerId: event.pointerId, kind: "ink", original, stroke: { color, points: [current], tool, width, opacity } };
    preview({ ...original, strokes: [...original.strokes, drawingRef.current.stroke] });
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    const active = drawingRef.current;
    if (!active || active.pointerId !== event.pointerId) return;
    if (active.kind === "pan") { viewportRef.current?.scrollTo({ left: active.panX - (event.clientX - active.x), top: active.panY - (event.clientY - active.y) }); return; }
    const coalesced = event.nativeEvent.getCoalescedEvents?.();
    const points = (coalesced?.length ? coalesced : [event]).map(point);
    if (active.kind === "erase") {
      active.path.push(...points);
      preview({ ...active.original, strokes: eraseInkStrokes(active.original.strokes, active.path, 180) });
      return;
    }
    active.stroke.points.push(...points);
    // ponytail: keep long gestures within the 2,000-point document limit; resample for higher detail later.
    if (active.stroke.points.length > 2_000) active.stroke.points = active.stroke.points.filter((_, index, items) => index % 2 === 0 || index === items.length - 1);
    preview({ ...active.original, strokes: [...active.original.strokes, active.stroke] });
  }

  function finish(event: React.PointerEvent<HTMLCanvasElement>) {
    const active = drawingRef.current;
    if (!active || active.pointerId !== event.pointerId) return;
    if (event.type === "pointerup") move(event);
    drawingRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (active.kind === "pan") return;
    const next = active.kind === "erase" ? { ...active.original, strokes: eraseInkStrokes(active.original.strokes, active.path, 180) } : { ...active.original, strokes: [...active.original.strokes, active.stroke] };
    commit(next, active.original);
  }

  function restore(previous: InkDocument, target: "undo" | "redo") {
    const current = documentRef.current;
    if (target === "undo") { setUndo((items) => items.slice(0, -1)); setRedo((items) => [...items, current]); }
    else { setRedo((items) => items.slice(0, -1)); setUndo((items) => [...items, current]); }
    publish(previous);
  }

  function clear() {
    if (document.strokes.length) commit({ ...document, strokes: [] });
  }

  return <section className="space-y-3" aria-label={t("handwriting.canvasLabel")}>
    <HandwritingToolbar canClear={!!document.strokes.length} canRedo={!!redo.length} canUndo={!!undo.length} color={color} onClear={clear} onColorChange={setColor} onOpacityChange={setOpacity} onRedo={() => redo.at(-1) && restore(redo.at(-1)!, "redo")} onToolChange={(next) => { setTool(next); if (next === "pen") setOpacity(1); if (next === "highlighter") setOpacity(0.3); }} onUndo={() => undo.at(-1) && restore(undo.at(-1)!, "undo")} onWidthChange={setWidth} onZoomChange={setZoom} opacity={opacity} tool={tool} width={width} zoom={zoom} />
    <ScrollArea.Root className="overflow-hidden rounded-2xl border border-border bg-muted" type="auto">
      <ScrollArea.Viewport aria-label={t("handwriting.pageNavigation")} className="max-h-[70dvh] min-h-60 w-full rounded-[inherit] outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring [&>div]:block!" ref={viewportRef} tabIndex={0}>
        <div className="w-full p-3"><div className="mx-auto" style={{ width: `${zoom}%` }}><canvas aria-label={t("handwriting.canvasLabel")} className={`block touch-none w-full rounded-xl shadow-sm ${tool === "pan" ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair"} ${document.orientation === "landscape" ? "aspect-[16/10]" : "aspect-[3/4]"}`} onLostPointerCapture={finish} onPointerCancel={finish} onPointerDown={start} onPointerMove={move} onPointerUp={finish} ref={canvasRef} style={{ backgroundColor: INK_PAPER_COLOR }} /></div></div>
      </ScrollArea.Viewport>
      {(["horizontal", "vertical"] as const).map((orientation) => <ScrollArea.Scrollbar className="flex touch-none select-none bg-muted p-0.5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col" key={orientation} orientation={orientation}><ScrollArea.Thumb className="relative flex-1 rounded-full bg-primary/35 hover:bg-primary/60" /></ScrollArea.Scrollbar>)}
      <ScrollArea.Corner className="bg-muted" />
    </ScrollArea.Root>
    <p className="text-xs text-muted-foreground">{t("handwriting.help")}</p>
    <button aria-expanded={decorateOpen} className="min-h-11 rounded-xl px-3 text-sm font-semibold text-primary" onClick={() => setDecorateOpen(!decorateOpen)} type="button">{t("handwriting.decorate")}</button>
    {decorateOpen ? <div className="grid gap-3 rounded-2xl bg-muted p-3 sm:grid-cols-2"><Choice label={t("handwriting.paperStyleLabel")} name="paper" options={["blank", "ruled", "dot", "grid"] as InkPaperStyle[]} value={document.paperStyle} onChange={(paperStyle) => commit({ ...document, paperStyle })} t={t as unknown as (key: string) => string} /><Choice label={t("handwriting.stampLabel")} name="stamp" options={["none", "sprout", "heart", "star", "sun", "moon", "flower"] as InkStamp[]} value={document.stamp} onChange={(stamp) => commit({ ...document, stamp })} t={t as unknown as (key: string) => string} /></div> : null}
  </section>;
});

function Choice<T extends string>({ label, name, onChange, options, t, value }: Readonly<{ label: string; name: string; options: readonly T[]; value: T; onChange: (value: T) => void; t: (key: string) => string }>) {
  return <fieldset><legend className="mb-2 text-xs font-semibold">{label}</legend><div className="flex flex-wrap gap-2">{options.map((item) => <label className="flex min-h-11 cursor-pointer items-center rounded-xl bg-card px-3 text-xs font-semibold has-checked:bg-accent has-checked:text-accent-foreground has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-primary" key={item}><input checked={value === item} className="sr-only" name={name} onChange={() => onChange(item)} type="radio" />{t(name === "stamp" ? `handwriting.stamp.${item}` : `handwriting.${item}`)}</label>)}</div></fieldset>;
}

function exportCanvas(document: InkDocument) {
  const preview = window.document.createElement("canvas");
  preview.width = 1200;
  preview.height = document.orientation === "landscape" ? 750 : 1600;
  const context = preview.getContext("2d");
  if (!context) return Promise.reject(new Error("preview-unavailable"));
  renderInkDocument(context, document, preview.width, preview.height, 1);
  return new Promise<File>((resolve, reject) => preview.toBlob((blob) => blob ? resolve(new File([blob], "handwritten-entry.webp", { type: "image/webp" })) : reject(new Error("preview-unavailable")), "image/webp", 0.9));
}
