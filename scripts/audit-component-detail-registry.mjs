import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const registryPath = "apps/docs/src/data/componentDocsDetailRegistry.ts";
const reportPath = "component-detail-registry-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const source = readText(registryPath);
const sourceFile = ts.createSourceFile(
  registryPath,
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
);

const markers = [
  "export type ComponentDocsKind",
  "export type ComponentDocsDetail",
  "const propsByKind",
  "const stylesByKind",
  "export function getComponentDocsKind",
  "export function getComponentPreviewKind",
  "export function getComponentDocsAnatomy",
  "export function getComponentDocsAccessibility",
  "export function getComponentDocsDetail",
  "export function buildComponentSpecificCode",
  "buttonLike",
  "selection-list",
  "overlay-interactive",
  "credit-card"
];

const problems = [];

for (const marker of markers) {
  if (!source.includes(marker)) {
    problems.push(`Missing marker: ${marker}`);
  }
}

for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
  problems.push(`${registryPath} TS${diagnostic.code}: ${message}`);
}

const report = [
  "# Component Detail Registry Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Markers checked: ${markers.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added component-specific docs data registry.",
  "- Added category resolver for component docs.",
  "- Added props data closer to real component APIs.",
  "- Added Styles API data for each component category.",
  "- Added anatomy and accessibility data.",
  "- Added preview kind resolver for special previews.",
  "- Added code generator foundation for future configurator integration."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");
console.log(report);

if (problems.length > 0) {
  process.exitCode = 1;
}
