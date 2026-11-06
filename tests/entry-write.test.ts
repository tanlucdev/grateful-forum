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
import { hexToHsv, hsvToHex } from "../app/[locale]/write/_components/ink-color-picker/ink-color.ts";

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
for (const color of ["#145C34", "#A5393E", "#315E8C", "#4B4033", "#FF8800", "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#aabbcc"]) {
  assert.equal(inkDocumentSchema.parse({ ...inkDocument, strokes: [{ ...inkDocument.strokes[0], color }] }).strokes[0].color, color);
  const hsv = hexToHsv(color);
  assert.equal(hsvToHex(hsv.hue, hsv.saturation, hsv.value), color.toUpperCase());
}
for (const color of ["red", "#123", "#AABBCCDD", "#GGGGGG", "url(https://example.com)"]) {
  assert.equal(inkDocumentSchema.safeParse({ ...inkDocument, strokes: [{ ...inkDocument.strokes[0], color }] }).success, false);
}
assert.equal(hsvToHex(0, 1, 1), "#FF0000");
assert.equal(hsvToHex(120, 1, 1), "#00FF00");
assert.equal(hsvToHex(240, 1, 1), "#0000FF");

const canvasCalls: string[] = [];
const canvasOperations: { name: string; args: unknown[] }[] = [];
const mockContext = new Proxy<Record<string, unknown>>({}, {
  get(_, property) {
    if (property === "drawImage" || property === "font") throw new Error(`Unexpected canvas dependency: ${String(property)}`);
    return (...args: unknown[]) => {
      canvasOperations.push({ name: String(property), args });
      canvasCalls.push(String(property));
    };
  },
  set(_, property, value) {
    canvasOperations.push({ name: String(property), args: [value] });
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

const pressureDocument = inkDocumentSchema.parse({ ...inkDocument, strokes: [{ color: "#FF8800", width: 9, opacity: 0.5, points: [{ x: 100, y: 100, pressure: 0.2 }, { x: 200, y: 400, pressure: 0.5 }, { x: 400, y: 200, pressure: 0.9 }] }] });
canvasOperations.length = 0;
renderInkDocument(mockContext, pressureDocument, 600, 800, 1);
assert.ok(canvasOperations.some(({ name }) => name === "quadraticCurveTo"), "Ink should interpolate smooth curves");
assert.equal(canvasOperations.filter(({ name }) => name === "fill").length, 1, "Apply opacity once to a pressure stroke, avoiding dark segment seams");
const capRadii = canvasOperations.filter(({ name }) => name === "arc").map(({ args }) => Number(args[2]));
assert.ok(capRadii[0] > capRadii[1], "Pressure must affect each end independently");
canvasOperations.length = 0;
renderInkDocument(mockContext, pressureDocument, 1200, 1600, 2);
assert.deepEqual(canvasOperations.filter(({ name }) => name === "arc").map(({ args }) => Number(args[2])), capRadii.map((radius) => radius * 2), "Zoom and export should preserve relative ink width");
canvasOperations.length = 0;
renderInkDocument(mockContext, inkDocumentSchema.parse(inkDocument), 600, 800, 1);
assert.equal(canvasOperations.filter(({ name }) => name === "arc").length, 1, "A tap should leave a visible dot");
assert.ok(canvasOperations.some(({ name }) => name === "fill"));
canvasOperations.length = 0;
renderInkDocument(mockContext, { ...pressureDocument, strokes: [{ ...pressureDocument.strokes[0], tool: "highlighter", opacity: 0.3 }] }, 600, 800, 1);
assert.ok(canvasOperations.some(({ name, args }) => name === "lineWidth" && args[0] === 36), "Highlighter should have a broad, consistent nib");
assert.equal(canvasOperations.filter(({ name }) => name === "stroke").length, 1, "Highlighter opacity should apply once per stroke");

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

// Composer limits, save gating, URL selection and API-to-profile metadata round trip.
const { validComposerEntry, canSubmitEntry, selectJournalEntry } = await import("../lib/entries/composer.ts");
const { createEntry: saveComposerEntry } = await import("../lib/api/entries.ts");
const { createEntry: insertComposerEntry } = await import("../lib/entries/mutations.ts");
const { toEntryMetadata } = await import("../lib/entries/records.ts");
const id = "d660d150-dc69-4afe-83fb-d00f23eb09e7";
const otherId = "2954d4eb-784e-44ab-b009-de8dd4b1284e";
assert.equal(canSubmitEntry(true, false, false), true);
assert.equal(canSubmitEntry(false, false, false), false);
assert.equal(canSubmitEntry(true, true, false), false);
assert.equal(canSubmitEntry(true, false, true), false);
assert.deepEqual(selectJournalEntry([], id), { index: 0, unavailable: true });
assert.deepEqual(selectJournalEntry([{ id }, { id: otherId }], otherId), { index: 1, unavailable: false });
for (const requested of ["invalid", "../../other", "58c7cd36-c4bc-42e7-8f0a-18194af1e4ca"]) {
  assert.deepEqual(selectJournalEntry([{ id }], requested), { index: 0, unavailable: true });
}
assert.deepEqual(selectJournalEntry([{ id }]), { index: 0, unavailable: false });
const draft = { visibility: "private" as const, gratitudes: Array.from({ length: 10 }, (_, i) => `Điều ${i + 1}\nCảm ơn`), reflection: "Ghi thêm\nTiếng Việt", mood: "calm", space: "Bàn nhỏ", washi: "warm", quote: "Một ngày đẹp", sticker: "sprout-calm", imageUrl: "https://example.com/photo.png" };
assert.equal(validComposerEntry(draft), true);
assert.equal(validComposerEntry({ ...draft, gratitudes: [] }), false);
assert.equal(validComposerEntry({ ...draft, gratitudes: ["x".repeat(1001)] }), false);
assert.equal(validComposerEntry({ ...draft, quote: "x".repeat(241) }), false);
assert.equal(validComposerEntry({ ...draft, gratitudes: Array(10).fill("x".repeat(1000)), reflection: "x" }), false);
assert.equal(validComposerEntry({ ...draft, sticker: null, washi: null, quote: null, imageUrl: null }), true);
let stored: Record<string, unknown> = {};
let requests = 0;
const repository = {
  from(table: string) {
    assert.equal(table, "entries");
    return { insert(row: Record<string, unknown>) { stored = row; return { select: () => ({ single: async () => ({ data: { id, created_at: "2026-10-27T03:00:00Z" }, error: null }) }) }; } };
  },
};
globalThis.fetch = (async (path, options) => {
  requests++;
  assert.equal(path, "/api/entries");
  const input = createEntryRequestSchema.parse(JSON.parse(String(options?.body)));
  const entry = await insertComposerEntry(repository as unknown as Parameters<typeof insertComposerEntry>[0], input, "account-owner");
  return Response.json({ saved: true, entry });
}) as typeof fetch;
try {
  const result = await saveComposerEntry(draft);
  assert.equal(result.saved, true);
  assert.equal(requests, 1);
  assert.equal(stored.user_id, "account-owner");
  const metadata = toEntryMetadata({ ...stored, entry_kind: "text", handwriting_preview_url: null } as unknown as Parameters<typeof toEntryMetadata>[0]);
  assert.deepEqual(metadata.gratitudes, draft.gratitudes);
  for (const field of ["reflection", "mood", "space", "washi", "quote", "sticker", "imageUrl"] as const) assert.equal(metadata[field], draft[field]);
  assert.equal(stored.content, composeEntryContent(draft));
  if (result.saved) assert.equal(selectJournalEntry([{ id: otherId }, result.entry], result.entry.id).index, 1);
  globalThis.fetch = (async () => Response.json({ code: "auth_required" }, { status: 401 })) as typeof fetch;
  await assert.rejects(() => saveComposerEntry(draft), (error: unknown) => error instanceof ApiClientError && error.code === "auth_required");
  assert.equal(draft.gratitudes.length, 10);
  assert.equal(draft.imageUrl, "https://example.com/photo.png");
} finally { globalThis.fetch = originalFetch; }
console.log("composer save and profile round-trip checks passed");
