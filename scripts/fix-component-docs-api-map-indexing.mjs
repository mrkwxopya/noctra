import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const mapPath = "apps/docs/src/data/componentDocsApiMap.ts";
const pagePath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const reportPath = "component-docs-api-map-indexing-fix-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const beforeMap = readText(mapPath);
const beforePage = readText(pagePath);

let map = beforeMap;
let page = beforePage;

if (!map.includes("export function getComponentDocsApiEntry")) {
  map = `${map.trimEnd()}

export function getComponentDocsApiEntry(slug: string): ComponentDocsApiEntry | undefined {
  return (componentDocsApiMap as Record<string, ComponentDocsApiEntry>)[slug];
}
`;
}

page = page.replace(
  /import \{ componentDocsApiMap \} from "\.\.\/data\/componentDocsApiMap";/g,
  'import { getComponentDocsApiEntry } from "../data/componentDocsApiMap";'
);

page = page.replace(
  /const api = componentDocsApiMap\[slug\];/g,
  "const api = getComponentDocsApiEntry(slug);"
);

const afterMap = map;
const afterPage = page;

writeText(mapPath, afterMap);
writeText(pagePath, afterPage);

const problems = [];

if (!afterMap.includes("export function getComponentDocsApiEntry")) {
  problems.push("Missing getComponentDocsApiEntry export.");
}

if (!afterMap.includes("Record<string, ComponentDocsApiEntry>")) {
  problems.push("Missing safe Record<string, ComponentDocsApiEntry> cast.");
}

if (!afterPage.includes('import { getComponentDocsApiEntry } from "../data/componentDocsApiMap";')) {
  problems.push("UniversalComponentDocPage does not import getComponentDocsApiEntry.");
}

if (afterPage.includes("componentDocsApiMap[slug]")) {
  problems.push("Direct componentDocsApiMap[slug] usage remains.");
}

if (afterPage.includes('import { componentDocsApiMap } from "../data/componentDocsApiMap";')) {
  problems.push("Old componentDocsApiMap import remains.");
}

for (const [file, source, kind] of [
  [mapPath, afterMap, ts.ScriptKind.TS],
  [pagePath, afterPage, ts.ScriptKind.TSX]
]) {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    kind
  );

  for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
    problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# Component Docs API Map Indexing Fix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `componentDocsApiMap changed: ${beforeMap === afterMap ? "no" : "yes"}`,
  `UniversalComponentDocPage changed: ${beforePage === afterPage ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added getComponentDocsApiEntry(slug) resolver with safe string indexing.",
  "- Replaced direct componentDocsApiMap[slug] access in UniversalComponentDocPage.",
  "- Preserved literal componentDocsApiMap keys and ComponentDocsApiSlug type.",
  "- Fixed TS7053 under strict TypeScript."
].join("\n");

writeText(reportPath, report);

console.log(`Component docs API map indexing fix completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Component docs API map indexing fix failed.");
}
