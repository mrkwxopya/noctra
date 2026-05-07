import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const file = "apps/docs/src/components/MantineStyleComponentDocs.tsx";
const text = readText(file);
const problems = [];

if (!existsSync(file)) {
  problems.push(`Missing ${file}`);
}

const requiredSnippets = [
  "variants.map",
  "tones.map",
  "sizes.map",
  "radii.map",
  "densities.map",
  "All ${component.name} variants",
  "All ${component.name} tones",
  "All ${component.name} sizes",
  "All ${component.name} radius values",
  "All ${component.name} density values",
  "valuesFromProp(component, \"tone\"",
  "valuesFromProp(component, \"radius\"",
  "hasProp(component, \"tone\")",
  "hasProp(component, \"radius\")",
  "PreviewFrame"
];

for (const snippet of requiredSnippets) {
  if (!text.includes(snippet)) {
    problems.push(`Missing coverage snippet: ${snippet}`);
  }
}

if (text.includes("variants[0]") || text.includes("sizes[0]") || text.includes("tones[0]") || text.includes("radii[0]")) {
  problems.push("Unsafe direct first-index access found. Use firstValue instead.");
}

const report = [
  "# Component Example Coverage Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Required Behavior",
  "",
  "- Every component detail page renders all variants.",
  "- Every component detail page renders all tones.",
  "- Every component detail page renders all sizes.",
  "- Every component detail page renders all radius values.",
  "- Every component detail page renders density and supported states.",
  "- Values must be safe under exactOptionalPropertyTypes."
].join("\n");

writeFileSync("docs-component-examples-coverage-report.md", `${report}\n`, "utf8");

console.log(`Component example coverage audit completed. Problems: ${problems.length}. Report: docs-component-examples-coverage-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error(`Component example coverage audit failed with ${problems.length} problem(s).`);
}
