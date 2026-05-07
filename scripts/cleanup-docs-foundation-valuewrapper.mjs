import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const reportPath = "docs-foundation-valuewrapper-cleanup-report.md";

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
    .map((entry) => `${entry.index}: ${entry.line.trim()}`);
}

let text = readText(file);

if (!text) {
  throw new Error(`${file} missing or empty.`);
}

const before = text;
const beforeHits = lineHits(text, "ValueWrapper");

text = text.replace(
  /<ValueWrapper\s+\{\.\.\.\(link\.href\s*\?\s*\{\s*href:\s*link\.href\s*\}\s*:\s*\{\s*\}\s*\)\}>\s*\{link\.value\}\s*<\/ValueWrapper>/g,
  `{link.href ? (
                    <a href={link.href}>{link.value}</a>
                  ) : (
                    <span>{link.value}</span>
                  )}`
);

text = text.replace(
  /<ValueWrapper[^>]*>\s*\{link\.value\}\s*<\/ValueWrapper>/g,
  `{link.href ? (
                    <a href={link.href}>{link.value}</a>
                  ) : (
                    <span>{link.value}</span>
                  )}`
);

text = text.replace(
  /const\s+ValueWrapper\s*=\s*\(link\.href\s*\?\s*["']a["']\s*:\s*["']span["']\)\s*as\s*[^;]+;\s*/g,
  ""
);

writeText(file, text);

const after = readText(file);
const afterHits = lineHits(after, "ValueWrapper");
const problems = [];

if (afterHits.length > 0) {
  problems.push(`ValueWrapper still remains: ${afterHits.length}`);
}

if (after.includes("@noctra/react")) {
  problems.push("NoctraMantineDocs.tsx still imports @noctra/react.");
}

if (after.includes("NoctraReact")) {
  problems.push("NoctraMantineDocs.tsx still references NoctraReact.");
}

if (after.includes("ButtonRuntime") || after.includes("TextInputRuntime") || after.includes("InlineCodeRuntime")) {
  problems.push("NoctraMantineDocs.tsx still references runtime component adapters.");
}

if (!after.includes("docsSidebarLinks")) {
  problems.push("NoctraMantineDocs.tsx missing lightweight sidebar links import.");
}

if (!after.includes("ncd2-left-rail")) {
  problems.push("NoctraMantineDocs.tsx missing ncd2-left-rail.");
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
  "# Docs Foundation ValueWrapper Cleanup Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === after ? "no" : "yes"}`,
  `ValueWrapper hits before: ${beforeHits.length}`,
  `ValueWrapper hits after: ${afterHits.length}`,
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

console.log(`Docs foundation ValueWrapper cleanup completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Docs foundation ValueWrapper cleanup failed.");
}
