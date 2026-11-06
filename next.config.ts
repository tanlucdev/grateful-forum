import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: { optimizePackageImports: ["nextstepjs"] },
};

export default createNextIntlPlugin("./i18n/request.ts")(nextConfig);
