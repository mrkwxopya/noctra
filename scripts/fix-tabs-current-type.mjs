import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const target = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const reportPath = "tabs-current-typefix-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let text = readText(target);

if (!text) {
  throw new Error(`${target} missing or empty.`);
}

const before = text;

text = text.replace(
  /const current = tabs\.find\(\(tab\) => tab\.id === active\) \?\? tabs\[0\];/g,
  `const current = (tabs.find((tab) => tab.id === active) ?? tabs[0])!;`
);

text = text.replace(
  /aria-selected=\{tab\.id === current\.id\}/g,
  `aria-selected={tab.id === current.id}`
);

text = text.replace(
  /data-active=\{tab\.id === current\.id \? "true" : "false"\}/g,
  `data-active={tab.id === current.id ? "true" : "false"}`
);

text = text.replace(
  /aria-hidden=\{tab\.id === current\.id \? "false" : "true"\}/g,
  `aria-hidden={tab.id === current.id ? "false" : "true"}`
);

text = text.replace(
  /\{tab\.id === current\.id \? tab\.node : null\}/g,
  `{tab.id === current.id ? tab.node : null}`
);

writeText(target, text);

const after = readText(target);
const problems = [];

if (!after.includes("const current = (tabs.find((tab) => tab.id === active) ?? tabs[0])!;")) {
  problems.push("Current tab non-null assertion was not applied.");
}

if (!after.includes("tab.id === current.id ? tab.node : null")) {
  problems.push("Active-only tab content render check missing.");
}

if (!after.includes('data-active={tab.id === current.id ? "true" : "false"}')) {
  problems.push("Tab data-active state missing.");
}

const result = ts.transpileModule(after, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: target
});

for (const diagnostic of result.diagnostics ?? []) {
  problems.push(`${target} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Tabs Current Typefix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === after ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added non-null assertion for current active tab after tabs.length guard.",
  "- Kept Documentation / Props / Styles API as separate active-only panels.",
  "- Kept inactive tab panels hidden below active content."
].join("\n");

writeText(reportPath, report);

console.log(`Tabs current typefix completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Tabs current typefix failed.");
}
