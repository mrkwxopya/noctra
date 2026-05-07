import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const routingPath = "apps/docs/src/lib/docsRouting.ts";
const reportPath = "docs-routing-compat-exports-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const before = readText(routingPath);

if (!before) {
  throw new Error(`${routingPath} missing or empty.`);
}

let next = before;

const compatBlock = `

/* DOCS_ROUTING_COMPAT_EXPORTS_START */
export const canonicalizeDocsCleanRoute = cleanDocsPath;
export const canonicalizeDocsRoute = cleanDocsPath;
export const canonicalDocsCleanRoute = cleanDocsPath;
export const canonicalDocsRoute = cleanDocsPath;

export const parseDocsRouteFromLocation = resolveDocsRoute;
export const parseDocsRoute = resolveDocsRouteFromPath;
export const getDocsRoute = resolveDocsRoute;
export const getDocsRouteFromPath = resolveDocsRouteFromPath;

export const sanitizeDocsAnchors = rewriteDocsAnchors;
export const sanitizeDocsAnchorHrefs = rewriteDocsAnchors;
export const sanitizeDocsLinks = rewriteDocsAnchors;
export const rewriteDocsAnchorHrefs = rewriteDocsAnchors;
/* DOCS_ROUTING_COMPAT_EXPORTS_END */
`;

const blockPattern = /\/\* DOCS_ROUTING_COMPAT_EXPORTS_START \*\/[\s\S]*?\/\* DOCS_ROUTING_COMPAT_EXPORTS_END \*\//;

if (blockPattern.test(next)) {
  next = next.replace(blockPattern, compatBlock.trim());
} else {
  next = `${next.trimEnd()}${compatBlock}`;
}

writeText(routingPath, next);

const after = readText(routingPath);
const problems = [];

for (const required of [
  "canonicalizeDocsCleanRoute",
  "parseDocsRouteFromLocation",
  "sanitizeDocsAnchors"
]) {
  const pattern = new RegExp(`export const ${required}\\b`);

  if (!pattern.test(after)) {
    problems.push(`Missing compatibility export: ${required}`);
  }
}

if (after.includes("startsWith(docsHref(")) {
  problems.push("Recursive startsWith(docsHref(...)) pattern returned.");
}

if (after.includes("startsWith(Je(")) {
  problems.push("Minified-style recursive startsWith(Je(...)) pattern returned.");
}

const cleanDocsPathBody = after.match(/export function cleanDocsPath[\s\S]*?\n}\n/);

if (cleanDocsPathBody && cleanDocsPathBody[0].includes("docsHref(")) {
  problems.push("cleanDocsPath body still calls docsHref.");
}

const result = ts.transpileModule(after, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext
  },
  reportDiagnostics: true,
  fileName: routingPath
});

for (const diagnostic of result.diagnostics ?? []) {
  problems.push(`${routingPath} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Docs Routing Compatibility Exports Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === after ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Restored compatibility exports",
  "",
  "- canonicalizeDocsCleanRoute",
  "- parseDocsRouteFromLocation",
  "- sanitizeDocsAnchors",
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added compatibility aliases expected by main.tsx.",
  "- Kept cleanDocsPath one-way and non-recursive.",
  "- Did not reintroduce docsHref inside cleanDocsPath."
].join("\n");

writeText(reportPath, report);

console.log(`Docs routing compatibility exports completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Docs routing compatibility exports failed.");
}
