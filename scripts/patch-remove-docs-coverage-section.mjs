import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = "apps/docs/src/pages/ComponentDetailPage.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function removeDocCardByTitle(source, title) {
  let text = source;

  while (text.includes(title)) {
    const titleIndex = text.indexOf(title);
    const start = text.lastIndexOf("<DocCard", titleIndex);
    const endToken = "</DocCard>";
    const end = text.indexOf(endToken, titleIndex);

    if (start === -1 || end === -1) {
      break;
    }

    const removeEnd = end + endToken.length;
    text = `${text.slice(0, start)}${text.slice(removeEnd)}`;
  }

  return text;
}

let text = readText(file);

if (!text) {
  throw new Error(`Missing or empty ${file}`);
}

const before = text;

text = text
  .replace(/\bCoverageMeter,\s*/g, "")
  .replace(/,\s*CoverageMeter\b/g, "")
  .replace(/import\s*\{\s*CoverageMeter\s*\}\s*from\s*["'][^"']+["'];\s*/g, "");

text = text.replace(
  /\s*const apiCoverageMax = 5;\s*const apiCoverageValue = \[[\s\S]*?\]\.filter\(Boolean\)\.length;\s*/m,
  "\n"
);

text = text.replace(
  /\s*const apiCoverageValue = \[[\s\S]*?\]\.filter\(Boolean\)\.length;\s*/m,
  "\n"
);

text = text.replace(
  /\s*const apiCoverageMax = 5;\s*/m,
  "\n"
);

text = removeDocCardByTitle(text, "Documentation coverage");

text = text
  .replace(/\n\s*\n\s*\n/g, "\n\n")
  .replace(/\{\s*,/g, "{")
  .replace(/,\s*\}/g, "}")
  .replace(/,\s*,/g, ",");

writeText(file, text);

const remaining = [
  "Documentation coverage",
  "CoverageMeter",
  "apiCoverageMax",
  "apiCoverageValue"
].filter((term) => text.includes(term));

const report = [
  "# Docs Coverage Removal Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before !== text ? "yes" : "no"}`,
  `Remaining coverage terms: ${remaining.length}`,
  "",
  "## Remaining terms",
  "",
  ...(remaining.length > 0 ? remaining.map((term) => `- ${term}`) : ["- None"])
].join("\n");

writeFileSync("docs-coverage-removal-report.md", `${report}\n`, "utf8");

console.log(`Docs coverage removal completed. Changed: ${before !== text}. Remaining terms: ${remaining.length}. Report: docs-coverage-removal-report.md`);

if (remaining.length > 0) {
  console.error(report);
  throw new Error("Docs coverage removal still has remaining public terms.");
}