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

text = text.replace(
  /const tones: ButtonTone\[\] = \["primary", "neutral", "success", "warning", "danger"\];/,
  'const tones = ["primary", "neutral", "success", "warning", "danger"] as const satisfies readonly ButtonTone[];'
);

text = text.replace(
  /const variants: ButtonVariant\[\] = \["filled", "light", "outline", "subtle", "ghost"\];/,
  'const variants = ["filled", "light", "outline", "subtle", "ghost"] as const satisfies readonly ButtonVariant[];'
);

text = text.replace(
  /const sizes: ButtonSize\[\] = \["xs", "sm", "md", "lg", "xl"\];/,
  'const sizes = ["xs", "sm", "md", "lg", "xl"] as const satisfies readonly ButtonSize[];'
);

text = text.replace(
  /const radii: ButtonRadius\[\] = \["none", "sm", "md", "lg", "xl", "full"\];/,
  'const radii = ["none", "sm", "md", "lg", "xl", "full"] as const satisfies readonly ButtonRadius[];'
);

text = text.replace(
  /setState: \(updater: \(current: ButtonPlaygroundState\) => ButtonPlaygroundState\) => void;/,
  "setState: React.Dispatch<React.SetStateAction<ButtonPlaygroundState>>;"
);

if (!text.includes("type Dispatch,")) {
  text = text.replace(
    /type ComponentType,\r?\n\s*type ReactNode/,
    "type ComponentType,\n  type Dispatch,\n  type ReactNode,\n  type SetStateAction"
  );
}

text = text.replace(
  /React\.Dispatch<React\.SetStateAction<ButtonPlaygroundState>>/g,
  "Dispatch<SetStateAction<ButtonPlaygroundState>>"
);

text = text.replace(
  /defaultValue: prop\.defaultValue \|\| "—",/,
  'defaultValue: "—",'
);

text = text.replace(
  /type: <NoctraCodeBlock code=\{prop\.type\} \/>,/,
  "type: <code>{prop.type}</code>,"
);

writeText(file, text);

const remaining = [];

for (const forbidden of [
  "prop.defaultValue",
  "React.Dispatch",
  "React.SetStateAction"
]) {
  if (text.includes(forbidden)) {
    remaining.push(forbidden);
  }
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
  "# Button Docs System Typecheck Fix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === text ? "no" : "yes"}`,
  `Remaining forbidden fragments: ${remaining.length}`,
  `Syntax problems: ${syntaxProblems.length}`,
  "",
  "## Remaining forbidden fragments",
  "",
  ...(remaining.length > 0 ? remaining.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Syntax problems",
  "",
  ...(syntaxProblems.length > 0 ? syntaxProblems.map((item) => `- ${item}`) : ["- None"])
].join("\n");

writeFileSync("button-docs-system-typecheck-fix-report.md", `${report}\n`, "utf8");

console.log(`Button docs system typecheck fix completed. Remaining: ${remaining.length}. Syntax problems: ${syntaxProblems.length}. Report: button-docs-system-typecheck-fix-report.md`);

if (remaining.length > 0 || syntaxProblems.length > 0) {
  console.error(report);
  throw new Error("Button docs system typecheck fix failed.");
}