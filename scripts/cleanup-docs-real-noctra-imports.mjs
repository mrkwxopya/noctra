import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import ts from "typescript";

const srcRoot = "apps/docs/src";
const runtimePath = "apps/docs/src/components/docs-system/NoctraRuntimeMock.tsx";
const reportPath = "docs-real-noctra-import-cleanup-report.md";

const changed = [];
const problems = [];
const realImportHitsBefore = [];
const realImportHitsAfter = [];
const stringHitsAfter = [];

function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  const parent = dirname(path);
  if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
  changed.push(normalizePath(path));
}

function collectFiles(dir) {
  const out = [];

  if (!existsSync(dir)) return out;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const normalized = normalizePath(full);

    if (
      normalized.includes("/dist/") ||
      normalized.includes("/node_modules/") ||
      normalized.includes("/.vite/") ||
      normalized.endsWith("/components/docs-system/NoctraRuntimeMock.tsx")
    ) {
      continue;
    }

    const stats = statSync(full);

    if (stats.isDirectory()) {
      out.push(...collectFiles(full));
    } else if (/\.(ts|tsx|js|jsx)$/.test(full)) {
      out.push(normalized);
    }
  }

  return out;
}

function relativeRuntimeImport(fromFile) {
  let target = normalizePath(relative(dirname(fromFile), runtimePath)).replace(/\.tsx$/, "");

  if (!target.startsWith(".")) {
    target = `./${target}`;
  }

  return target;
}

function getLine(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function findRealNoctraImports(file, source) {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") || file.endsWith(".jsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  const hits = [];

  function visit(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      node.moduleSpecifier.text === "@noctra/react"
    ) {
      hits.push({
        file,
        line: getLine(sourceFile, node),
        start: node.moduleSpecifier.getStart(sourceFile),
        end: node.moduleSpecifier.end,
        text: node.getText(sourceFile).replace(/\s+/g, " ").slice(0, 220)
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return hits;
}

function patchRealNoctraImports(file, source) {
  const hits = findRealNoctraImports(file, source);

  if (hits.length === 0) {
    return {
      source,
      hits
    };
  }

  const runtimeImport = relativeRuntimeImport(file);
  let output = source;

  for (const hit of [...hits].sort((a, b) => b.start - a.start)) {
    const quote = source[hit.start] === "'" ? "'" : '"';
    output = `${output.slice(0, hit.start)}${quote}${runtimeImport}${quote}${output.slice(hit.end)}`;
  }

  return {
    source: output,
    hits
  };
}

const files = collectFiles(srcRoot);

for (const file of files) {
  const source = readText(file);
  const beforeHits = findRealNoctraImports(file, source);

  for (const hit of beforeHits) {
    realImportHitsBefore.push(`${hit.file}:${hit.line}: ${hit.text}`);
  }

  const result = patchRealNoctraImports(file, source);

  if (result.source !== source) {
    writeText(file, result.source);
  }
}

for (const file of files) {
  const source = readText(file);
  const afterHits = findRealNoctraImports(file, source);

  for (const hit of afterHits) {
    realImportHitsAfter.push(`${hit.file}:${hit.line}: ${hit.text}`);
  }

  if (source.includes("@noctra/react")) {
    const lines = source.split(/\r?\n/);

    for (let index = 0; index < lines.length; index++) {
      if (lines[index].includes("@noctra/react")) {
        stringHitsAfter.push(`${file}:${index + 1}: ${lines[index].trim().slice(0, 220)}`);
      }
    }
  }
}

if (realImportHitsAfter.length > 0) {
  problems.push(`Real @noctra/react module imports remain: ${realImportHitsAfter.length}`);
}

const runtimeSource = readText(runtimePath);
const runtimeSyntax = ts.transpileModule(runtimeSource, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: runtimePath
});

for (const diagnostic of runtimeSyntax.diagnostics ?? []) {
  problems.push(`${runtimePath} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Docs Real Noctra Import Cleanup Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Files scanned: ${files.length}`,
  `Real @noctra/react imports before: ${realImportHitsBefore.length}`,
  `Real @noctra/react imports after: ${realImportHitsAfter.length}`,
  `Remaining @noctra/react text hits after: ${stringHitsAfter.length}`,
  `Changed files: ${changed.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Real imports before",
  "",
  ...(realImportHitsBefore.length ? realImportHitsBefore.map((hit) => `- ${hit}`) : ["- None"]),
  "",
  "## Real imports after",
  "",
  ...(realImportHitsAfter.length ? realImportHitsAfter.map((hit) => `- ${hit}`) : ["- None"]),
  "",
  "## Remaining text hits after",
  "",
  ...(stringHitsAfter.length ? stringHitsAfter.slice(0, 80).map((hit) => `- ${hit}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Interpretation",
  "",
  "- Real imports are runtime-affecting and must be zero.",
  "- Remaining text hits are allowed if they are documentation code examples.",
  "- This audit no longer treats code examples as runtime imports."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Docs real Noctra import cleanup completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Docs real Noctra import cleanup failed.");
}
