import { ApiClientError } from "./fetch-json.ts";

export function handwritingSaveErrorKey(error: unknown) {
  if (!(error instanceof ApiClientError)) return null;
  if (error.code === "media_unavailable") return "handwriting.mediaUnavailable";
  if (error.code === "media_upload_failed") return "handwriting.previewUploadFailed";
  return null;
}
