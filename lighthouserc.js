module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      puppeteerScript: "./lighthouse-auth.js",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/login",
        "http://localhost:3000/admin"
      ],
      numberOfRuns: process.env.CI ? 1 : 3,
      settings: {
        preset: "desktop"
      }
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.75 }],
        "categories:accessibility": ["error", { minScore: 0.90 }],
        "categories:best-practices": ["warn", { minScore: 0.90 }],
        "categories:seo": ["warn", { minScore: 0.90 }]
      }
    },
    upload: {
      target: "filesystem",
      outputDir: "./lhci-reports"
    }
  }
};