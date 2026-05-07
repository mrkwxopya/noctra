import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const routing = readText("apps/docs/src/lib/docsRouting.ts");
const main = readText("apps/docs/src/main.tsx");
const problems = [];

if (!routing.includes('export const NOCTRA_DOCS_BASE = "/noctra/"')) {
  problems.push("docsRouting.ts missing hard /noctra/ base export.");
}

for (const name of [
  "docsHref",
  "forceNoctraDocsHref",
  "sanitizeDocsAnchors",
  "isInternalDocsUrl",
  "parseDocsRouteFromLocation",
  "canonicalizeDocsCleanRoute"
]) {
  if (!routing.includes(`function ${name}`) && !routing.includes(`function ${name}`.replace("function", "export function"))) {
    problems.push(`docsRouting.ts missing ${name}.`);
  }
}

if (!main.includes("sanitizeDocsAnchors")) {
  problems.push("main.tsx missing sanitizeDocsAnchors reference.");
}

if (!main.includes("MutationObserver")) {
  problems.push("main.tsx missing MutationObserver anchor sanitizer.");
}

const report = [
  "# Docs Routing Base Repair Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync("docs-routing-base-repair-report.md", `${report}\n`, "utf8");

console.log(`Docs routing base repair audit completed. Problems: ${problems.length}. Report: docs-routing-base-repair-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Docs routing base repair audit failed.");
}