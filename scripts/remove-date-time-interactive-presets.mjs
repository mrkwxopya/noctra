import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/data/interactiveDemoPresets.ts";
const reportPath = "date-time-interactive-presets-cleanup-report.md";

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

const removedSet = new Set(removedNames);

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function getPropertyName(node) {
  const name = node.name;

  if (!name) return "";

  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return "";
}

function nodeTextContainsRemoved(sourceFile, node) {
  const text = node.getText(sourceFile);
  return removedNames.some((name) => new RegExp(`\\b${name}\\b`).test(text));
}

function cleanupWithAst(source) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  const transformer = (context) => {
    const visit = (node) => {
      if (ts.isObjectLiteralExpression(node)) {
        const properties = node.properties.filter((property) => {
          if (ts.isPropertyAssignment(property) || ts.isMethodDeclaration(property) || ts.isGetAccessorDeclaration(property) || ts.isSetAccessorDeclaration(property)) {
            const propertyName = getPropertyName(property);

            if (removedSet.has(propertyName)) {
              return false;
            }

            if (nodeTextContainsRemoved(sourceFile, property)) {
              return false;
            }
          }

          if (ts.isShorthandPropertyAssignment(property) && removedSet.has(property.name.text)) {
            return false;
          }

          return true;
        });

        return ts.factory.updateObjectLiteralExpression(node, properties);
      }

      if (ts.isArrayLiteralExpression(node)) {
        const elements = node.elements.filter((element) => !nodeTextContainsRemoved(sourceFile, element));
        return ts.factory.updateArrayLiteralExpression(node, elements);
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

  return printer.printFile(transformed);
}

function removeRemainingDateTimeLines(source) {
  const lines = source.split(/\r?\n/);
  const removedLineHits = [];

  const kept = lines.filter((line, index) => {
    const hasRemovedName = removedNames.some((name) => new RegExp(`\\b${name}\\b`).test(line));

    if (hasRemovedName) {
      removedLineHits.push(`${index + 1}: ${line.trim()}`);
      return false;
    }

    return true;
  });

  return {
    text: kept.join("\n"),
    removedLineHits
  };
}

let text = readText(file);

if (!text) {
  throw new Error(`${file} missing or empty.`);
}

const before = text;
const beforeHits = removedNames.flatMap((name) => {
  const regex = new RegExp(`\\b${name}\\b`, "g");
  return Array.from(text.matchAll(regex)).map(() => name);
});

text = cleanupWithAst(text);

let remainingNames = removedNames.filter((name) => new RegExp(`\\b${name}\\b`).test(text));
let removedLineHits = [];

if (remainingNames.length > 0) {
  const lineCleanup = removeRemainingDateTimeLines(text);
  text = lineCleanup.text;
  removedLineHits = lineCleanup.removedLineHits;
}

writeText(file, text);

const afterHits = removedNames.flatMap((name) => {
  const regex = new RegExp(`\\b${name}\\b`, "g");
  return Array.from(text.matchAll(regex)).map(() => name);
});

const problems = [];

if (afterHits.length > 0) {
  problems.push(`Removed date/time component names still remain: ${[...new Set(afterHits)].join(", ")}`);
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

const report = [
  "# Date/Time Interactive Presets Cleanup Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === text ? "no" : "yes"}`,
  `Removed names found before: ${beforeHits.length}`,
  `Removed names found after: ${afterHits.length}`,
  `Fallback line removals: ${removedLineHits.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Removed component names",
  "",
  ...removedNames.map((name) => `- ${name}`),
  "",
  "## Fallback removed lines",
  "",
  ...(removedLineHits.length ? removedLineHits.map((hit) => `- ${hit}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Date/time interactive presets cleanup completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Date/time interactive presets cleanup failed.");
}
