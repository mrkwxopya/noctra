import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/data/interactiveDemoPresets.ts";
const reportPath = "interactive-demo-presets-includes-ast-typefix-report.md";

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

function getLine(source, lineNumber) {
  const lines = source.split(/\r?\n/);
  const index = lineNumber - 1;

  return index >= 0 && index < lines.length ? lines[index] : "";
}

let text = readText(file);

if (!text) {
  throw new Error(`${file} missing or empty.`);
}

const before = text;
const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

let patchedIncludes = 0;
const patchedLocations = [];

const transformer = (context) => {
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === "includes"
    ) {
      const expression = ts.visitNode(node.expression.expression, visit);
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;

      patchedIncludes += 1;
      patchedLocations.push(`${line}: ${getLine(text, line).trim()}`);

      const unknownType = ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
      const readonlyUnknownArrayType = ts.factory.createTypeOperatorNode(
        ts.SyntaxKind.ReadonlyKeyword,
        ts.factory.createArrayTypeNode(unknownType)
      );

      const castExpression = ts.factory.createAsExpression(
        ts.factory.createParenthesizedExpression(expression),
        readonlyUnknownArrayType
      );

      return ts.factory.updateCallExpression(
        node,
        ts.factory.createPropertyAccessExpression(
          ts.factory.createParenthesizedExpression(castExpression),
          "includes"
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

const transpileResult = ts.transpileModule(text, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: file
});

for (const diagnostic of transpileResult.diagnostics ?? []) {
  problems.push(`TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

if (patchedIncludes === 0) {
  problems.push("No includes() calls were patched.");
}

const report = [
  "# Interactive Demo Presets includes AST Typefix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === text ? "no" : "yes"}`,
  `includes() calls patched: ${patchedIncludes}`,
  `Problems found: ${problems.length}`,
  "",
  "## Patched includes locations",
  "",
  ...(patchedLocations.length ? patchedLocations.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Interactive demo presets includes AST typefix completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Interactive demo presets includes AST typefix failed.");
}
