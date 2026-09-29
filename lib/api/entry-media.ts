type EntryMediaResponse =
  | { uploaded: true; url: string; path: string }
  | { uploaded: false; reason: string };

type ApiError = { code?: string; error?: string };

export async function uploadEntryMedia(file: File) {
  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch("/api/entry-media", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as EntryMediaResponse & ApiError;

  if (!response.ok) {
    const error = new Error(data.error ?? "Could not upload image.") as Error & { code?: string };
    error.code = data.code ?? "unknown";
    throw error;
  }

  return data;
}
