import assert from "node:assert/strict";
import { createEntryRequestSchema } from "../lib/entries/schema.ts";
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

assert.throws(() =>
  validateEntryMediaFile(new File([new Uint8Array([1])], "note.txt", { type: "text/plain" })),
);

assert.throws(() =>
  validateEntryMediaFile(
    new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.png", { type: "image/png" }),
  ),
);

console.log("entry write checks passed");
