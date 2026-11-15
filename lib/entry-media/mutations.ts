import { randomUUID } from "node:crypto";
import { AwsClient } from "aws4fetch";
import { z } from "zod";
import { MediaError } from "./errors.ts";
import { validateEntryMediaFile } from "./validation.ts";

const r2EnvSchema = z.object({
  R2_ENDPOINT: z.string().trim().regex(/^https:\/\/[a-f0-9]{32}(?:\.(?:eu|us|fedramp))?\.r2\.cloudflarestorage\.com\/?$/),
  R2_ACCESS_KEY_ID: z.string().trim().min(1),
  R2_SECRET_ACCESS_KEY: z.string().trim().min(1),
  R2_BUCKET_NAME: z.string().trim().min(3).max(63).regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/),
  R2_PUBLIC_URL: z.string().trim().url().refine((value) => {
    if (!URL.canParse(value)) return false;
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash
      && url.pathname === "/" && !url.hostname.endsWith(".r2.cloudflarestorage.com");
  }),
});

type R2Env = Partial<Record<keyof z.infer<typeof r2EnvSchema>, string>>;

export function getR2Env(env: R2Env = {
  R2_ENDPOINT: process.env.R2_ENDPOINT,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
}) {
  const result = r2EnvSchema.safeParse(env);
  if (!result.success) {
    console.error("Entry media uploads unavailable; missing or invalid environment variables:",
      [...new Set(result.error.issues.map((issue) => issue.path[0]))].join(", "));
    throw new MediaError("media_unavailable");
  }
  return result.data;
}

const extensions: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif",
};

export async function uploadEntryMedia(file: File) {
  validateEntryMediaFile(file);
  try {
    const env = getR2Env();
    const path = `entries/${new Date().getUTCFullYear()}/${randomUUID()}.${extensions[file.type]}`;
    const client = new AwsClient({
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      service: "s3",
      region: "auto",
    });
    const request = await client.sign(`${env.R2_ENDPOINT.replace(/\/$/, "")}/${env.R2_BUCKET_NAME}/${path}`, {
      method: "PUT",
      headers: { "Content-Type": file.type, "Content-Length": String(file.size), "Cache-Control": "public, max-age=31536000, immutable" },
      body: await file.arrayBuffer(),
      signal: AbortSignal.timeout(20_000),
      aws: { allHeaders: true },
    });
    const response = await fetch(request, { redirect: "error" });
    if (!response.ok) {
      const body = await response.text();
      const code = body.match(/<Code>([A-Za-z0-9]+)<\/Code>/)?.[1] ?? "unknown";
      console.error("R2 upload rejected:", response.status, code);
      throw new MediaError("media_upload_failed");
    }
    await response.body?.cancel();
    return { path, url: `${env.R2_PUBLIC_URL.replace(/\/$/, "")}/${path}` };
  } catch (error) {
    if (error instanceof MediaError) throw error;
    console.error("R2 upload failed:", error instanceof Error ? error.name : "UnknownError");
    throw new MediaError("media_upload_failed");
  }
}
