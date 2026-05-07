import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const foundationPath = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const sidebarLinksPath = "apps/docs/src/data/docsSidebarLinks.ts";
const reportPath = "lightweight-sidebar-links-report.md";

const candidateGeneratedFiles = [
  "apps/docs/src/generated/noctra-component-registry.generated.ts",
  "apps/docs/src/generated/noctra-professional-docs.generated.ts"
];

const changed = [];
const problems = [];

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
  changed.push(path);
}

function kebab(value) {
  return String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function extractComponentsFromText(text) {
  const byName = new Map();

  for (const match of text.matchAll(/\bname\s*:\s*["']([^"']+)["']/g)) {
    const name = match[1];
    const around = text.slice(Math.max(0, match.index - 500), Math.min(text.length, match.index + 800));
    const slugMatch =
      around.match(/\bslug\s*:\s*["']([^"']+)["']/) ||
      around.match(/\bid\s*:\s*["']([^"']+)["']/) ||
      around.match(/\broute\s*:\s*["']\/?components\/([^"']+)["']/);

    const slug = slugMatch ? slugMatch[1].replace(/^components\//, "") : kebab(name);

    if (name && slug && !/date|time|calendar/i.test(name)) {
      byName.set(name, { label: name, href: `/noctra/components/${slug}` });
    }
  }

  return [...byName.values()].sort((a, b) => a.label.localeCompare(b.label));
}

let components = [];
let sourceFileUsed = "";

for (const file of candidateGeneratedFiles) {
  const text = readText(file);

  if (!text) continue;

  const extracted = extractComponentsFromText(text);

  if (extracted.length > components.length) {
    components = extracted;
    sourceFileUsed = file;
  }
}

if (components.length === 0) {
  problems.push("Could not extract component links from generated docs files.");
}

const primaryLinks = [
  { label: "Overview", href: "/noctra/" },
  { label: "Getting started", href: "/noctra/getting-started" },
  { label: "Components", href: "/noctra/components" },
  { label: "Layout", href: "/noctra/layout" },
  { label: "Tokens", href: "/noctra/tokens" },
  { label: "Accessibility", href: "/noctra/accessibility" },
  { label: "Architecture", href: "/noctra/architecture" },
  { label: "Theming", href: "/noctra/theming" },
  { label: "Quality", href: "/noctra/quality" },
  { label: "Release", href: "/noctra/release" }
];

const sidebarContent = `export const docsPrimaryLinks = ${JSON.stringify(primaryLinks, null, 2)} as const;

export const docsComponentLinks = ${JSON.stringify(components, null, 2)} as const;
`;

if (problems.length === 0) {
  writeText(sidebarLinksPath, sidebarContent);
}

let foundation = readText(foundationPath);

if (!foundation) {
  problems.push(`${foundationPath} missing or empty.`);
}

if (problems.length === 0) {
  const beforeFoundation = foundation;

  foundation = foundation
    .replace(/import\s*\{\s*noctraDocsComponents\s*\}\s*from\s*["']\.\.\/\.\.\/generated\/noctra-professional-docs\.generated["'];\n?/g, "")
    .replace(/import\s*\{\s*noctraDocsComponents\s*\}\s*from\s*["']\.\.\/\.\.\/generated\/noctra-component-registry\.generated["'];\n?/g, "")
    .replace(/import\s*\{\s*docsHref\s*\}\s*from\s*["']\.\.\/\.\.\/lib\/docsRouting["'];\n?/g, "");

  if (!foundation.includes("../../data/docsSidebarLinks")) {
    foundation = foundation.replace(
      'import * as NoctraReact from "@noctra/react";',
      'import * as NoctraReact from "@noctra/react";\nimport { docsComponentLinks, docsPrimaryLinks } from "../../data/docsSidebarLinks";'
    );
  }

  foundation = foundation.replace(
    /function getNoctraDocsComponentHref[\s\S]*?const docsComponentLinks = \[[\s\S]*?\]\s*;\s*\n*/m,
    ""
  );

  foundation = foundation.replace(
    /function getNoctraDocsComponentHref[\s\S]*?export type NoctraDocsTabId/m,
    "export type NoctraDocsTabId"
  );

  foundation = foundation.replace(
    /function kebabComponentName[\s\S]*?export type NoctraDocsTabId/m,
    "export type NoctraDocsTabId"
  );

  foundation = foundation.replace(
    /const docsPrimaryLinks = \[[\s\S]*?\] as const;\s*\n*/m,
    ""
  );

  foundation = foundation.replace(
    /const docsComponentLinks = \[[\s\S]*?\]\s*;\s*\n*/m,
    ""
  );

  if (foundation !== beforeFoundation) {
    writeText(foundationPath, foundation);
  }
}

const foundationAfter = readText(foundationPath);
const sidebarAfter = readText(sidebarLinksPath);

if (foundationAfter.includes("noctraDocsComponents")) {
  problems.push("NoctraMantineDocs.tsx still references noctraDocsComponents.");
}

if (foundationAfter.includes("noctra-professional-docs.generated")) {
  problems.push("NoctraMantineDocs.tsx still imports professional docs generated data.");
}

if (!foundationAfter.includes("docsSidebarLinks")) {
  problems.push("NoctraMantineDocs.tsx does not import docsSidebarLinks.");
}

if (!foundationAfter.includes("ncd2-left-rail")) {
  problems.push("NoctraMantineDocs.tsx missing left rail.");
}

if (!sidebarAfter.includes("docsComponentLinks")) {
  problems.push("docsSidebarLinks.ts missing docsComponentLinks.");
}

if (components.length < 50) {
  problems.push(`Expected many component links, extracted only ${components.length}. Source: ${sourceFileUsed || "none"}`);
}

for (const [file, source] of [
  [foundationPath, foundationAfter],
  [sidebarLinksPath, sidebarAfter]
]) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: file.endsWith(".tsx") ? ts.JsxEmit.ReactJSX : ts.JsxEmit.Preserve
    },
    reportDiagnostics: true,
    fileName: file
  });

  for (const diagnostic of result.diagnostics ?? []) {
    problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# Lightweight Sidebar Links Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Generated source used: ${sourceFileUsed || "none"}`,
  `Component links generated: ${components.length}`,
  `Changed files: ${changed.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Changed files",
  "",
  ...(changed.length ? [...new Set(changed)].map((file) => `- ${file}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Generated lightweight plain sidebar links.",
  "- Removed heavy generated docs import from NoctraMantineDocs.",
  "- Kept ncd2 shell layout.",
  "- Avoided runtime circular generated docs graph in docs foundation."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Lightweight sidebar links patch completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Lightweight sidebar links patch failed.");
}
