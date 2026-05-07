import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const generatedFile = "apps/docs/src/generated/noctra-professional-docs.generated.ts";
const presetsFile = "apps/docs/src/data/interactiveDemoPresets.ts";
const presets = existsSync(presetsFile) ? readFileSync(presetsFile, "utf8").replace(/^\uFEFF/, "") : "";
const generated = existsSync(generatedFile) ? readFileSync(generatedFile, "utf8").replace(/^\uFEFF/, "") : "";

const requiredCandidates = [
  "Anchor",
  "Avatar",
  "Clipboard",
  "Code",
  "ColorInput",
  "CreditCard",
  "FileInput",
  "FloatLabel",
  "ResizablePanel",
  "SplitPane",
  "VisuallyHidden",
  "Dock",
  "ClickOutside",
  "Hover",
  "Tooltip",
  "HoverCard",
  "Popover"
];

const generatedNames = new Set();

for (const match of generated.matchAll(/name:\s*"([A-Z][A-Za-z0-9]*)"/g)) {
  if (match[1]) generatedNames.add(match[1]);
}

const problems = [];

for (const name of requiredCandidates) {
  if (!generatedNames.has(name)) continue;

  const pattern = new RegExp(`(^|\\n)\\s*${name}\\s*:`, "m");

  if (!pattern.test(presets)) {
    problems.push(`Missing safe preset: ${name}`);
  }
}

const result = ts.transpileModule(presets, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: presetsFile
});

for (const diagnostic of result.diagnostics ?? []) {
  problems.push(`TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Missing Safe Demo Presets Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  `Generated components scanned: ${generatedNames.size}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync("missing-safe-demo-presets-audit-report.md", `${report}\n`, "utf8");

console.log(`Missing safe demo presets audit completed. Problems: ${problems.length}. Report: missing-safe-demo-presets-audit-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Missing safe demo presets audit failed.");
}