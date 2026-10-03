"use client";

import { useEffect, useRef } from "react";
import { INK_PAPER_COLOR, renderInkDocument } from "@/lib/entries/ink-renderer";
import type { InkDocument } from "@/lib/entries/types";

export function HandwritingViewer({ className = "w-full", document, label }: Readonly<{ className?: string; document: InkDocument; label: string }>) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      const context = canvas.getContext("2d");
      if (context) renderInkDocument(context, document, canvas.width, canvas.height, ratio);
    };
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    draw();
    return () => observer.disconnect();
  }, [document]);
  return <canvas aria-label={label} className={`${className} ${document.orientation === "landscape" ? "aspect-[16/10]" : "aspect-[3/4]"}`} ref={ref} style={{ backgroundColor: INK_PAPER_COLOR }} />;
}
