const maxBytes = 5 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export function validateEntryMediaFile(file: File) {
  if (!allowedMimeTypes.has(file.type) || file.size <= 0 || file.size > maxBytes) {
    throw new Error("Invalid image.");
  }
}
