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
      reporter: ["lcov", "text-summary"],},
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



