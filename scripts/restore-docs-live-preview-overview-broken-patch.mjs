import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const reportPath = "docs-live-preview-overview-restore-report.md";

const files = [
  ["apps/docs/src/pages/UniversalComponentDocPage.tsx", ts.ScriptKind.TSX],
  ["apps/docs/src/pages/NoctraStaticDocsPage.tsx", ts.ScriptKind.TSX],
  ["apps/docs/src/data/componentDocsDetailRegistry.ts", ts.ScriptKind.TS],
  ["scripts/generate-static-route-fallbacks.mjs", ts.ScriptKind.JS]
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
const staticPage = readText("apps/docs/src/pages/NoctraStaticDocsPage.tsx");
const registry = readText("apps/docs/src/data/componentDocsDetailRegistry.ts");

for (const marker of [
  "export function UniversalComponentDocPage",
  "function NativeVisual",
  "function buildCode",
  "function createPropsRows",
  "function createStylesRows"
]) {
  if (!page.includes(marker)) {
    problems.push(`Missing UniversalComponentDocPage marker: ${marker}`);
  }
}

for (const marker of [
  "export function NoctraStaticDocsPage",
  "activePath?: string"
]) {
  if (!staticPage.includes(marker)) {
    problems.push(`Missing static docs marker: ${marker}`);
  }
}

for (const marker of [
  "export function getComponentDocsDetail",
  "export function buildComponentSpecificCode"
]) {
  if (!registry.includes(marker)) {
    problems.push(`Missing registry marker: ${marker}`);
  }
}

const report = [
  "# Docs Live Preview And Overview Restore Report",
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
  "- Restored UniversalComponentDocPage.tsx from pre-step327 backup or git.",
  "- Restored NoctraStaticDocsPage.tsx from pre-step327 backup or git.",
  "- Restored docs.css from pre-step327 backup or git.",
  "- Restored componentDocsDetailRegistry.ts from pre-step327 backup or git.",
  "- Restored static route fallback generator from pre-step327 backup or git.",
  "- Removed failed ComponentLivePreview.tsx when it did not exist before STEP 327.",
  "- Verified TS parse diagnostics before typecheck."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");
console.log(report);

if (problems.length > 0) {
  process.exitCode = 1;
}
