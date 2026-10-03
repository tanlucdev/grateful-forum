import { createHash, randomUUID } from "node:crypto";
import { MediaError } from "./errors.ts";
import { validateEntryMediaFile } from "./validation.ts";

type SignatureParams = Record<string, string | number>;

type CloudinaryEnv = {
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
};

export function getCloudinaryEnv(env: CloudinaryEnv = {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
}) {
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new MediaError("media_unavailable");
  }

  return { apiKey, apiSecret, cloudName };
}

export function buildCloudinarySignature(params: SignatureParams, apiSecret: string) {
  const payload = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

export async function uploadEntryMedia(file: File) {
  validateEntryMediaFile(file);
  try {
    const { apiKey, apiSecret, cloudName } = getCloudinaryEnv();
    const params = {
      folder: `entries/${new Date().getFullYear()}`,
      public_id: randomUUID(),
      timestamp: Math.floor(Date.now() / 1000),
    };
    const formData = new FormData();
    formData.set("file", file);
    formData.set("api_key", apiKey);
    for (const [key, value] of Object.entries(params)) {
      formData.set(key, String(value));
    }
    formData.set("signature", buildCloudinarySignature(params, apiSecret));

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = (await response.json()) as { public_id?: string; secure_url?: string };

    if (!response.ok || !data.public_id || !data.secure_url) throw new MediaError("media_upload_failed");
    return { path: data.public_id, url: data.secure_url };
  } catch (error) {
    if (error instanceof MediaError) throw error;
    throw new MediaError("media_upload_failed");
  }
}
