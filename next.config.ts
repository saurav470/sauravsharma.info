import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export → served by nginx on the Oracle VM (no Node server needed).
  output: "export",
  images: { unoptimized: true },
  // Tailwind CSS is small: inline it so first paint needs no extra request.
  experimental: { inlineCss: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
