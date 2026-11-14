export function imageRemotePatterns(r2PublicUrl?: string) {
  const patterns = [{ protocol: "https" as const, hostname: "res.cloudinary.com", port: "", pathname: "/**" }];
  if (r2PublicUrl) {
    const url = new URL(r2PublicUrl);
    if (url.protocol !== "https:" || url.username || url.password || url.port || url.pathname !== "/" || url.search || url.hash) {
      throw new Error("R2_PUBLIC_URL must be an HTTPS origin");
    }
    patterns.push({ protocol: "https", hostname: url.hostname, port: "", pathname: "/**" });
  }
  return patterns;
}

export function canOptimizeImage(src: string, r2PublicUrl = process.env.NEXT_PUBLIC_ENTRY_MEDIA_ORIGIN) {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  if (!URL.canParse(src)) return false;
  const url = new URL(src);
  return !url.username && !url.password && imageRemotePatterns(r2PublicUrl).some((pattern) =>
    url.protocol === `${pattern.protocol}:` && url.hostname === pattern.hostname && url.port === pattern.port);
}

export type ImageLoadState = "optimized" | "original" | "failed";
export function nextImageLoadState(state: ImageLoadState): ImageLoadState {
  return state === "optimized" ? "original" : "failed";
}
