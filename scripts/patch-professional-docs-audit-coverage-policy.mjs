import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = "scripts/audit-professional-docs.mjs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function removeTupleByLabel(source, label) {
  let text = source;
  const lowerLabel = label.toLowerCase();

  while (true) {
    const lower = text.toLowerCase();
    const labelIndex = lower.indexOf(lowerLabel);

    if (labelIndex === -1) break;

    const tupleStart = text.lastIndexOf("[", labelIndex);
    if (tupleStart === -1) break;

    let depth = 0;
    let tupleEnd = -1;

    for (let i = tupleStart; i < text.length; i += 1) {
      const char = text[i];

      if (char === "[") depth += 1;
      if (char === "]") depth -= 1;

      if (depth === 0) {
        tupleEnd = i + 1;
        break;
      }
    }

    if (tupleEnd === -1) break;

    while (text[tupleEnd] === "," || text[tupleEnd] === "\r" || text[tupleEnd] === "\n" || text[tupleEnd] === " ") {
      tupleEnd += 1;
    }

    text = `${text.slice(0, tupleStart)}${text.slice(tupleEnd)}`;
  }

  return text;
}

let text = readText(file);

if (!text) {
  throw new Error(`Missing or empty ${file}`);
}

const before = text;

text = removeTupleByLabel(text, "coverage meter");

text = text.replace(
  /\n\s*problems\.push\([^)]*coverage meter[^)]*\);?/gi,
  "\n"
);

text = text.replace(
  /\n\s*warnings\.push\([^)]*coverage meter[^)]*\);?/gi,
  "\n"
);

text = text.replace(
  /\n\s*.*CoverageMeter.*\n/g,
  "\n"
);

text = text.replace(
  /\n\s*.*Documentation coverage.*\n/g,
  "\n"
);

text = text.replace(/\n{3,}/g, "\n\n");

writeText(file, text);

const remaining = [];

for (const forbidden of [
  "coverage meter",
  "CoverageMeter",
  "Documentation coverage",
  "apiCoverageMax",
  "apiCoverageValue"
]) {
  if (text.includes(forbidden)) {
    remaining.push(forbidden);
  }
}

const report = [
  "# Professional Docs Audit Coverage Policy Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "Policy: Coverage meter is no longer a required docs feature.",
  "Reason: Documentation coverage UI was intentionally removed from public docs.",
  "",
  `Changed: ${before === text ? "no" : "yes"}`,
  `Remaining forbidden audit terms: ${remaining.length}`,
  "",
  "## Remaining forbidden audit terms",
  "",
  ...(remaining.length > 0 ? remaining.map((item) => `- ${item}`) : ["- None"])
].join("\n");

writeFileSync("professional-docs-audit-coverage-policy-report.md", `${report}\n`, "utf8");

console.log(`Professional docs audit coverage policy patched. Remaining forbidden terms: ${remaining.length}. Report: professional-docs-audit-coverage-policy-report.md`);

if (remaining.length > 0) {
  console.error(report);
  throw new Error("Professional docs audit still contains coverage meter requirement.");
}