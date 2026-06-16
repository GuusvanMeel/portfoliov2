import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const REPORT_THRESHOLD = 95;
let needsReport = false;
const selectedReportsDir = path.join(process.cwd(), "lhci-selected-reports");

const manifestPath = path.join(process.cwd(), "lhci-reports", "manifest.json");

if (!fs.existsSync(manifestPath)) {
  throw new Error("No LHCI manifest found at lhci-reports/manifest.json");
}
if (fs.existsSync(selectedReportsDir)) {
  fs.rmSync(selectedReportsDir, { recursive: true, force: true });
}

fs.mkdirSync(selectedReportsDir, { recursive: true });

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

  const performance = formatScore(summary.performance);
  const accessibility = formatScore(summary.accessibility);
  const bestPractices = formatScore(summary["best-practices"]);
  const seo = formatScore(summary.seo);

  const scores = [performance, accessibility, bestPractices, seo];

  const shouldUploadReport = scores.some(
    (score) => typeof score === "number" && score < REPORT_THRESHOLD
  );

  if (shouldUploadReport) {
    needsReport = true;

    if (run.htmlPath && fs.existsSync(run.htmlPath)) {
      const safeName = run.url
        .replace("http://localhost:3000", "")
        .replaceAll("/", "_")
        .replace(/^_$/, "home");

      fs.copyFileSync(
        run.htmlPath,
        path.join(selectedReportsDir, `${safeName}-lighthouse.html`)
      );
    }
  }

  markdown += `| ${run.url} | ${performance} | ${accessibility} | ${bestPractices} | ${seo} |\n`;
}

markdown += "\n";
markdown += "_Scores are based on the representative Lighthouse run per URL._\n";

console.log(markdown);

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
}
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `needs_report=${needsReport}\n`);
}

