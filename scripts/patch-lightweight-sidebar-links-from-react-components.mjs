import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const reportPath = "lightweight-sidebar-links-react-components-report.md";
const foundationPath = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const sidebarLinksPath = "apps/docs/src/data/docsSidebarLinks.ts";
const componentsRoot = "packages/react/src/components";

const removedComponents = new Set([
  "DateInput",
  "DateTimeInput",
  "MonthInput",
  "TimeInput",
  "WeekInput",
  "YearInput",
  "TimePicker",
  "Calendar",
  "DatePicker",
  "DateTimePicker",
  "DateRangePicker"
]);

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

function getReactComponents() {
  if (!existsSync(componentsRoot)) {
    problems.push(`${componentsRoot} missing.`);
    return [];
  }

  const entries = readdirSync(componentsRoot)
    .map((entry) => join(componentsRoot, entry))
    .filter((fullPath) => statSync(fullPath).isDirectory())
    .map((fullPath) => fullPath.replace(/\\/g, "/").split("/").pop())
    .filter(Boolean)
    .filter((name) => !removedComponents.has(name))
    .filter((name) => !name.startsWith("_"))
    .sort((a, b) => a.localeCompare(b));

  return entries.map((name) => ({
    label: name,
    href: `/noctra/components/${kebab(name)}`
  }));
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

const componentLinks = getReactComponents();

if (componentLinks.length < 80) {
  problems.push(`Expected at least 80 active component links, found ${componentLinks.length}.`);
}

const sidebarLinksContent = `export const docsPrimaryLinks = ${JSON.stringify(primaryLinks, null, 2)} as const;

export const docsComponentLinks = ${JSON.stringify(componentLinks, null, 2)} as const;
`;

if (problems.length === 0) {
  writeText(sidebarLinksPath, sidebarLinksContent);
}

let foundation = readText(foundationPath);

if (!foundation) {
  problems.push(`${foundationPath} missing or empty.`);
}

if (problems.length === 0) {
  const beforeFoundation = foundation;

  foundation = foundation
    .replace(/^.*noctraDocsComponents.*$/gm, "")
    .replace(/^.*noctra-professional-docs\.generated.*$/gm, "")
    .replace(/^.*noctra-component-registry\.generated.*$/gm, "");

  foundation = foundation.replace(
    /function getNoctraDocsComponentHref[\s\S]*?export type NoctraDocsTabId/,
    "export type NoctraDocsTabId"
  );

  foundation = foundation.replace(
    /function kebabComponentName[\s\S]*?export type NoctraDocsTabId/,
    "export type NoctraDocsTabId"
  );

  foundation = foundation.replace(
    /const docsPrimaryLinks = \[[\s\S]*?\] as const;\s*/g,
    ""
  );

  foundation = foundation.replace(
    /const docsComponentLinks = \[[\s\S]*?\]\s*;\s*/g,
    ""
  );

  foundation = foundation.replace(
    /const docsComponentLinks = \[\.\.\.noctraDocsComponents\][\s\S]*?\}\)\s*;\s*/g,
    ""
  );

  if (!foundation.includes("../../data/docsSidebarLinks")) {
    foundation = foundation.replace(
      'import * as NoctraReact from "@noctra/react";',
      'import * as NoctraReact from "@noctra/react";\nimport { docsComponentLinks, docsPrimaryLinks } from "../../data/docsSidebarLinks";'
    );
  }

  if (!foundation.includes("export function NoctraDocsSidebar")) {
    const sidebarFunction = `
export function NoctraDocsSidebar() {
  return (
    <nav className="ncd2-left-nav" data-noctra-docs-system="left-nav">
      <div className="ncd2-left-nav-section">
        <h3>Docs</h3>
        {docsPrimaryLinks.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>

      <div className="ncd2-left-nav-section">
        <h3>Components</h3>
        {docsComponentLinks.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
`;

    foundation = foundation.replace("export function NoctraDocsShell", `${sidebarFunction}\nexport function NoctraDocsShell`);
  }

  if (!foundation.includes('className="ncd2-left-rail"')) {
    foundation = foundation.replace(
      /(<div\s+className="ncd2-shell"[^>]*>\s*)/,
      `$1
      <aside className="ncd2-left-rail">
        <NoctraDocsSidebar />
      </aside>

      `
    );
  }

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

if (foundationAfter.includes("noctra-component-registry.generated")) {
  problems.push("NoctraMantineDocs.tsx still imports generated component registry.");
}

if (!foundationAfter.includes("docsSidebarLinks")) {
  problems.push("NoctraMantineDocs.tsx does not import docsSidebarLinks.");
}

if (!foundationAfter.includes("ncd2-left-rail")) {
  problems.push("NoctraMantineDocs.tsx missing ncd2-left-rail.");
}

if (!foundationAfter.includes("NoctraDocsSidebar")) {
  problems.push("NoctraMantineDocs.tsx missing NoctraDocsSidebar.");
}

if (!sidebarAfter.includes("docsComponentLinks")) {
  problems.push("docsSidebarLinks.ts missing docsComponentLinks.");
}

for (const removed of removedComponents) {
  if (sidebarAfter.includes(removed)) {
    problems.push(`Removed date/time component still appears in sidebar links: ${removed}`);
  }
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
  "# Lightweight Sidebar Links From React Components Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Component links generated: ${componentLinks.length}`,
  `Changed files: ${changed.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## First component links",
  "",
  ...componentLinks.slice(0, 20).map((item) => `- ${item.label}: ${item.href}`),
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
  "- Generated sidebar component links from packages/react/src/components.",
  "- Removed heavy generated docs import from NoctraMantineDocs.",
  "- Kept left rail and ncd2 shell.",
  "- Prevented runtime recursion from importing generated docs data inside docs foundation."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Lightweight sidebar links from React components completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Lightweight sidebar links from React components failed.");
}
