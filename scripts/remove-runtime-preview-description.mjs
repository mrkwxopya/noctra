import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const runtimePath = "apps/docs/src/components/docs-system/NoctraRuntimeMock.tsx";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "runtime-preview-description-remove-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let runtime = readText(runtimePath);
let css = readText(cssPath);

if (!runtime) {
  throw new Error(`${runtimePath} missing or empty.`);
}

const beforeRuntime = runtime;
const beforeCss = css;

runtime = runtime.replace(/\n\s*const descriptionNode = safeNode\(description\);\s*\n/g, "\n");

runtime = runtime.replace(
  /\n\s*if\s*\(\s*descriptionNode\s*!==\s*undefined\s*\)\s*\{\s*childrenNodes\.push\(\s*createElement\(\s*["']small["']\s*,\s*\{\s*key:\s*["']description["']\s*\}\s*,\s*descriptionNode\s*\)\s*\)\s*;\s*\}\s*/g,
  "\n"
);

runtime = runtime.replace(/\n\s*description,\s*\n/g, "\n");

const cssBlock = `
/* RUNTIME_PREVIEW_DESCRIPTION_REMOVE_START */
.ncr-mock small,.ncr-mock-list{display:none!important}
/* RUNTIME_PREVIEW_DESCRIPTION_REMOVE_END */
`;

const cssPattern = /\/\* RUNTIME_PREVIEW_DESCRIPTION_REMOVE_START \*\/[\s\S]*?\/\* RUNTIME_PREVIEW_DESCRIPTION_REMOVE_END \*\//;

if (css) {
  css = cssPattern.test(css)
    ? css.replace(cssPattern, cssBlock.trim())
    : `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;

  writeText(cssPath, css);
}

writeText(runtimePath, runtime);

const afterRuntime = readText(runtimePath);
const afterCss = readText(cssPath);

const problems = [];

if (afterRuntime.includes("descriptionNode")) {
  problems.push("descriptionNode still exists in runtime mock.");
}

if (afterRuntime.includes('key: "description"') || afterRuntime.includes("key: 'description'")) {
  problems.push("Runtime mock still renders description small text.");
}

if (afterRuntime.match(/createElement\(\s*["']small["']/)) {
  problems.push("Runtime mock still creates a small element.");
}

if (!afterRuntime.includes("className: cx(mockStateClass")) {
  problems.push("Runtime mock state classes are missing.");
}

if (!afterRuntime.includes('"data-variant"') || !afterRuntime.includes('"data-tone"') || !afterRuntime.includes('"data-size"') || !afterRuntime.includes('"data-radius"')) {
  problems.push("Runtime mock state data attributes are missing.");
}

if (afterCss && !afterCss.includes("RUNTIME_PREVIEW_DESCRIPTION_REMOVE_START")) {
  problems.push("CSS fallback block missing.");
}

const result = ts.transpileModule(afterRuntime, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: runtimePath
});

for (const diagnostic of result.diagnostics ?? []) {
  problems.push(`${runtimePath} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Runtime Preview Description Remove Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Runtime changed: ${beforeRuntime === afterRuntime ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Removed descriptionNode from NoctraRuntimeMock.",
  "- Removed createElement('small', { key: 'description' }) rendering.",
  "- Kept state classes/data attributes for universal previews.",
  "- Kept CSS fallback hiding old preview small/list text."
].join("\n");

writeText(reportPath, report);

console.log(`Runtime preview description remove completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Runtime preview description remove failed.");
}
