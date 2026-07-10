import type { NextConfig } from "next";
import path from "node:path";
import withBundleAnalyzer from "@next/bundle-analyzer";

const config: NextConfig = {
  reactStrictMode: true,
  // Silence the multi-lockfile warning: pin the tracing root to this project.
  outputFileTracingRoot: path.resolve(),
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(config);
