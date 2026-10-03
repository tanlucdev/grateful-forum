import { INK_SIZE } from "./ink.ts";
import type { InkDocument } from "./types.ts";

export const INK_PAPER_COLOR = "#fffdf8";

export function renderInkDocument(
  context: CanvasRenderingContext2D,
  document: InkDocument,
  width: number,
  height: number,
  pixelRatio: number,
) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = INK_PAPER_COLOR;
  context.fillRect(0, 0, width, height);

  if (document.paperStyle === "ruled") drawRules(context, width, height, pixelRatio);
  if (document.paperStyle === "dot") drawDots(context, width, height, pixelRatio);
  if (document.paperStyle === "grid") drawGrid(context, width, height, pixelRatio);
  if (document.stamp && document.stamp !== "none") drawStamp(context, document.stamp, width, height, pixelRatio);

  context.lineCap = "round";
  context.lineJoin = "round";
  document.strokes.forEach((stroke) => {
    const first = stroke.points[0];
    if (!first) return;
    context.strokeStyle = stroke.color;
    context.beginPath();
    context.moveTo((first.x / INK_SIZE) * width, (first.y / INK_SIZE) * height);
    stroke.points.slice(1).forEach((point) => {
      context.lineWidth = Math.max(1.5, point.pressure * 5) * pixelRatio;
      context.lineTo((point.x / INK_SIZE) * width, (point.y / INK_SIZE) * height);
    });
    if (stroke.points.length === 1) context.lineTo((first.x / INK_SIZE) * width + pixelRatio, (first.y / INK_SIZE) * height + pixelRatio);
    context.stroke();
  });
}

function drawRules(context: CanvasRenderingContext2D, width: number, height: number, pixelRatio: number) {
  const spacing = height / 18;
  context.beginPath();
  context.strokeStyle = "rgba(20, 92, 52, 0.12)";
  context.lineWidth = Math.max(0.75, pixelRatio * 0.75);
  for (let y = spacing; y < height; y += spacing) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }
  context.stroke();
}

function drawDots(context: CanvasRenderingContext2D, width: number, height: number, pixelRatio: number) {
  const spacing = Math.min(width, height) / 22;
  context.fillStyle = "rgba(20, 92, 52, 0.16)";
  context.beginPath();
  for (let x = spacing; x < width; x += spacing) {
    for (let y = spacing; y < height; y += spacing) {
      context.moveTo(x + pixelRatio, y);
      context.arc(x, y, Math.max(0.75, pixelRatio * 0.75), 0, Math.PI * 2);
    }
  }
  context.fill();
}

function drawGrid(context: CanvasRenderingContext2D, width: number, height: number, pixelRatio: number) {
  const spacing = Math.min(width, height) / 22;
  context.beginPath();
  context.strokeStyle = "rgba(20, 92, 52, 0.12)";
  context.lineWidth = Math.max(0.75, pixelRatio * 0.75);
  for (let x = spacing; x < width; x += spacing) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }
  for (let y = spacing; y < height; y += spacing) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }
  context.stroke();
}

function drawStamp(context: CanvasRenderingContext2D, stamp: Exclude<InkDocument["stamp"], "none">, width: number, height: number, pixelRatio: number) {
  const shortestSide = Math.min(width, height);
  const size = shortestSide * 0.12;
  const margin = shortestSide * 0.06;
  const x = width - margin - size / 2;
  const y = height - margin - size / 2;
  const lineWidth = Math.max(1, pixelRatio * 1.25);

  context.strokeStyle = "rgba(20, 92, 52, 0.48)";
  context.fillStyle = "rgba(20, 92, 52, 0.24)";
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();

  if (stamp === "sprout") {
    context.moveTo(x, y + size * 0.42);
    context.lineTo(x, y - size * 0.08);
    context.moveTo(x, y);
    context.quadraticCurveTo(x - size * 0.48, y - size * 0.08, x - size * 0.34, y - size * 0.42);
    context.quadraticCurveTo(x - size * 0.04, y - size * 0.38, x, y);
    context.moveTo(x, y - size * 0.12);
    context.quadraticCurveTo(x + size * 0.48, y - size * 0.2, x + size * 0.34, y - size * 0.5);
    context.quadraticCurveTo(x + size * 0.04, y - size * 0.46, x, y - size * 0.12);
    context.stroke();
    return;
  }

  if (stamp === "heart") {
    context.moveTo(x, y + size * 0.38);
    context.bezierCurveTo(x - size * 0.72, y - size * 0.05, x - size * 0.38, y - size * 0.58, x, y - size * 0.2);
    context.bezierCurveTo(x + size * 0.38, y - size * 0.58, x + size * 0.72, y - size * 0.05, x, y + size * 0.38);
    context.fill();
    context.stroke();
    return;
  }

  if (stamp === "star") {
    for (let index = 0; index < 10; index += 1) {
      const angle = -Math.PI / 2 + (Math.PI * index) / 5;
      const radius = index % 2 ? size * 0.22 : size * 0.5;
      const pointX = x + Math.cos(angle) * radius;
      const pointY = y + Math.sin(angle) * radius;
      if (index === 0) context.moveTo(pointX, pointY);
      else context.lineTo(pointX, pointY);
    }
    context.closePath();
    context.fill();
    context.stroke();
    return;
  }

  if (stamp === "sun") {
    context.arc(x, y, size * 0.24, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    for (let index = 0; index < 8; index += 1) {
      const angle = (Math.PI * index) / 4;
      context.beginPath();
      context.moveTo(x + Math.cos(angle) * size * 0.34, y + Math.sin(angle) * size * 0.34);
      context.lineTo(x + Math.cos(angle) * size * 0.5, y + Math.sin(angle) * size * 0.5);
      context.stroke();
    }
    return;
  }

  if (stamp === "moon") {
    context.arc(x - size * 0.08, y, size * 0.38, Math.PI * 0.3, Math.PI * 1.7);
    context.stroke();
    context.beginPath();
    context.arc(x + size * 0.16, y - size * 0.04, size * 0.26, Math.PI * 0.35, Math.PI * 1.65, true);
    context.stroke();
    return;
  }

  for (let index = 0; index < 6; index += 1) {
    const angle = (Math.PI * index) / 3;
    context.moveTo(x + Math.cos(angle) * size * 0.38 + size * 0.16, y + Math.sin(angle) * size * 0.38);
    context.arc(x + Math.cos(angle) * size * 0.22, y + Math.sin(angle) * size * 0.22, size * 0.16, 0, Math.PI * 2);
  }
  context.fill();
  context.stroke();
  context.beginPath();
  context.arc(x, y, size * 0.15, 0, Math.PI * 2);
  context.stroke();
}
