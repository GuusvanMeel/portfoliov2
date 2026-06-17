import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import path from "node:path";

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
      exclude: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/*.d.ts",
        ".next/**",
        "coverage/**",
        "cypress/**",
        "vitest.config.ts",
      ],},
        reporters: ["github-actions"],
    browser: {
      provider: playwright(),
      enabled: true,
      // at least one instance is required
      instances: [
        { browser: 'chromium' },
      ],
    },
  }
})
// vitest.config.ts



