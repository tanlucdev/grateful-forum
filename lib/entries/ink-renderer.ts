import { INK_SIZE } from "./ink.ts";
import type { InkDocument, InkStroke } from "./types.ts";

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
  document.strokes.forEach((stroke) => drawStroke(context, stroke, width, height));
  context.globalAlpha = 1;
}

function drawStroke(context: CanvasRenderingContext2D, stroke: InkStroke, width: number, height: number) {
  const highlighter = stroke.tool === "highlighter";
  // ponytail: a 600px reference sheet keeps ink proportional across zoom and export; version geometry if paper sizes become configurable.
  const size = (stroke.width ?? 5) * (width / 600) * (highlighter ? 4 : 1);
  const points = stroke.points.filter((point, index, items) => index === 0 || point.x !== items[index - 1].x || point.y !== items[index - 1].y).map((point) => ({ x: point.x / INK_SIZE * width, y: point.y / INK_SIZE * height, radius: size / 2 * (highlighter ? 1 : 0.35 + point.pressure * 0.65) }));
  if (!points.length) return;
  context.fillStyle = stroke.color;
  context.strokeStyle = stroke.color;
  context.globalAlpha = stroke.opacity ?? (highlighter ? 0.3 : 1);
  context.beginPath();
  const first = points[0];
  const last = points[points.length - 1];
  if (points.length === 1) {
    context.arc(first.x, first.y, first.radius, 0, Math.PI * 2);
    context.fill();
    return;
  }
  if (highlighter) {
    context.lineWidth = size;
    context.moveTo(first.x, first.y);
    points.slice(1).forEach((point, index) => {
      const previous = points[index];
      context.quadraticCurveTo(previous.x, previous.y, (previous.x + point.x) / 2, (previous.y + point.y) / 2);
    });
    context.lineTo(last.x, last.y);
    context.stroke();
    return;
  }
  const edges = points.map((point, index) => {
    const before = points[Math.max(0, index - 1)];
    const after = points[Math.min(points.length - 1, index + 1)];
    const angle = Math.atan2(after.y - before.y, after.x - before.x) + Math.PI / 2;
    const dx = Math.cos(angle) * point.radius;
    const dy = Math.sin(angle) * point.radius;
    return { left: { x: point.x + dx, y: point.y + dy }, right: { x: point.x - dx, y: point.y - dy }, angle };
  });
  const left = edges.map((edge) => edge.left);
  const right = edges.map((edge) => edge.right).reverse();
  context.moveTo(left[0].x, left[0].y);
  for (const side of [left, right]) {
    side.slice(1).forEach((point, index) => {
      const previous = side[index];
      context.quadraticCurveTo(previous.x, previous.y, (previous.x + point.x) / 2, (previous.y + point.y) / 2);
    });
    context.lineTo(side[side.length - 1].x, side[side.length - 1].y);
    const end = side === left ? last : first;
    const angle = side === left ? edges[edges.length - 1].angle : edges[0].angle + Math.PI;
    context.arc(end.x, end.y, end.radius, angle, angle - Math.PI, true);
  }
  context.closePath();
  context.fill();
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
