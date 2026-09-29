import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  agentRules: false,
};

export default createNextIntlPlugin("./i18n/request.ts")(nextConfig);
