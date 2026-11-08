import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export → served by nginx on the Oracle VM (no Node server needed).
  output: "export",
  images: { unoptimized: true },
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
