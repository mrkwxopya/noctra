import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const reportPath = "component-special-preview-restore-report.md";

const files = [
  ["apps/docs/src/pages/UniversalComponentDocPage.tsx", ts.ScriptKind.TSX],
  ["apps/docs/src/docs.css", ts.ScriptKind.Unknown],
  ["apps/docs/src/data/componentDocsDetailRegistry.ts", ts.ScriptKind.TS]
];

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const problems = [];

for (const [file, kind] of files) {
  if (!existsSync(file)) {
    problems.push(`Missing file: ${file}`);
    continue;
  }

  if (kind === ts.ScriptKind.Unknown) {
    continue;
  }

  const source = readText(file);
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind);

  for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
    const pos = diagnostic.start ?? 0;
    const lineInfo = sourceFile.getLineAndCharacterOfPosition(pos);
    const line = lineInfo.line + 1;
    const col = lineInfo.character + 1;
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

    problems.push(`${file}:${line}:${col} TS${diagnostic.code}: ${message}`);
  }
}

const page = readText("apps/docs/src/pages/UniversalComponentDocPage.tsx");
const registry = readText("apps/docs/src/data/componentDocsDetailRegistry.ts");

for (const marker of [
  "export function UniversalComponentDocPage",
  "function NativeVisual",
  "function buildCode",
  "function createPropsRows",
  "function createStylesRows"
]) {
  if (!page.includes(marker)) {
    problems.push(`Missing page marker after restore: ${marker}`);
  }
}

for (const marker of [
  "export function getComponentDocsDetail",
  "export function buildComponentSpecificCode",
  "getComponentPreviewKind"
]) {
  if (!registry.includes(marker)) {
    problems.push(`Missing registry marker: ${marker}`);
  }
}

const report = [
  "# Component Special Preview Restore Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Restored UniversalComponentDocPage.tsx from the latest pre-step323 backup when available.",
  "- Restored docs.css from the latest pre-step323 backup when available.",
  "- Removed the broken partial special preview JSX replacement from the working tree.",
  "- Kept componentDocsDetailRegistry.ts from STEP 321.",
  "- Kept registry connection from STEP 322 if it was already committed.",
  "- Verified TSX parse diagnostics before typecheck."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");
console.log(report);

if (problems.length > 0) {
  process.exitCode = 1;
}
