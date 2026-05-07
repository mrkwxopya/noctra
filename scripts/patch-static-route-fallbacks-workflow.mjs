import { existsSync, readFileSync, writeFileSync } from "node:fs";

const workflowPath = ".github/workflows/docs-pages.yml";
const reportPath = "static-route-fallbacks-workflow-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let workflow = readText(workflowPath);

if (!workflow) {
  throw new Error(`${workflowPath} missing or empty.`);
}

const before = workflow;

if (!workflow.includes("Generate static route fallbacks")) {
  workflow = workflow.replace(
    /(\n\s+- name: Prepare Pages fallback\s*\n\s+shell: bash\s*\n\s+run: \|\n[\s\S]*?console\.log\("Noctra docs artifact asset:", match\[0\]\);\n\s+NODE)/,
    `$1

      - name: Generate static route fallbacks
        run: node scripts/generate-static-route-fallbacks.mjs`
  );
}

if (!workflow.includes("node scripts/generate-static-route-fallbacks.mjs")) {
  throw new Error("Workflow patch failed: static route fallback step missing.");
}

writeText(workflowPath, workflow);

const report = [
  "# Static Route Fallbacks Workflow Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === workflow ? "no" : "yes"}`,
  "",
  "## Applied",
  "",
  "- Added Generate static route fallbacks step after Pages fallback preparation.",
  "- Workflow will upload physical route directories for GitHub Pages deep links."
].join("\n");

writeText(reportPath, report);

console.log(report);
