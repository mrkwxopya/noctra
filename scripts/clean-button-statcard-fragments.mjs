import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/pages/ButtonReferencePage.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function removeStatCardImport(source) {
  return source
    .replace(/^\s*StatCard,\s*\r?\n/gm, "")
    .replace(/,\s*StatCard\b/g, "")
    .replace(/\bStatCard,\s*/g, "");
}

function selfClosePageHeroBlocksContainingStatCard(source) {
  let text = source;
  let cursor = 0;

  while (true) {
    const start = text.indexOf("<PageHero", cursor);
    if (start === -1) break;

    const openEnd = text.indexOf(">", start);
    if (openEnd === -1) break;

    const openTag = text.slice(start, openEnd + 1);

    if (/\/>\s*$/.test(openTag)) {
      cursor = openEnd + 1;
      continue;
    }

    const closeStart = text.indexOf("</PageHero>", openEnd);
    if (closeStart === -1) break;

    const closeEnd = closeStart + "</PageHero>".length;
    const block = text.slice(start, closeEnd);

    if (block.includes("StatCard")) {
      const selfClosed = openTag.replace(/>\s*$/, " />");
      text = `${text.slice(0, start)}${selfClosed}${text.slice(closeEnd)}`;
      cursor = start + selfClosed.length;
      continue;
    }

    cursor = closeEnd;
  }

  return text;
}

function removeLooseStatCardGrid(source) {
  let text = source;

  text = text.replace(
    /\n\s*<div\s+className="nd-stats-grid">[\s\S]*?<StatCard[\s\S]*?<\/div>\s*/g,
    "\n"
  );

  text = text.replace(/^\s*<StatCard\b[\s\S]*?\/>\s*\r?\n/gm, "");

  return text;
}

function getLineHits(source, terms) {
  const lines = source.split(/\r?\n/);
  const hits = [];

  for (const term of terms) {
    lines.forEach((line, index) => {
      if (line.includes(term)) {
        hits.push(`${file}:${index + 1}: ${term}: ${line.trim()}`);
      }
    });
  }

  return hits;
}

let text = readText(file);

if (!text) {
  throw new Error(`Missing or empty ${file}`);
}

const before = text;

text = removeStatCardImport(text);
text = selfClosePageHeroBlocksContainingStatCard(text);
text = removeLooseStatCardGrid(text);
text = text.replace(/\n{3,}/g, "\n\n");

writeText(file, text);

const forbiddenTerms = [
  "StatCard",
  'Package" value="react"',
  'Export" value="Button"',
  'API" value',
  'Page" value="Curated"'
];

const remaining = getLineHits(text, forbiddenTerms);

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
  "# Button StatCard Fragment Cleanup Report",
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

writeFileSync("button-statcard-fragment-cleanup-report.md", `${report}\n`, "utf8");

console.log(`Button StatCard fragments cleanup completed. Remaining: ${remaining.length}. Syntax problems: ${syntaxProblems.length}. Report: button-statcard-fragment-cleanup-report.md`);

if (remaining.length > 0 || syntaxProblems.length > 0) {
  console.error(report);
  throw new Error("Button StatCard fragment cleanup failed.");
}