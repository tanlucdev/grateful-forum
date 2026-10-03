import { fetchJson } from "./fetch-json";

export type EntryMediaResponse =
  | { uploaded: true; url: string; path: string }
  | { uploaded: false; reason: string };

export async function uploadEntryMedia(file: File) {
  const formData = new FormData();
  formData.set("file", file);

  return fetchJson<EntryMediaResponse>("/api/entry-media", {
    method: "POST",
    body: formData,
  }, "Could not upload media.");
}
