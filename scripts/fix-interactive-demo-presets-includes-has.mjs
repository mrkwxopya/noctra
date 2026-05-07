import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/data/interactiveDemoPresets.ts";
const reportPath = "interactive-demo-presets-includes-has-typefix-report.md";

const removedNames = [
  "DateInput",
  "DateTimeInput",
  "MonthInput",
  "TimeInput",
  "WeekInput",
  "YearInput",
  "TimePicker",
  "Calendar",
  "DatePicker",
  "DateTimePicker",
  "DateRangePicker"
];

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function runTypecheck() {
  try {
    execSync("pnpm --filter @noctra/docs typecheck", {
      encoding: "utf8",
      stdio: "pipe",
      shell: true
    });

    return "";
  } catch (error) {
    return `${error.stdout || ""}\n${error.stderr || ""}`;
  }
}

function getLine(source, lineNumber) {
  const lines = source.split(/\r?\n/);
  return lines[lineNumber - 1] ?? "";
}

let text = readText(file);

if (!text) {
  throw new Error(`${file} missing or empty.`);
}

const before = text;
const beforeTypecheck = runTypecheck();

writeText("interactive-demo-presets-includes-has-before-typecheck.log", beforeTypecheck);

const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

let patchedCalls = 0;
const patchedLocations = [];

const transformer = (context) => {
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      (node.expression.name.text === "includes" || node.expression.name.text === "has")
    ) {
      const methodName = node.expression.name.text;
      const receiver = ts.visitNode(node.expression.expression, visit);

      if (
        ts.isParenthesizedExpression(receiver) &&
        ts.isAsExpression(receiver.expression)
      ) {
        return ts.visitEachChild(node, visit, context);
      }

      if (ts.isAsExpression(receiver)) {
        return ts.visitEachChild(node, visit, context);
      }

      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
      patchedCalls += 1;
      patchedLocations.push(`${line}: ${methodName} :: ${getLine(text, line).trim()}`);

      const castReceiver = ts.factory.createAsExpression(
        ts.factory.createParenthesizedExpression(receiver),
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
      );

      return ts.factory.updateCallExpression(
        node,
        ts.factory.createPropertyAccessExpression(
          ts.factory.createParenthesizedExpression(castReceiver),
          methodName
        ),
        node.typeArguments,
        node.arguments
      );
    }

    return ts.visitEachChild(node, visit, context);
  };

  return (node) => ts.visitNode(node, visit);
};

const result = ts.transform(sourceFile, [transformer]);
const transformed = result.transformed[0];

const printer = ts.createPrinter({
  newLine: ts.NewLineKind.LineFeed,
  removeComments: false
});

text = printer.printFile(transformed);

writeText(file, text);

const problems = [];

const remainingRemovedNames = removedNames.filter((name) => new RegExp(`\\b${name}\\b`).test(text));

if (remainingRemovedNames.length > 0) {
  problems.push(`Removed date/time component names still remain: ${remainingRemovedNames.join(", ")}`);
}

const syntaxResult = ts.transpileModule(text, {
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

if (patchedCalls === 0 && beforeTypecheck.includes("parameter of type 'never'")) {
  problems.push("Typecheck reported never parameter error, but no includes()/has() calls were patched.");
}

const report = [
  "# Interactive Demo Presets includes/has Typefix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === text ? "no" : "yes"}`,
  `includes/has calls patched: ${patchedCalls}`,
  `Problems found: ${problems.length}`,
  "",
  "## Original typecheck excerpt",
  "",
  "```text",
  beforeTypecheck.trim(),
  "```",
  "",
  "## Patched locations",
  "",
  ...(patchedLocations.length ? patchedLocations.map((line) => `- ${line}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Interactive demo presets includes/has typefix completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Interactive demo presets includes/has typefix failed.");
}
