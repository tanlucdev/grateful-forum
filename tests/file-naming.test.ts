import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { join, posix } from "node:path";

const root = process.cwd();
const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const reserved = new Set([
  "default",
  "error",
  "global-error",
  "layout",
  "loading",
  "not-found",
  "page",
  "route",
  "template",
]);

function walk(dir: string): string[] {
  return readdirSync(join(root, dir)).flatMap((name) => {
    if (name.startsWith(".") || name === "node_modules" || name === ".next") return [];
    const full = join(dir, name);
    return statSync(join(root, full)).isDirectory() ? walk(full) : [full.split(posix.sep).join("/")];
  });
}

function isComponentZone(file: string) {
  return file.includes("/_components/") || (file.startsWith("components/") && !file.startsWith("components/ui/"));
}

for (const file of [...walk("app"), ...walk("components")]) {
  if (!isComponentZone(file)) continue;

  const name = posix.basename(file);
  const ext = name.endsWith(".tsx") ? ".tsx" : name.endsWith(".ts") ? ".ts" : "";
  if (!ext) continue;

  const stem = name.slice(0, -ext.length);
  if (reserved.has(stem)) continue;

  if (ext === ".tsx") {
    assert.equal(name, "index.tsx", `${file}: component files must be kebab-case/index.tsx`);
    assert.match(posix.basename(posix.dirname(file)), kebab, `${file}: component folder must be kebab-case`);
  } else {
    assert.match(stem, kebab, `${file}: non-component modules must be kebab-case.ts`);
  }
}

console.log("file naming checks passed");
