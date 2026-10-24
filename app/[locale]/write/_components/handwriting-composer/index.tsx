"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MaterialSymbol } from "@/components/ui/material-symbol";
import { eraseInkStrokes, INK_COLORS, INK_SIZE } from "@/lib/entries/ink";
import { INK_PAPER_COLOR, renderInkDocument } from "@/lib/entries/ink-renderer";
import type { InkDocument, InkPaperStyle, InkPoint, InkStamp, InkStroke, InkTool } from "@/lib/entries/types";

export type HandwritingComposerHandle = { exportPreview: () => Promise<File> };
type Props = { document: InkDocument; onChange: (document: InkDocument) => void };
type Drawing = { pointerId: number; kind: "ink"; stroke: InkStroke; original: InkDocument } | { pointerId: number; kind: "erase"; path: InkPoint[]; original: InkDocument } | { pointerId: number; kind: "pan"; x: number; y: number; panX: number; panY: number };

export const HandwritingComposer = forwardRef<HandwritingComposerHandle, Props>(function HandwritingComposer({ document, onChange }, ref) {
  const t = useTranslations("write");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef(document);
  const drawingRef = useRef<Drawing | null>(null);
  const [color, setColor] = useState<(typeof INK_COLORS)[number]>(INK_COLORS[0]);
  const [tool, setTool] = useState<InkTool | "eraser" | "pan">("pen");
  const [width, setWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [undo, setUndo] = useState<InkDocument[]>([]);
  const [redo, setRedo] = useState<InkDocument[]>([]);
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [decorateOpen, setDecorateOpen] = useState(false);

  useEffect(() => { documentRef.current = document; }, [document]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * ratio / (zoom / 100));
      canvas.height = Math.round(rect.height * ratio / (zoom / 100));
      const context = canvas.getContext("2d");
      if (context) renderInkDocument(context, documentRef.current, canvas.width, canvas.height, ratio);
    };
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    draw();
    return () => observer.disconnect();
  }, [document, zoom]);

  useImperativeHandle(ref, () => ({ exportPreview: () => exportCanvas(documentRef.current) }), []);

  function point(event: React.PointerEvent<HTMLCanvasElement>): InkPoint {
    const surface = surfaceRef.current?.getBoundingClientRect();
    if (!surface) return { x: 0, y: 0, pressure: 0.5 };
    return { x: Math.round(((event.clientX - surface.left) / surface.width) * INK_SIZE), y: Math.round(((event.clientY - surface.top) / surface.height) * INK_SIZE), pressure: Math.round((event.pressure || 0.5) * 100) / 100 };
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

  function start(event: React.PointerEvent<HTMLCanvasElement>) {
    if (drawingRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const original = documentRef.current;
    if (tool === "pan") { drawingRef.current = { pointerId: event.pointerId, kind: "pan", x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y }; return; }
    const current = point(event);
    if (tool === "eraser") { drawingRef.current = { pointerId: event.pointerId, kind: "erase", path: [current], original }; return; }
    drawingRef.current = { pointerId: event.pointerId, kind: "ink", original, stroke: { color, points: [current], tool, width, opacity } };
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    const active = drawingRef.current;
    if (!active || active.pointerId !== event.pointerId) return;
    if (active.kind === "pan") { setPan({ x: active.panX + event.clientX - active.x, y: active.panY + event.clientY - active.y }); return; }
    if (active.kind === "erase") {
      active.path.push(point(event));
      publish({ ...active.original, strokes: eraseInkStrokes(active.original.strokes, active.path, 180) });
      return;
    }
    active.stroke.points.push(point(event));
    publish({ ...active.original, strokes: [...active.original.strokes, active.stroke] });
  }

  function finish(event: React.PointerEvent<HTMLCanvasElement>) {
    const active = drawingRef.current;
    if (!active || active.pointerId !== event.pointerId) return;
    drawingRef.current = null;
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
    if (document.strokes.length && window.confirm(t("handwriting.clearConfirm"))) commit({ ...document, strokes: [] });
  }

  return <section className="space-y-3" aria-label={t("handwriting.canvasLabel")}>
    <div className="flex flex-wrap gap-2 rounded-2xl bg-muted/70 p-2" role="toolbar" aria-label={t("handwriting.toolLabel")}>
      <Tool active={tool === "pen"} icon="edit" label={t("handwriting.pen")} onClick={() => { setTool("pen"); setOpacity(1); }} />
      <Tool active={tool === "highlighter"} icon="ink_highlighter" label={t("handwriting.highlighter")} onClick={() => { setTool("highlighter"); setOpacity(0.3); }} />
      <Tool active={tool === "eraser"} icon="ink_eraser" label={t("handwriting.eraser")} onClick={() => setTool("eraser")} />
      <Tool active={tool === "pan"} icon="pan_tool" label={t("handwriting.pan")} onClick={() => setTool("pan")} />
      <Tool disabled={!undo.length} icon="undo" label={t("handwriting.undo")} onClick={() => undo.at(-1) && restore(undo.at(-1)!, "undo")} />
      <Tool disabled={!redo.length} icon="redo" label={t("handwriting.redo")} onClick={() => redo.at(-1) && restore(redo.at(-1)!, "redo")} />
      <Tool danger disabled={!document.strokes.length} icon="delete" label={t("handwriting.clear")} onClick={clear} />
      {INK_COLORS.map((item) => <button aria-label={t("handwriting.color", { color: item })} aria-pressed={color === item} className={`h-11 w-11 rounded-full border-4 ${color === item ? "border-foreground" : "border-card"}`} key={item} onClick={() => setColor(item)} style={{ backgroundColor: item }} type="button" />)}
      <label className="flex min-h-11 items-center gap-2 rounded-xl bg-card px-3 text-xs font-semibold"><span>{t("handwriting.size")}</span><select aria-label={t("handwriting.size")} className="bg-transparent" onChange={(event) => setWidth(Number(event.target.value))} value={width}><option value="3">{t("handwriting.thin")}</option><option value="5">{t("handwriting.medium")}</option><option value="9">{t("handwriting.bold")}</option></select></label>
      <label className="flex min-h-11 items-center gap-2 rounded-xl bg-card px-3 text-xs font-semibold"><span>{t("handwriting.opacity")}</span><input aria-label={t("handwriting.opacity")} max="1" min="0.1" onChange={(event) => setOpacity(Number(event.target.value))} step="0.1" type="range" value={opacity} /></label>
      <label className="flex min-h-11 items-center gap-2 rounded-xl bg-card px-3 text-xs font-semibold"><span>{t("handwriting.zoom")}</span><input aria-label={t("handwriting.zoom")} max="200" min="50" onChange={(event) => setZoom(Number(event.target.value))} step="10" type="range" value={zoom} /></label>
    </div>
    <div className="overflow-auto rounded-2xl border border-border bg-muted p-3"><div className="min-w-[320px] origin-top-left transition-transform" ref={surfaceRef} style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})` }}><canvas aria-label={t("handwriting.canvasLabel")} className={`touch-none w-full rounded-xl shadow-sm ${document.orientation === "landscape" ? "aspect-[16/10]" : "aspect-[3/4]"}`} onPointerCancel={finish} onPointerDown={start} onPointerMove={move} onPointerUp={finish} ref={canvasRef} style={{ backgroundColor: INK_PAPER_COLOR }} /></div></div>
    <p className="text-xs text-muted-foreground">{t("handwriting.help")}</p>
    <button aria-expanded={decorateOpen} className="min-h-11 rounded-xl px-3 text-sm font-semibold text-primary" onClick={() => setDecorateOpen(!decorateOpen)} type="button">{t("handwriting.decorate")}</button>
    {decorateOpen ? <div className="grid gap-3 rounded-2xl bg-muted p-3 sm:grid-cols-2"><Choice label={t("handwriting.paperStyleLabel")} name="paper" options={["blank", "ruled", "dot", "grid"] as InkPaperStyle[]} value={document.paperStyle} onChange={(paperStyle) => commit({ ...document, paperStyle })} t={t as unknown as (key: string) => string} /><Choice label={t("handwriting.stampLabel")} name="stamp" options={["none", "sprout", "heart", "star", "sun", "moon", "flower"] as InkStamp[]} value={document.stamp} onChange={(stamp) => commit({ ...document, stamp })} t={t as unknown as (key: string) => string} /></div> : null}
  </section>;
});

function Tool({ active, danger, disabled, icon, label, onClick }: Readonly<{ active?: boolean; danger?: boolean; disabled?: boolean; icon: string; label: string; onClick: () => void }>) {
  return <button aria-label={label} aria-pressed={active} className={`flex h-11 min-w-11 items-center justify-center rounded-xl px-2 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring ${active ? "bg-primary text-primary-foreground" : danger ? "text-destructive" : "bg-card text-foreground"}`} disabled={disabled} onClick={onClick} title={label} type="button"><MaterialSymbol name={icon} /></button>;
}

function Choice<T extends string>({ label, name, onChange, options, t, value }: Readonly<{ label: string; name: string; options: readonly T[]; value: T; onChange: (value: T) => void; t: (key: string) => string }>) {
  return <fieldset><legend className="mb-2 text-xs font-semibold">{label}</legend><div className="flex flex-wrap gap-2">{options.map((item) => <label className="flex min-h-11 items-center rounded-xl bg-card px-3 text-xs font-semibold has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-primary" key={item}><input checked={value === item} className="sr-only" name={name} onChange={() => onChange(item)} type="radio" />{t(`handwriting.${item}`)}</label>)}</div></fieldset>;
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
