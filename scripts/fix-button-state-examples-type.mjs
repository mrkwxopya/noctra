import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/pages/ButtonReferencePage.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let text = readText(file);

if (!text) {
  throw new Error(`Missing or empty ${file}`);
}

const before = text;

const labelsLine = 'const labels = ["Button", "Save changes", "Continue", "Delete"] as const;';

const typedExamples = `${labelsLine}

const buttonStateExamples: Array<{ label: string; state: ButtonPlaygroundState }> = [
  { label: "Default", state: { ...defaultButtonState, children: "Default" } },
  { label: "Disabled", state: { ...defaultButtonState, disabled: true, children: "Disabled" } },
  { label: "Loading", state: { ...defaultButtonState, loading: true, children: "Loading" } },
  { label: "Danger", state: { ...defaultButtonState, tone: "danger", children: "Delete" } }
];`;

if (!text.includes("const buttonStateExamples")) {
  text = text.replace(labelsLine, typedExamples);
}

const inlineExamplesPattern = /\{\s*\[\s*\{ label: "Default", state: \{ \.\.\.defaultButtonState, children: "Default" \} \},\s*\{ label: "Disabled", state: \{ \.\.\.defaultButtonState, disabled: true, children: "Disabled" \} \},\s*\{ label: "Loading", state: \{ \.\.\.defaultButtonState, loading: true, children: "Loading" \} \},\s*\{ label: "Danger", state: \{ \.\.\.defaultButtonState, tone: "danger", children: "Delete" \} \}\s*\]\.map\(\(example\) => \(/m;

text = text.replace(inlineExamplesPattern, "{buttonStateExamples.map((example) => (");

writeText(file, text);

const remaining = [];

if (!text.includes("const buttonStateExamples: Array<{ label: string; state: ButtonPlaygroundState }>")) {
  remaining.push("missing typed buttonStateExamples");
}

if (/\[\s*\{ label: "Default", state: \{ \.\.\.defaultButtonState/.test(text)) {
  remaining.push("inline untyped state examples still remain");
}

const diagnostics = ts.transpileModule(text, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: file
}).diagnostics ?? [];

const syntaxProblems = diagnostics.map((diagnostic) => {
  return `TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
});

const report = [
  "# Button State Examples Typefix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === text ? "no" : "yes"}`,
  `Remaining problems: ${remaining.length}`,
  `Syntax problems: ${syntaxProblems.length}`,
  "",
  "## Remaining problems",
  "",
  ...(remaining.length > 0 ? remaining.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Syntax problems",
  "",
  ...(syntaxProblems.length > 0 ? syntaxProblems.map((item) => `- ${item}`) : ["- None"])
].join("\n");

writeFileSync("button-state-examples-typefix-report.md", `${report}\n`, "utf8");

console.log(`Button state examples typefix completed. Remaining: ${remaining.length}. Syntax problems: ${syntaxProblems.length}. Report: button-state-examples-typefix-report.md`);

if (remaining.length > 0 || syntaxProblems.length > 0) {
  console.error(report);
  throw new Error("Button state examples typefix failed.");
}