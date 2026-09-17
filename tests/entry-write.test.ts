import assert from "node:assert/strict";
import { createEntryRequestSchema } from "../lib/entries/schema.ts";
import { getStickerLabel, STICKER_GROUPS, stickers } from "../lib/entries/stickers.ts";
import { validateEntryMediaFile } from "../lib/entry-media/validation.ts";

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

assert.deepEqual(
  createEntryRequestSchema.parse({
    visibility: "private",
    gratitudes: [],
    reflection: "Một khoảnh khắc tự sự.",
    mood: "Bình thản",
    washi: "Washi An Yên",
    space: "Bàn làm việc",
    quote: "Một điều biết ơn ngắn cũng đủ làm ngày hôm nay dịu lại.",
    sticker: "Bé Mầm",
  }).gratitudes,
  [],
);

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

assert.equal(stickers.length, 72);
assert.equal(new Set(stickers.map((sticker) => sticker.id)).size, 72);

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

console.log("entry write checks passed");
