import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../messages/", import.meta.url).pathname;
const locales = ["vi", "en"] as const;
const files = await readdir(join(root, locales[0]));
assert.deepEqual((await readdir(join(root, locales[1]))).sort(), [...files].sort(), "locale catalog files differ");

for (const file of files.sort()) {
  const baseline = JSON.parse(await readFile(join(root, locales[0], file), "utf8"));
  for (const locale of locales.slice(1)) {
    const candidate = JSON.parse(await readFile(join(root, locale, file), "utf8"));
    assert.deepEqual(shape(candidate), shape(baseline), `${locale}/${file} differs from vi/${file}`);
  }
}

for (const locale of locales) {
  const feed = JSON.parse(await readFile(join(root, locale, "feed.json"), "utf8"));
  for (const key of ["brand", "write", "label", "invitation", "reactions", "empathy", "healing_energy", "refreshing"]) {
    assert.ok(typeof feed.preview[key] === "string" && feed.preview[key].trim(), `${locale}: missing feed.preview.${key}`);
  }
  assert.match(feed.dailyPractice, /<strong>.+<\/strong>/, `${locale}: daily practice emphasis missing`);
}

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort().map(([key, item]) => [key, shape(item)]));
  return typeof value;
}

console.log("catalog parity checks passed");
