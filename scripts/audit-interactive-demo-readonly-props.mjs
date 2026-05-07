import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/data/interactiveDemoPresets.ts";
const text = existsSync(file) ? readFileSync(file, "utf8").replace(/^\uFEFF/, "") : "";
const problems = [];

if (!text.includes("type DemoComponentLike")) {
  problems.push("Missing DemoComponentLike type.");
}

if (!text.includes("props?: readonly {")) {
  problems.push("DemoComponentLike props must be readonly.");
}

if (text.includes("props?: Array<{")) {
  problems.push("DemoComponentLike still uses mutable Array syntax.");
}

if (!text.includes("buildInteractiveDemoProps")) {
  problems.push("Missing buildInteractiveDemoProps export.");
}

if (!text.includes("componentSupports")) {
  problems.push("Missing componentSupports export.");
}

if (!text.includes("getInteractiveDemoCode")) {
  problems.push("Missing getInteractiveDemoCode export.");
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
  "# Interactive Demo Readonly Props Compatibility Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync("interactive-demo-readonly-props-compat-report.md", `${report}\n`, "utf8");

console.log(`Interactive demo readonly props compatibility audit completed. Problems: ${problems.length}. Report: interactive-demo-readonly-props-compat-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Interactive demo readonly props compatibility audit failed.");
}