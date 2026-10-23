import { z } from "zod";
import type { InkDocument, InkPoint, InkStroke } from "./types";

export const INK_SIZE = 10_000;
export const INK_COLORS = ["#145C34", "#A5393E", "#315E8C", "#4B4033"] as const;
const MAX_STROKES = 250;
const MAX_POINTS_PER_STROKE = 2_000;
const MAX_POINTS = 20_000;
const MAX_SERIALIZED_BYTES = 512 * 1024;

const pointSchema = z.object({
  x: z.number().int().min(0).max(INK_SIZE),
  y: z.number().int().min(0).max(INK_SIZE),
  pressure: z.number().min(0).max(1),
}).strict();

const strokeSchema = z.object({
  color: z.enum(INK_COLORS),
  points: z.array(pointSchema).min(1).max(MAX_POINTS_PER_STROKE),
  tool: z.enum(["pen", "highlighter"]).optional(),
  width: z.number().min(1).max(80).optional(),
  opacity: z.number().min(0.05).max(1).optional(),
}).strict();

export const inkDocumentSchema = z.object({
  version: z.literal(1),
  orientation: z.enum(["portrait", "landscape"]),
  // Legacy documents predate paper styles and intentionally remain blank.
  paperStyle: z.enum(["blank", "ruled", "dot", "grid"]).default("blank"),
  // Legacy documents predate stamps and intentionally have none.
  stamp: z.enum(["none", "sprout", "heart", "star", "sun", "moon", "flower"]).default("none"),
  strokes: z.array(strokeSchema).min(1).max(MAX_STROKES),
}).superRefine((document, context) => {
  const pointCount = document.strokes.reduce((sum, stroke) => sum + stroke.points.length, 0);
  if (pointCount > MAX_POINTS) {
    context.addIssue({ code: "custom", message: "Too many ink points." });
  }
  if (new TextEncoder().encode(JSON.stringify(document)).byteLength > MAX_SERIALIZED_BYTES) {
    context.addIssue({ code: "custom", message: "Ink document is too large." });
  }
});

export function isInkDocument(value: unknown): value is InkDocument {
  return inkDocumentSchema.safeParse(value).success;
}

export function eraseInkStrokes(strokes: InkStroke[], path: InkPoint[], radius: number) {
  if (!path.length) return strokes;
  return strokes.flatMap((stroke) => splitErasedStroke(stroke, path, radius));
}

export function splitErasedStroke(stroke: InkStroke, path: InkPoint[], radius: number) {
  const pieces: InkPoint[][] = [];
  let piece: InkPoint[] = [];
  for (const point of stroke.points) {
    if (nearEraserPath(point, path, radius)) {
      if (piece.length) pieces.push(piece);
      piece = [];
    } else {
      piece.push(point);
    }
  }
  if (piece.length) pieces.push(piece);
  return pieces.map((points) => ({ ...stroke, points }));
}

function nearEraserPath(point: InkPoint, path: InkPoint[], radius: number) {
  return path.some((item, index) => index === 0 ? distance(point, item) <= radius : distanceToSegment(point, path[index - 1]!, item) <= radius);
}

function distance(left: InkPoint, right: InkPoint) {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

function distanceToSegment(point: InkPoint, start: InkPoint, end: InkPoint) {
  const length = (end.x - start.x) ** 2 + (end.y - start.y) ** 2;
  if (!length) return distance(point, start);
  const position = Math.max(0, Math.min(1, ((point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)) / length));
  return Math.hypot(point.x - (start.x + position * (end.x - start.x)), point.y - (start.y + position * (end.y - start.y)));
}
