import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function removeExportFunction(source, functionName) {
  const marker = `export function ${functionName}`;
  const start = source.indexOf(marker);

  if (start === -1) return source;

  const braceStart = source.indexOf("{", start);

  if (braceStart === -1) return source;

  let depth = 0;
  let end = braceStart;

  for (; end < source.length; end += 1) {
    const char = source[end];

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) {
      end += 1;
      break;
    }
  }

  return `${source.slice(0, start)}${source.slice(end)}`.replace(/\n{3,}/g, "\n\n");
}

const changed = [];
const replacements = [];

const docsChromePath = "apps/docs/src/components/DocsChrome.tsx";
let docsChrome = readText(docsChromePath);

if (docsChrome) {
  const before = docsChrome;
  docsChrome = removeExportFunction(docsChrome, "CoverageMeter");
  docsChrome = docsChrome
    .replace(/\bCoverageMeter,\s*/g, "")
    .replace(/,\s*CoverageMeter\b/g, "");

  if (docsChrome !== before) {
    writeText(docsChromePath, docsChrome);
    changed.push(docsChromePath);
    replacements.push(`${docsChromePath}: removed CoverageMeter export`);
  }
}

const textReplacementFiles = [
  "apps/docs/src/data/componentExamples.tsx",
  "packages/react/src/components/Stepper/Stepper.tsx"
];

const textReplacements = [
  ["Container preview", "Container layout example"],
  ["Flex preview", "Flex layout example"],
  ["Grid preview", "Grid layout example"],
  ["Code preview", "Inline code example"],
  ["ClickOutside preview", "Click outside interaction example"],
  ["No steps available", "Configure step items to display the workflow."]
];

for (const file of textReplacementFiles) {
  let text = readText(file);

  if (!text) continue;

  const before = text;

  for (const [from, to] of textReplacements) {
    if (text.includes(from)) {
      text = text.split(from).join(to);
      replacements.push(`${file}: ${from} -> ${to}`);
    }
  }

  if (text !== before) {
    writeText(file, text);
    changed.push(file);
  }
}

const remaining = [];

for (const file of [
  "apps/docs/src/components/DocsChrome.tsx",
  "apps/docs/src/data/componentExamples.tsx",
  "packages/react/src/components/Stepper/Stepper.tsx"
]) {
  const text = readText(file);

  for (const forbidden of [
    "Documentation coverage",
    "CoverageMeter",
    "apiCoverageMax",
    "apiCoverageValue",
    "Container preview",
    "Flex preview",
    "Grid preview",
    "Code preview",
    "ClickOutside preview",
    "No steps available"
  ]) {
    if (text.includes(forbidden)) {
      remaining.push(`${file}: ${forbidden}`);
    }
  }
}

const report = [
  "# Final Docs Forbidden Text Cleanup Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed files: ${Array.from(new Set(changed)).length}`,
  `Replacements: ${replacements.length}`,
  `Remaining forbidden terms: ${remaining.length}`,
  "",
  "## Changed files",
  "",
  ...(changed.length > 0 ? Array.from(new Set(changed)).map((file) => `- ${file}`) : ["- None"]),
  "",
  "## Replacements",
  "",
  ...(replacements.length > 0 ? replacements.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Remaining forbidden terms",
  "",
  ...(remaining.length > 0 ? remaining.map((item) => `- ${item}`) : ["- None"])
].join("\n");

writeFileSync("final-docs-forbidden-text-cleanup-report.md", `${report}\n`, "utf8");

console.log(`Final docs forbidden text cleanup completed. Changed files: ${Array.from(new Set(changed)).length}. Remaining: ${remaining.length}. Report: final-docs-forbidden-text-cleanup-report.md`);

if (remaining.length > 0) {
  console.error(report);
  throw new Error("Final docs forbidden text cleanup still has remaining terms.");
}