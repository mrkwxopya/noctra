import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/main.tsx";
const reportPath = "main-docsroute-type-collision-fix-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function lineHits(source, pattern) {
  const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;

  return source
    .split(/\r?\n/)
    .map((line, index) => ({ line, index: index + 1 }))
    .filter((entry) => regex.test(entry.line))
    .map((entry) => `${entry.index}: ${entry.line.trim()}`);
}

let text = readText(file);

if (!text) {
  throw new Error(`${file} missing or empty.`);
}

const before = text;
const beforeHits = [
  ...lineHits(text, /route\s*:\s*typeof\s+DocsRoute/),
  ...lineHits(text, /route\s*:\s*DocsRoute\b/)
];

text = text
  .replace(/route\s*:\s*typeof\s+DocsRoute/g, "route: string")
  .replace(/route\s*:\s*DocsRoute\b/g, "route: string")
  .replace(/type\s+ResolvedDocsRoute\s*=\s*\{\s*route\s*:\s*typeof\s+DocsRoute\s*;/g, "type ResolvedDocsRoute = { route: string;")
  .replace(/type\s+ResolvedDocsRoute\s*=\s*\{\s*route\s*:\s*DocsRoute\s*;/g, "type ResolvedDocsRoute = { route: string;")
  .replace(/interface\s+ResolvedDocsRoute\s*\{\s*route\s*:\s*typeof\s+DocsRoute\s*;/g, "interface ResolvedDocsRoute { route: string;")
  .replace(/interface\s+ResolvedDocsRoute\s*\{\s*route\s*:\s*DocsRoute\s*;/g, "interface ResolvedDocsRoute { route: string;");

writeText(file, text);

const after = readText(file);
const afterHits = [
  ...lineHits(after, /route\s*:\s*typeof\s+DocsRoute/),
  ...lineHits(after, /route\s*:\s*DocsRoute\b/)
];

const problems = [];

if (afterHits.length > 0) {
  problems.push(`DocsRoute is still used as route type: ${afterHits.length}`);
}

if (after.includes("<typeof DocsRoute>")) {
  problems.push("main.tsx contains invalid <typeof DocsRoute> JSX fragment.");
}

const syntaxResult = ts.transpileModule(after, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: file
});

for (const diagnostic of syntaxResult.diagnostics ?? []) {
  problems.push(`TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# main.tsx DocsRoute Type Collision Fix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === after ? "no" : "yes"}`,
  `Bad route type hits before: ${beforeHits.length}`,
  `Bad route type hits after: ${afterHits.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Hits before",
  "",
  ...(beforeHits.length ? beforeHits.map((hit) => `- ${hit}`) : ["- None"]),
  "",
  "## Hits after",
  "",
  ...(afterHits.length ? afterHits.map((hit) => `- ${hit}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Kept DocsRoute as a component export.",
  "- Restored route id type to string.",
  "- Removed invalid route: typeof DocsRoute typing."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`main.tsx DocsRoute type collision fix completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("main.tsx DocsRoute type collision fix failed.");
}
