import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const pagePath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const reportPath = "component-detail-system-parse-repair-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const source = readText(pagePath);
const sourceFile = ts.createSourceFile(
  pagePath,
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);

const problems = [];

for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
  const pos = diagnostic.start ?? 0;
  const lineInfo = sourceFile.getLineAndCharacterOfPosition(pos);
  const line = lineInfo.line + 1;
  const col = lineInfo.character + 1;
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

  problems.push(`${pagePath}:${line}:${col} TS${diagnostic.code}: ${message}`);
}

const requiredMarkers = [
  "export function UniversalComponentDocPage",
  "export function ComponentDetailPage",
  "function NativeVisual",
  "function buildCode",
  "function createPropsRows",
  "function createStylesRows"
];

for (const marker of requiredMarkers) {
  if (!source.includes(marker)) {
    problems.push(`Missing marker after restore: ${marker}`);
  }
}

const lines = [
  "# Component Detail System Parse Repair Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Verified markers",
  "",
  ...requiredMarkers.map((marker) => `- ${source.includes(marker)} :: ${marker}`),
  "",
  "## Applied",
  "",
  "- Restored UniversalComponentDocPage.tsx from the latest pre-step320 backup when available.",
  "- If no backup existed, restored it from git HEAD.",
  "- Verified TSX parse diagnostics before continuing."
];

writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");

console.log(lines.join("\n"));

if (problems.length > 0) {
  process.exitCode = 1;
}
