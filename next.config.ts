import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { imageRemotePatterns } from "./lib/entry-media/image-sources";

const nextConfig: NextConfig = {
  agentRules: false,
  images: { remotePatterns: imageRemotePatterns(process.env.R2_PUBLIC_URL) },
  env: { NEXT_PUBLIC_ENTRY_MEDIA_ORIGIN: process.env.R2_PUBLIC_URL ?? "" },
  allowedDevOrigins: ["10.10.151.63"],
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
  experimental: { optimizePackageImports: ["nextstepjs"] },
};

export default createNextIntlPlugin("./i18n/request.ts")(nextConfig);
