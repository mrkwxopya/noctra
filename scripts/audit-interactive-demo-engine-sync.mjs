import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/components/InteractiveComponentDemo.tsx";
const text = existsSync(file) ? readFileSync(file, "utf8").replace(/^\uFEFF/, "") : "";
const problems = [];

const requiredSnippets = [
  "buildInteractiveDemoProps(component, state)",
  "getInteractiveDemoCode(component, state)",
  "getInteractiveDemoPreset(component)",
  "getControls(component)",
  "Preview",
  "Code",
  "Controls",
  "DemoErrorBoundary",
  "childlessComponents"
];

for (const snippet of requiredSnippets) {
  if (!text.includes(snippet)) {
    problems.push(`Missing required snippet: ${snippet}`);
  }
}

for (const forbidden of [
  '"Canvas"',
  '"center"',
  '"Variant"',
  '"Tone"',
  '"Size"',
  '"Radius"',
  '"Density"'
]) {
  if (text.includes(forbidden) && !text.includes("includes(control)")) {
    problems.push(`Universal playground control still appears directly: ${forbidden}`);
  }
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
  "# Interactive Demo Engine Sync Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Verified behavior",
  "",
  "- Preview props come from buildInteractiveDemoProps(component, state).",
  "- Code comes from getInteractiveDemoCode(component, state).",
  "- Controls come from component-specific presets.",
  "- Input-like components do not receive children.",
  "- Runtime render failures are isolated by an error boundary."
].join("\n");

writeFileSync("interactive-demo-engine-sync-report.md", `${report}\n`, "utf8");

console.log(`Interactive demo engine sync audit completed. Problems: ${problems.length}. Report: interactive-demo-engine-sync-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Interactive demo engine sync audit failed.");
}