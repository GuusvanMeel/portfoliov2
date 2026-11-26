import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import path from "node:path";

// Server-only code (env guard, admin check, server actions) cannot run in a browser, so it is
// tested in a separate node project. Everything else keeps running in real Chromium.
const nodeTestFiles = ["**/*.server.test.ts", "lib/testEnvironment.test.ts"];

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage/vitest",
      reporter: ["lcov", "text-summary"],
    },
    reporters: ["github-actions"],
    projects: [
      {
        extends: true,
        test: {
          name: "browser",
          include: ["**/*.test.{ts,tsx}"],
          exclude: ["**/node_modules/**", "cypress/**", ...nodeTestFiles],
          browser: {
            provider: playwright(),
            enabled: true,
            // at least one instance is required
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: "node",
          include: nodeTestFiles,
          exclude: ["**/node_modules/**"],
          environment: "node",
        },
      },
    ],
  },
});
