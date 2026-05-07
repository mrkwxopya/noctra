import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/data/docsCatalog.ts";
const reportPath = "docscatalog-docshref-import-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let text = readText(file);

if (!text) {
  throw new Error(`${file} missing or empty.`);
}

const before = text;
const problems = [];

const usesDocsHref = /\bdocsHref\s*\(/.test(text);
const hasDocsHrefImport = /from\s+["']\.\.\/lib\/docsRouting["']/.test(text) && /\bdocsHref\b/.test(
  text.slice(0, Math.max(text.indexOf("from \"../lib/docsRouting\""), text.indexOf("from '../lib/docsRouting'")) + 80)
);

if (usesDocsHref && !hasDocsHrefImport) {
  const routingImportRegex = /import\s*\{([^}]+)\}\s*from\s*["']\.\.\/lib\/docsRouting["'];/;

  if (routingImportRegex.test(text)) {
    text = text.replace(routingImportRegex, (_match, names) => {
      const parts = names
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (!parts.includes("docsHref")) {
        parts.push("docsHref");
      }

      return `import { ${parts.join(", ")} } from "../lib/docsRouting";`;
    });
  } else {
    text = `import { docsHref } from "../lib/docsRouting";\n${text}`;
  }
}

writeText(file, text);

const afterUsesDocsHref = /\bdocsHref\s*\(/.test(text);
const afterHasImport = /import\s*\{[^}]*\bdocsHref\b[^}]*\}\s*from\s*["']\.\.\/lib\/docsRouting["'];/.test(text);

if (afterUsesDocsHref && !afterHasImport) {
  problems.push("docsCatalog.ts uses docsHref but does not import it from ../lib/docsRouting.");
}

if (text.includes("#/")) {
  problems.push("docsCatalog.ts still contains #/ hash route fragments.");
}

const result = ts.transpileModule(text, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.Preserve
  },
  reportDiagnostics: true,
  fileName: file
});

for (const diagnostic of result.diagnostics ?? []) {
  problems.push(`TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# docsCatalog docsHref Import Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === text ? "no" : "yes"}`,
  `Uses docsHref: ${afterUsesDocsHref}`,
  `Has docsHref import: ${afterHasImport}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`docsCatalog docsHref import patch completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("docsCatalog docsHref import patch failed.");
}
