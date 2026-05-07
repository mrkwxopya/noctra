import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/pages/ButtonReferencePage.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function replaceInlineStateExamples(source) {
  const pattern = /\{\s*\[\s*\{ label: "Default", state: \{ \.\.\.defaultButtonState, children: "Default" \} \},\s*\{ label: "Disabled", state: \{ \.\.\.defaultButtonState, disabled: true, children: "Disabled" \} \},\s*\{ label: "Loading", state: \{ \.\.\.defaultButtonState, loading: true, children: "Loading" \} \},\s*\{ label: "Danger", state: \{ \.\.\.defaultButtonState, tone: "danger", children: "Delete" \} \}\s*\]\.map\(\(example\)\s*=>\s*\(/gs;

  let count = 0;

  const text = source.replace(pattern, () => {
    count += 1;
    return "{buttonStateExamples.map((example) => (";
  });

  return { text, count };
}

function ensureTypedExamples(source) {
  if (source.includes("const buttonStateExamples: Array<{ label: string; state: ButtonPlaygroundState }>")) {
    return source;
  }

  const labelsLine = 'const labels = ["Button", "Save changes", "Continue", "Delete"] as const;';

  if (!source.includes(labelsLine)) {
    throw new Error("Could not find labels constant.");
  }

  const typedBlock = `${labelsLine}

const buttonStateExamples: Array<{ label: string; state: ButtonPlaygroundState }> = [
  { label: "Default", state: { ...defaultButtonState, children: "Default" } },
  { label: "Disabled", state: { ...defaultButtonState, disabled: true, children: "Disabled" } },
  { label: "Loading", state: { ...defaultButtonState, loading: true, children: "Loading" } },
  { label: "Danger", state: { ...defaultButtonState, tone: "danger", children: "Delete" } }
];`;

  return source.replace(labelsLine, typedBlock);
}

let text = readText(file);

if (!text) {
  throw new Error(`Missing or empty ${file}`);
}

const before = text;

text = ensureTypedExamples(text);

const result = replaceInlineStateExamples(text);
text = result.text;

writeText(file, text);

const remainingInlineMatches = Array.from(
  text.matchAll(/\{\s*\[\s*\{ label: "Default", state: \{ \.\.\.defaultButtonState, children: "Default" \} \},/gs)
).length;

const hasTypedExamples = text.includes("const buttonStateExamples: Array<{ label: string; state: ButtonPlaygroundState }>");
const usesTypedExamples = text.includes("{buttonStateExamples.map((example) => (");

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

const problems = [];

if (!hasTypedExamples) {
  problems.push("missing typed buttonStateExamples constant");
}

if (!usesTypedExamples) {
  problems.push("Button states section does not use buttonStateExamples.map");
}

if (remainingInlineMatches > 0) {
  problems.push(`inline untyped JSX state examples remain: ${remainingInlineMatches}`);
}

for (const problem of syntaxProblems) {
  problems.push(problem);
}

const report = [
  "# Button Inline State Examples Final Fix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === text ? "no" : "yes"}`,
  `Inline blocks replaced: ${result.count}`,
  `Remaining problems: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((item) => `- ${item}`) : ["- None"])
].join("\n");

writeFileSync("button-inline-state-examples-final-fix-report.md", `${report}\n`, "utf8");

console.log(`Button inline state examples final fix completed. Replaced: ${result.count}. Problems: ${problems.length}. Report: button-inline-state-examples-final-fix-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Button inline state examples final fix failed.");
}