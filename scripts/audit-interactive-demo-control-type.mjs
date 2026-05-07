import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/components/InteractiveComponentDemo.tsx";
const text = existsSync(file) ? readFileSync(file, "utf8").replace(/^\uFEFF/, "") : "";
const problems = [];

if (!text.includes("function getControls(component: NoctraDocsComponent): string[]")) {
  problems.push("getControls must return string[].");
}

if (!text.includes("const controls: unknown[]")) {
  problems.push("preset controls must be normalized as unknown[].");
}

if (!text.includes("useMemo<string[]>")) {
  problems.push("controls useMemo must be typed as string[].");
}

if (text.includes("controls.map((control) =>")) {
  problems.push("controls.map still has implicit-any control parameter.");
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
  "# Interactive Demo Control Type Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync("interactive-demo-control-type-report.md", `${report}\n`, "utf8");

console.log(`Interactive demo control type audit completed. Problems: ${problems.length}. Report: interactive-demo-control-type-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Interactive demo control type audit failed.");
}