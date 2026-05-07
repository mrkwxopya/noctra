import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function getImportNames(text, source) {
  const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`import\\s*\\{([\\s\\S]*?)\\}\\s*from\\s*["']${escaped}["'];`, "g");
  const names = [];

  for (const match of text.matchAll(regex)) {
    const block = match[1] ?? "";
    for (const rawName of block.split(",")) {
      const name = rawName
        .trim()
        .replace(/^type\s+/, "")
        .replace(/\s+as\s+.+$/, "");

      if (name) names.push(name);
    }
  }

  return names;
}

function countImportsFrom(text, source) {
  const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`from\\s*["']${escaped}["']`, "g");

  return Array.from(text.matchAll(regex)).length;
}

function requireNames(fileLabel, sourceLabel, actualNames, requiredNames, problems) {
  for (const requiredName of requiredNames) {
    if (!actualNames.includes(requiredName)) {
      problems.push(`${fileLabel} missing ${requiredName} from ${sourceLabel}.`);
    }
  }
}

function forbidNames(fileLabel, sourceLabel, actualNames, forbiddenNames, problems) {
  for (const forbiddenName of forbiddenNames) {
    if (actualNames.includes(forbiddenName)) {
      problems.push(`${fileLabel} incorrectly imports ${forbiddenName} from ${sourceLabel}.`);
    }
  }
}

const files = {
  main: "apps/docs/src/main.tsx",
  chrome: "apps/docs/src/components/DocsChrome.tsx",
  shell: "apps/docs/src/components/DocsShell.tsx",
  components: "apps/docs/src/pages/ComponentsPage.tsx",
  detail: "apps/docs/src/pages/ComponentDetailPage.tsx"
};

const problems = [];

for (const [label, file] of Object.entries(files)) {
  if (!existsSync(file)) {
    problems.push(`Missing ${label}: ${file}`);
  }
}

const main = readText(files.main);
const chrome = readText(files.chrome);
const shell = readText(files.shell);
const components = readText(files.components);
const detail = readText(files.detail);

const mainReact = getImportNames(main, "react");
const mainRouting = getImportNames(main, "./lib/docsRouting");
const chromeReact = getImportNames(chrome, "react");
const chromeRouting = getImportNames(chrome, "../lib/docsRouting");
const chromeGenerated = getImportNames(chrome, "../generated/noctra-professional-docs.generated");
const componentsReact = getImportNames(components, "react");
const componentsRouting = getImportNames(components, "../lib/docsRouting");
const componentsGenerated = getImportNames(components, "../generated/noctra-professional-docs.generated");
const detailChrome = getImportNames(detail, "../components/DocsChrome");
const detailProps = getImportNames(detail, "../data/propDescriptions");
const detailRouting = getImportNames(detail, "../lib/docsRouting");
const detailGenerated = getImportNames(detail, "../generated/noctra-professional-docs.generated");

requireNames("main.tsx", "react", mainReact, ["StrictMode", "useEffect", "useMemo", "useState"], problems);
requireNames("main.tsx", "./lib/docsRouting", mainRouting, [
  "canonicalizeDocsCleanRoute",
  "docsHref",
  "forceNoctraDocsHref",
  "isInternalDocsUrl",
  "parseDocsRouteFromLocation",
  "sanitizeDocsAnchors"
], problems);

if (!main.includes('import { createRoot } from "react-dom/client";')) {
  problems.push("main.tsx missing createRoot import from react-dom/client.");
}

if (!main.includes('import { DocsChrome, type DocsRoute } from "./components/DocsChrome";')) {
  problems.push("main.tsx missing DocsChrome and DocsRoute import.");
}

if (!main.includes('import { noctraDocsComponents } from "./generated/noctra-professional-docs.generated";')) {
  problems.push("main.tsx missing noctraDocsComponents import.");
}

if (countImportsFrom(main, "./lib/docsRouting") !== 1) {
  problems.push("main.tsx must have exactly one ./lib/docsRouting import.");
}

forbidNames("main.tsx", "react", mainReact, [
  "docsHref",
  "noctraDocsComponents",
  "DocsChrome",
  "ComponentDetailPage",
  "ComponentsPage"
], problems);

requireNames("DocsChrome.tsx", "react", chromeReact, ["useMemo", "useState", "ReactNode"], problems);
requireNames("DocsChrome.tsx", "../generated/noctra-professional-docs.generated", chromeGenerated, [
  "noctraDocsComponents",
  "noctraDocsGroups",
  "noctraDocsSummary"
], problems);
requireNames("DocsChrome.tsx", "../lib/docsRouting", chromeRouting, ["docsHref"], problems);

forbidNames("DocsChrome.tsx", "react", chromeReact, ["docsHref", "noctraDocsComponents"], problems);
forbidNames("DocsChrome.tsx", "../lib/docsRouting", chromeRouting, [
  "useMemo",
  "useState",
  "ReactNode",
  "noctraDocsComponents",
  "noctraDocsGroups",
  "noctraDocsSummary"
], problems);

requireNames("ComponentsPage.tsx", "react", componentsReact, ["useMemo", "useState"], problems);
requireNames("ComponentsPage.tsx", "../generated/noctra-professional-docs.generated", componentsGenerated, [
  "noctraDocsComponents",
  "noctraDocsGroups"
], problems);
requireNames("ComponentsPage.tsx", "../lib/docsRouting", componentsRouting, ["docsHref"], problems);

forbidNames("ComponentsPage.tsx", "react", componentsReact, ["noctraDocsComponents", "docsHref"], problems);
forbidNames("ComponentsPage.tsx", "../lib/docsRouting", componentsRouting, ["DocCard", "useMemo", "useState"], problems);

requireNames("ComponentDetailPage.tsx", "../components/DocsChrome", detailChrome, [
  "AnchorList",
  "CodeBlock",
  "CoverageMeter",
  "DataTable",
  "DocCard",
  "PageHero",
  "SectionTitle",
  "StatCard",
  "TagList"
], problems);
requireNames("ComponentDetailPage.tsx", "../data/propDescriptions", detailProps, [
  "getCategoryLabel",
  "getPropDescription"
], problems);
requireNames("ComponentDetailPage.tsx", "../lib/docsRouting", detailRouting, ["docsHref"], problems);
requireNames("ComponentDetailPage.tsx", "../generated/noctra-professional-docs.generated", detailGenerated, [
  "noctraDocsComponents",
  "NoctraDocsComponent"
], problems);

forbidNames("ComponentDetailPage.tsx", "../data/propDescriptions", detailProps, [
  "AnchorList",
  "CodeBlock",
  "CoverageMeter",
  "DataTable",
  "DocCard",
  "PageHero",
  "SectionTitle",
  "StatCard",
  "TagList"
], problems);
forbidNames("ComponentDetailPage.tsx", "../lib/docsRouting", detailRouting, [
  "getCategoryLabel",
  "getPropDescription"
], problems);

if (shell.includes("../data/docsCatalog")) {
  problems.push("DocsShell.tsx still imports removed docsCatalog exports.");
}

if (!shell.includes("export function DocsShell")) {
  problems.push("DocsShell.tsx does not export DocsShell.");
}

const report = [
  "# Docs Import Repair Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Checked Files",
  "",
  ...Object.values(files).map((file) => `- ${existsSync(file) ? "OK" : "MISSING"} ${file}`)
].join("\n");

writeFileSync("docs-import-repair-report.md", `${report}\n`, "utf8");

console.log(`Docs import repair audit completed. Problems: ${problems.length}. Report: docs-import-repair-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error(`Docs import repair audit failed with ${problems.length} problem(s).`);
}
