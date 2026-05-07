import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function listComponentDirs() {
  const root = "packages/react/src/components";

  if (!existsSync(root)) return [];

  return readdirSync(root)
    .filter((entry) => {
      const fullPath = join(root, entry);
      return statSync(fullPath).isDirectory();
    })
    .filter((entry) => !entry.startsWith("."))
    .sort((a, b) => a.localeCompare(b));
}

function walkFiles(root, extensions = [".ts", ".tsx", ".md", ".mdx", ".json"]) {
  if (!existsSync(root)) return [];

  const output = [];

  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (["node_modules", "dist", ".vite"].includes(entry)) continue;
      output.push(...walkFiles(fullPath, extensions));
      continue;
    }

    if (extensions.some((extension) => entry.endsWith(extension))) {
      output.push(fullPath.replace(/\\/g, "/"));
    }
  }

  return output;
}

function countMatches(text, pattern) {
  return Array.from(text.matchAll(pattern)).length;
}

const componentNames = listComponentDirs();
const docsFiles = [
  ...walkFiles("apps/docs/src"),
  ...["README.md", "CHANGELOG.md"].filter((path) => existsSync(path))
];

const docsTextByFile = new Map(
  docsFiles.map((file) => [file, readText(file)])
);

const rows = [];
const missingFromDocs = [];

for (const componentName of componentNames) {
  const kebabName = toKebabCase(componentName);
  const componentPattern = new RegExp(`\\b${componentName}\\b`, "g");
  const kebabPattern = new RegExp(`\\b${kebabName}\\b`, "g");
  const cssPattern = new RegExp(`nc-${kebabName}`, "g");

  let usageCount = 0;
  const files = [];

  for (const [file, text] of docsTextByFile.entries()) {
    const count =
      countMatches(text, componentPattern) +
      countMatches(text, kebabPattern) +
      countMatches(text, cssPattern);

    if (count > 0) {
      usageCount += count;
      files.push(file);
    }
  }

  const usedInDocs = files.some((file) => file.startsWith("apps/docs/src/"));
  const usedInReadme = files.includes("README.md");
  const usedInChangelog = files.includes("CHANGELOG.md");

  rows.push({
    componentName,
    kebabName,
    usageCount,
    usedInDocs,
    usedInReadme,
    usedInChangelog,
    files
  });

  if (!usedInDocs) {
    missingFromDocs.push(componentName);
  }
}

const report = [
  "# Noctra Docs Component Usage Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Components scanned: ${componentNames.length}`,
  `Docs/source files scanned: ${docsFiles.length}`,
  `Components not referenced in apps/docs/src: ${missingFromDocs.length}`,
  "",
  "## Component Usage Matrix",
  "",
  "| Component | Kebab | Usage count | Docs src | README | CHANGELOG | Files |",
  "|---|---|---:|---|---|---|---|",
  ...rows.map((row) => {
    return `| ${row.componentName} | ${row.kebabName} | ${row.usageCount} | ${row.usedInDocs ? "OK" : "MISSING"} | ${row.usedInReadme ? "OK" : "MISSING"} | ${row.usedInChangelog ? "OK" : "MISSING"} | ${row.files.slice(0, 8).join("<br>") || "-"} |`;
  }),
  "",
  "## Components Missing From Docs Source",
  "",
  ...(missingFromDocs.length > 0 ? missingFromDocs.map((componentName) => `- ${componentName}`) : ["- None"])
].join("\n");

writeFileSync("docs-component-usage-audit-report.md", `${report}\n`, "utf8");

console.log(`Docs component usage audit completed. Components: ${componentNames.length}. Missing docs refs: ${missingFromDocs.length}. Report: docs-component-usage-audit-report.md`);