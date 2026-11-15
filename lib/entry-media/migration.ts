import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { entryMediaColumns, getCloudinaryMediaPage, replaceEntryMediaUrl } from "../entries/media-migration-repository.ts";
import { getR2Env, uploadEntryMedia } from "./mutations.ts";
import { validateEntryMediaFile } from "./validation.ts";

function isCloudinaryUrl(value: string | null): value is string {
  // ponytail: standard Cloudinary URLs only; add a configured host allowlist for custom delivery domains.
  if (!value || !URL.canParse(value)) return false;
  const url = new URL(value);
  return url.protocol === "https:" && url.hostname === "res.cloudinary.com" && !url.username && !url.password;
}

async function downloadImage(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000), redirect: "error", cache: "no-store" });
  if (!response.ok || !response.body) {
    await response.body?.cancel();
    throw new Error(`Media download failed (HTTP ${response.status}); original URL kept.`);
  }
  const reader = response.body.getReader();
  const chunks: BlobPart[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 5 * 1024 * 1024) throw new Error("Media exceeds 5 MB; original URL kept.");
      chunks.push(new Uint8Array(value));
    }
  } finally {
    await reader.cancel();
  }
  const file = new File(chunks, "migration", { type: response.headers.get("content-type")?.split(";")[0].trim() ?? "" });
  validateEntryMediaFile(file);
  return file;
}

export async function migrateEntryMedia(supabase: SupabaseClient, apply = false) {
  if (apply) getR2Env();
  const stats = { entries: 0, references: 0, copied: 0, updated: 0, concurrentChanges: 0 };
  const copied = new Map<string, string>();
  let cursor: string | undefined;
  while (true) {
    const rows = await getCloudinaryMediaPage(supabase, cursor);
    if (!rows.length) break;
    for (const row of rows) {
      stats.entries++;
      for (const column of entryMediaColumns) {
        const source = row[column];
        if (!isCloudinaryUrl(source)) continue;
        stats.references++;
        if (!apply) continue;
        let destination = copied.get(source);
        if (!destination) {
          const file = await downloadImage(source);
          const uploaded = await uploadEntryMedia(file);
          const delivered = await downloadImage(uploaded.url);
          const checksum = async (image: File) => createHash("sha256").update(new Uint8Array(await image.arrayBuffer())).digest("hex");
          if (file.type !== delivered.type || await checksum(file) !== await checksum(delivered)) throw new Error("R2 content mismatch; original URL kept.");
          destination = uploaded.url;
          copied.set(source, destination);
          stats.copied++;
        }
        if (await replaceEntryMediaUrl(supabase, row.id, column, source, destination)) stats.updated++;
        else stats.concurrentChanges++;
      }
    }
    cursor = rows.at(-1)!.id;
  }
  return stats;
}
