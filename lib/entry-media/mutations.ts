import { createHash, randomUUID } from "node:crypto";
import { validateEntryMediaFile } from "./validation.ts";

type SignatureParams = Record<string, string | number>;

function getCloudinaryEnv() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary environment variables.");
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

  const data = (await response.json()) as { error?: { message?: string }; public_id?: string; secure_url?: string };

  if (!response.ok) {
    throw new Error(data.error?.message ?? "Could not upload image.");
  }

  if (!data.public_id || !data.secure_url) {
    throw new Error("Invalid Cloudinary response.");
  }

  return { path: data.public_id, url: data.secure_url };
}
