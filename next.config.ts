import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  agentRules: false,
  allowedDevOrigins: ["10.10.151.63"],
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
  experimental: { optimizePackageImports: ["nextstepjs"] },
};

export default createNextIntlPlugin("./i18n/request.ts")(nextConfig);
