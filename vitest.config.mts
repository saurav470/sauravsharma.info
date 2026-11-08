import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
      // Build-time PNG templates rendered by next/og (Satori), not runtime code.
      exclude: ["app/opengraph-image.tsx", "app/apple-icon.tsx"],
      thresholds: { lines: 80, statements: 80, functions: 80, branches: 70 },
    },
  },
});
