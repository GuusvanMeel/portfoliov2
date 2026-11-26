import { defineConfig } from "cypress";
import fs from "fs";
import path from "path";
import codeCoverageTask from "@cypress/code-coverage/task";
import { loadLocalTestEnvFile, readTestEnvironment } from "./lib/testEnvironment";
import { resetTestDatabase } from "./scripts/resetTestDatabase";

// Tests only ever use the separate test database. Locally the settings come from
// .env.test.local; in CI they are secrets. readTestEnvironment() refuses to start when anything
// is missing or points at the live database.
loadLocalTestEnvFile();

const metricsDir = "cypress/results";
const metricsFile = path.join(metricsDir, "metrics.md");

export default defineConfig({
  allowCypressEnv: true,
  video: true,
  screenshotOnRunFailure: true,
  // No automatic retries: a flaky test must fail visibly.
  retries: { runMode: 0, openMode: 0 },

  e2e: {
    baseUrl: "http://localhost:3000",

    setupNodeEvents(on, config) {
      const testEnvironment = readTestEnvironment();
      codeCoverageTask(on, config);

      fs.mkdirSync(metricsDir, { recursive: true });

      // Reset metrics file at the start of every Cypress run
      fs.writeFileSync(metricsFile, "| Flow | Time |\n|---|---:|\n");

      on("task", {
        async resetTestDatabase() {
          const result = await resetTestDatabase();
          return result.projects;
        },
        logMetric({ name, ms }) {
          fs.appendFileSync(metricsFile, `| ${name} | ${ms} ms |\n`);
          return null;
        },
      });

      config.env.TEST_ADMIN_EMAIL = testEnvironment.adminEmail;
      config.env.TEST_ADMIN_PASSWORD = testEnvironment.adminPassword;
      config.env.TEST_USER_EMAIL = testEnvironment.userEmail;
      config.env.TEST_USER_PASSWORD = testEnvironment.userPassword;

      return config;
    },
  },
});
