import assert from "node:assert/strict";
import { createEntryRequestSchema } from "../lib/entries/schema.ts";
import { getStickerLabel, STICKER_GROUPS, stickers } from "../lib/entries/stickers.ts";
import { MediaError, mediaFailure } from "../lib/entry-media/errors.ts";
import { buildCloudinarySignature, getCloudinaryEnv, uploadEntryMedia } from "../lib/entry-media/mutations.ts";
import { parseHandwritingPreview, validateEntryMediaFile } from "../lib/entry-media/validation.ts";
import { eraseInkStrokes, inkDocumentSchema } from "../lib/entries/ink.ts";
import { renderInkDocument } from "../lib/entries/ink-renderer.ts";
import { composeEntryContent } from "../lib/entries/records.ts";
import { normalizeRecentSpaces } from "../lib/entries/recent-spaces-service.ts";
import { ApiClientError } from "../lib/api/fetch-json.ts";
import { handwritingSaveErrorKey } from "../lib/api/handwritten-entry-errors.ts";

assert.throws(() =>
  createEntryRequestSchema.parse({
    visibility: "friends",
    gratitudes: ["", "  ", ""],
    reflection: "",
    mood: "",
    washi: "",
    space: "",
    quote: "",
    sticker: "",
  }),
);

assert.throws(
  () => getCloudinaryEnv({}),
  (error: unknown) => error instanceof MediaError && error.code === "media_unavailable" && error.status === 503,
);

const webpPreview = new File([new Uint8Array([1])], "preview.webp", { type: "image/webp" });
assert.equal(parseHandwritingPreview("public", webpPreview), webpPreview);
assert.throws(
  () => parseHandwritingPreview("public", null),
  (error: unknown) => mediaFailure(error)?.status === 400,
);
assert.throws(
  () => parseHandwritingPreview("private", webpPreview),
  (error: unknown) => mediaFailure(error)?.status === 400,
);
assert.throws(
  () => parseHandwritingPreview("anonymous", new File([new Uint8Array([1])], "preview.png", { type: "image/png" })),
  (error: unknown) => error instanceof MediaError && error.code === "invalid_media",
);

assert.equal(handwritingSaveErrorKey(new ApiClientError("media_unavailable", "unavailable")), "handwriting.mediaUnavailable");
assert.equal(handwritingSaveErrorKey(new ApiClientError("media_upload_failed", "failed")), "handwriting.previewUploadFailed");

const originalFetch = globalThis.fetch;
const cloudinaryEnv = {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
process.env.CLOUDINARY_API_KEY = "test-key";
process.env.CLOUDINARY_API_SECRET = "test-secret";
globalThis.fetch = (async () => new Response("{}", { status: 500 })) as typeof fetch;
await assert.rejects(
  () => uploadEntryMedia(webpPreview),
  (error: unknown) => error instanceof MediaError && error.code === "media_upload_failed" && error.status === 502,
);
globalThis.fetch = originalFetch;
for (const [key, value] of Object.entries(cloudinaryEnv)) {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

assert.throws(() => createEntryRequestSchema.parse({ visibility: "private", gratitudes: [] }));
assert.equal(createEntryRequestSchema.parse({ visibility: "private", gratitudes: ["Một điều"] }).gratitudes.length, 1);
assert.equal(createEntryRequestSchema.parse({ visibility: "private", gratitudes: Array.from({ length: 10 }, (_, index) => String(index)) }).gratitudes.length, 10);

assert.equal(
  createEntryRequestSchema.parse({
    visibility: "private",
    gratitudes: ["Một điều nhỏ", "Một điều nữa", "Điều thứ ba", "Điều thứ tư"],
    reflection: "Một khoảnh khắc tự sự.",
    mood: "Bình thản",
    washi: "Washi An Yên",
    space: "Bàn làm việc",
    quote: "Một điều biết ơn ngắn cũng đủ làm ngày hôm nay dịu lại.",
    sticker: "Bé Mầm",
  }).gratitudes.length,
  4,
);

assert.equal(
  composeEntryContent({ visibility: "private", gratitudes: ["Một điều"], reflection: "Ghi thêm", mood: "calm", washi: "calm", space: "desk", quote: "quote", sticker: "sprout-calm" }),
  "Một điều\n\nGhi thêm",
);
assert.deepEqual(normalizeRecentSpaces([" Ban công ", "ban công", null, "Bàn làm việc", "Bếp"]), ["Ban công", "Bàn làm việc", "Bếp"]);

const inkDocument = {
  version: 1,
  orientation: "portrait",
  strokes: [{ color: "#145C34", points: [{ x: 12, y: 42, pressure: 0.5 }] }],
};
assert.deepEqual(inkDocumentSchema.parse(inkDocument), { ...inkDocument, paperStyle: "blank", stamp: "none" });
for (const paperStyle of ["blank", "ruled", "dot", "grid"] as const) {
  assert.equal(inkDocumentSchema.parse({ ...inkDocument, paperStyle }).paperStyle, paperStyle);
}
for (const stamp of ["none", "sprout", "heart", "star", "sun", "moon", "flower"] as const) {
  assert.equal(inkDocumentSchema.parse({ ...inkDocument, stamp }).stamp, stamp);
}
assert.throws(() => inkDocumentSchema.parse({ ...inkDocument, paperStyle: "lined" }));
assert.throws(() => inkDocumentSchema.parse({ ...inkDocument, stamp: "rainbow" }));
assert.throws(() => inkDocumentSchema.parse({ ...inkDocument, version: 2 }));
assert.throws(() => inkDocumentSchema.parse({ ...inkDocument, strokes: Array.from({ length: 251 }, () => inkDocument.strokes[0]) }));
assert.deepEqual(
  eraseInkStrokes([{ color: "#145C34", points: [{ x: 1, y: 1, pressure: 1 }, { x: 100, y: 100, pressure: 1 }, { x: 200, y: 200, pressure: 1 }] }], [{ x: 100, y: 100, pressure: 1 }], 5).map((stroke) => stroke.points.length),
  [1, 1],
);
assert.deepEqual(inkDocumentSchema.parse({ ...inkDocument, strokes: [{ ...inkDocument.strokes[0], tool: "highlighter", width: 9, opacity: 0.3 }] }).strokes[0].tool, "highlighter");

const canvasCalls: string[] = [];
const mockContext = new Proxy<Record<string, unknown>>({}, {
  get(_, property) {
    if (property === "drawImage" || property === "font") throw new Error(`Unexpected canvas dependency: ${String(property)}`);
    return (...args: unknown[]) => {
      void args;
      canvasCalls.push(String(property));
    };
  },
  set(_, property) {
    canvasCalls.push(`set:${String(property)}`);
    return true;
  },
}) as unknown as CanvasRenderingContext2D;
for (const paperStyle of ["blank", "ruled", "dot", "grid"] as const) {
  renderInkDocument(mockContext, inkDocumentSchema.parse({ ...inkDocument, paperStyle, stamp: "none" }), 600, 800, 1);
  for (const stamp of ["sprout", "heart", "star", "sun", "moon", "flower"] as const) {
    renderInkDocument(mockContext, inkDocumentSchema.parse({ ...inkDocument, paperStyle, stamp }), 600, 800, 1);
  }
}
assert.ok(canvasCalls.length > 0);

assert.equal(stickers.length, 72);
assert.equal(new Set(stickers.map((sticker) => sticker.id)).size, 72);
assert.equal(stickers.find((sticker) => sticker.id === "sprout-tea")?.icon, "tea");
assert.equal(stickers.find((sticker) => sticker.id === "sprout-reading")?.icon, "book");
assert.equal(stickers.find((sticker) => sticker.id === "moment-morning-coffee")?.icon, "coffee");

for (const group of STICKER_GROUPS) {
  assert.equal(stickers.filter((sticker) => sticker.group === group.id).length, 18);
}

for (const sticker of stickers) {
  assert.ok(sticker.labels.vi);
  assert.ok(sticker.labels.en);
  assert.ok(sticker.alts.vi);
  assert.ok(sticker.alts.en);
  assert.ok(sticker.tags.vi.length);
  assert.ok(sticker.tags.en.length);
  assert.ok(sticker.icon);
}

assert.equal(getStickerLabel("sprout-calm", "vi"), "Bé Mầm an yên");
assert.equal(getStickerLabel("Bé Mầm", "vi"), "Bé Mầm");

assert.throws(() =>
  validateEntryMediaFile(new File([new Uint8Array([1])], "note.txt", { type: "text/plain" })),
);

assert.throws(() =>
  validateEntryMediaFile(
    new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.png", { type: "image/png" }),
  ),
);

assert.equal(
  buildCloudinarySignature(
    { timestamp: 1800000000, public_id: "abc-123", folder: "entries/2026" },
    "secret",
  ),
  "1f4d2488242647133eab5e7b5014b1361d212bb8",
);

console.log("entry write checks passed");
