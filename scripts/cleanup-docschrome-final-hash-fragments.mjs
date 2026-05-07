import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/components/DocsChrome.tsx";
const reportPath = "docschrome-final-hash-cleanup-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function lineHits(source, needle) {
  return source
    .split(/\r?\n/)
    .map((line, index) => ({ line, index: index + 1 }))
    .filter((entry) => entry.line.includes(needle))
    .map((entry) => `${file}:${entry.index}: ${entry.line.trim()}`);
}

let text = readText(file);

if (!text) {
  throw new Error(`${file} missing or empty.`);
}

const before = text;
const beforeHits = lineHits(text, "#/");

text = text
  .replace(/`#\/\$\{([^}]+)\}`/g, "`/${$1}`")
  .replace(/"#\/"\s*\+\s*/g, '"/" + ')
  .replace(/'#\/'\s*\+\s*/g, "'/' + ")
  .replace(/"#\/([^"]*)"/g, '"/$1"')
  .replace(/'#\/([^']*)'/g, "'/$1'")
  .replace(/#\//g, "/");

writeText(file, text);

const afterHits = lineHits(text, "#/");
const problems = [];

if (afterHits.length > 0) {
  problems.push(`Remaining #/ fragments: ${afterHits.length}`);
}

const result = ts.transpileModule(text, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: file
});

for (const diagnostic of result.diagnostics ?? []) {
  problems.push(`TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# DocsChrome Final Hash Cleanup Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === text ? "no" : "yes"}`,
  `Hash hits before: ${beforeHits.length}`,
  `Hash hits after: ${afterHits.length}`,
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
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`DocsChrome final hash cleanup completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("DocsChrome final hash cleanup failed.");
}
