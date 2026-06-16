const fs = require("fs");
const path = require("path");

const manifestPath = path.join(process.cwd(), "lhci-reports", "manifest.json");

if (!fs.existsSync(manifestPath)) {
  throw new Error("No LHCI manifest found at lhci-reports/manifest.json");
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const representativeRuns = new Map();

for (const run of manifest) {
  if (run.isRepresentativeRun || !representativeRuns.has(run.url)) {
    representativeRuns.set(run.url, run);
  }
}

const formatScore = (score) => {
  if (typeof score !== "number") return "N/A";
  return Math.round(score * 100);
};

let markdown = "## Lighthouse CI Results\n\n";
markdown += "| URL | Performance | Accessibility | Best Practices | SEO |\n";
markdown += "|---|---:|---:|---:|---:|\n";

for (const run of representativeRuns.values()) {
  const summary = run.summary || {};

  markdown += `| ${run.url} | ${formatScore(summary.performance)} | ${formatScore(
    summary.accessibility
  )} | ${formatScore(summary["best-practices"])} | ${formatScore(
    summary.seo
  )} |\n`;
}

markdown += "\n";
markdown += "_Scores are based on the representative Lighthouse run per URL._\n";

console.log(markdown);

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
}

fs.writeFileSync("lhci-summary.md", markdown);