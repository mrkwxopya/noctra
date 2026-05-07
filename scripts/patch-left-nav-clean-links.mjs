import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const reportPath = "left-nav-clean-links-report.md";
const foundationPath = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const routingPath = "apps/docs/src/lib/docsRouting.ts";
const mainPath = "apps/docs/src/main.tsx";
const cssPath = "apps/docs/src/docs.css";
const srcRoot = "apps/docs/src";

const changed = [];
const problems = [];

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
  changed.push(path);
}

function replaceExportFunction(source, name, replacement) {
  const fnMarker = `export function ${name}`;
  const constMarker = `export const ${name}`;

  let start = source.indexOf(fnMarker);
  let mode = "function";

  if (start === -1) {
    start = source.indexOf(constMarker);
    mode = "const";
  }

  if (start === -1) {
    return `${source.trimEnd()}\n\n${replacement.trimEnd()}\n`;
  }

  if (mode === "const") {
    const semi = source.indexOf(";", start);
    if (semi === -1) {
      return source;
    }

    return `${source.slice(0, start)}${replacement.trimEnd()}${source.slice(semi + 1)}`;
  }

  const braceStart = source.indexOf("{", start);
  if (braceStart === -1) {
    return source;
  }

  let depth = 0;
  let end = -1;

  for (let index = braceStart; index < source.length; index++) {
    const char = source[index];

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) {
      end = index + 1;
      break;
    }
  }

  if (end === -1) {
    return source;
  }

  return `${source.slice(0, start)}${replacement.trimEnd()}${source.slice(end)}`;
}

function collectFiles(dir) {
  const out = [];

  if (!existsSync(dir)) return out;

  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);

    if (stats.isDirectory()) {
      out.push(...collectFiles(full));
    } else if (/\.(ts|tsx|js|jsx|css)$/.test(full)) {
      out.push(full.replace(/\\/g, "/"));
    }
  }

  return out;
}

function kebab(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

let routing = readText(routingPath);
let foundation = readText(foundationPath);
let main = readText(mainPath);
let css = readText(cssPath);

if (!routing) problems.push(`${routingPath} missing or empty.`);
if (!foundation) problems.push(`${foundationPath} missing or empty.`);
if (!main) problems.push(`${mainPath} missing or empty.`);
if (!css) problems.push(`${cssPath} missing or empty.`);

if (problems.length === 0) {
  if (!routing.includes("NOCTRA_DOCS_BASE")) {
    routing = `export const NOCTRA_DOCS_BASE = "/noctra/";\n\n${routing}`;
  }

  routing = replaceExportFunction(routing, "docsHref", `export function docsHref(path = "/") {
  const cleanPath = normalizeNoctraDocsPath(path);
  return cleanPath === "/" ? "/noctra/" : \`/noctra\${cleanPath}\`;
}`);

  routing = replaceExportFunction(routing, "forceNoctraDocsHref", `export function forceNoctraDocsHref(path = "/") {
  return docsHref(path);
}`);

  routing = replaceExportFunction(routing, "canonicalizeDocsCleanRoute", `export function canonicalizeDocsCleanRoute(pathname = "/", hash = "") {
  const hashValue = String(hash || "");

  if (hashValue.startsWith("#/")) {
    return normalizeNoctraDocsPath(hashValue.slice(1));
  }

  return normalizeNoctraDocsPath(pathname);
}`);

  if (!routing.includes("function normalizeNoctraDocsPath")) {
    routing = `${routing.trimEnd()}

export function normalizeNoctraDocsPath(path = "/") {
  let value = String(path || "/").trim();

  if (!value) value = "/";
  if (value.startsWith("#/")) value = value.slice(1);
  if (value.startsWith("#")) value = value.slice(1);
  if (value.startsWith("/noctra/")) value = value.slice("/noctra".length);
  if (value === "/noctra") value = "/";
  if (!value.startsWith("/")) value = \`/\${value}\`;

  value = value.replace(/\\/+/g, "/");

  return value === "" ? "/" : value;
}
`;
  }

  writeText(routingPath, routing);

  if (!foundation.includes("../../generated/noctra-professional-docs.generated")) {
    foundation = foundation.replace(
      'import * as NoctraReact from "@noctra/react";',
      'import * as NoctraReact from "@noctra/react";\nimport { noctraDocsComponents } from "../../generated/noctra-professional-docs.generated";\nimport { docsHref } from "../../lib/docsRouting";'
    );
  }

  if (!foundation.includes("function getNoctraDocsComponentHref")) {
    foundation = foundation.replace(
      "export type NoctraDocsTabId",
`function getNoctraDocsComponentHref(component: any) {
  const slug = component.slug || component.id || kebabComponentName(component.name);
  return docsHref(\`/components/\${slug}\`);
}

function kebabComponentName(value: unknown) {
  return String(value || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\\s_]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

const docsPrimaryLinks = [
  { label: "Overview", href: docsHref("/") },
  { label: "Getting started", href: docsHref("/getting-started") },
  { label: "Components", href: docsHref("/components") },
  { label: "Layout", href: docsHref("/layout") },
  { label: "Tokens", href: docsHref("/tokens") },
  { label: "Accessibility", href: docsHref("/accessibility") },
  { label: "Architecture", href: docsHref("/architecture") },
  { label: "Theming", href: docsHref("/theming") },
  { label: "Quality", href: docsHref("/quality") },
  { label: "Release", href: docsHref("/release") }
] as const;

const docsComponentLinks = [...noctraDocsComponents]
  .sort((a: any, b: any) => String(a.name).localeCompare(String(b.name)))
  .map((component: any) => ({
    label: String(component.name),
    href: getNoctraDocsComponentHref(component)
  }));

export type NoctraDocsTabId`
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

  foundation = foundation.replace(
`    <div className="ncd2-shell" data-noctra-docs-system="shell">
      <main className="ncd2-main">{children}</main>`,
`    <div className="ncd2-shell" data-noctra-docs-system="shell">
      <aside className="ncd2-left-rail">
        <NoctraDocsSidebar />
      </aside>

      <main className="ncd2-main">{children}</main>`
  );

  writeText(foundationPath, foundation);

  if (!main.includes("sanitizeNoctraHashRoute")) {
    main = main.replace(
      /(^import[\s\S]*?;\s*)/m,
      `$1
function sanitizeNoctraHashRoute() {
  if (typeof window === "undefined") return;

  const hash = window.location.hash;

  if (!hash.startsWith("#/")) return;

  const cleanPath = hash.slice(1);
  const nextPath = cleanPath === "/" ? "/noctra/" : \`/noctra\${cleanPath}\`;
  const nextUrl = \`\${nextPath}\${window.location.search || ""}\`;

  window.history.replaceState(null, "", nextUrl);
}

sanitizeNoctraHashRoute();

`
    );
  }

  writeText(mainPath, main);

  const files = collectFiles(srcRoot);
  let hashRewrites = 0;

  for (const file of files) {
    let source = readText(file);
    const before = source;

    source = source
      .replace(/href="#\/([^"]*)"/g, (_match, route) => `href={docsHref("/${route}")}`)
      .replace(/href='\#\/([^']*)'/g, (_match, route) => `href={docsHref("/${route}")}`)
      .replace(/"#\/([^"]*)"/g, (_match, route) => `docsHref("/${route}")`)
      .replace(/'\#\/([^']*)'/g, (_match, route) => `docsHref("/${route}")`);

    if (source !== before) {
      hashRewrites += 1;
      writeText(file, source);
    }
  }

  const shellCss = `
/* NOCTRA_LEFT_NAV_AND_CLEAN_LINKS_START */
.ncd2-shell{grid-template-columns:220px minmax(0,760px) 230px!important;max-width:1340px!important}
.ncd2-left-rail{display:block!important;position:sticky!important;top:88px!important;align-self:start!important;min-width:0!important}
.ncd2-left-nav{display:flex!important;flex-direction:column!important;gap:22px!important;max-height:calc(100vh - 112px)!important;overflow:auto!important;padding-right:14px!important}
.ncd2-left-nav-section{display:flex!important;flex-direction:column!important;gap:3px!important}
.ncd2-left-nav-section h3{font-size:12px!important;margin:0 0 8px!important;color:var(--nc-text,#fff)!important}
.ncd2-left-nav-section a{display:block!important;padding:6px 8px!important;border-radius:8px!important;color:var(--nc-text-muted,#a7b2c3)!important;text-decoration:none!important;font-size:13px!important;line-height:1.25!important}
.ncd2-left-nav-section a:hover{background:rgba(148,163,184,.1)!important;color:var(--nc-text,#fff)!important}
@media (max-width:1320px){.ncd2-shell{grid-template-columns:minmax(0,760px) 230px!important;max-width:1070px!important}.ncd2-left-rail{display:none!important}}
@media (max-width:1180px){.ncd2-shell{grid-template-columns:minmax(0,760px)!important;max-width:808px!important}.ncd2-left-rail,.ncd2-rail{display:none!important}}
/* NOCTRA_LEFT_NAV_AND_CLEAN_LINKS_END */
`;

  const cssBlockPattern = /\/\* NOCTRA_LEFT_NAV_AND_CLEAN_LINKS_START \*\/[\s\S]*?\/\* NOCTRA_LEFT_NAV_AND_CLEAN_LINKS_END \*\//;

  if (cssBlockPattern.test(css)) {
    css = css.replace(cssBlockPattern, shellCss.trim());
  } else {
    css = `${css.trimEnd()}\n\n${shellCss.trim()}\n`;
  }

  writeText(cssPath, css);

  const activeFiles = collectFiles(srcRoot).filter((file) => !file.includes("safety-backups"));
  const hashHits = [];

  for (const file of activeFiles) {
    const source = readText(file);

    if (source.includes("#/")) {
      hashHits.push(file);
    }
  }

  if (hashHits.length > 0) {
    problems.push(`Hash route fragments still exist in active docs source: ${hashHits.join(", ")}`);
  }

  for (const [file, source] of [
    [foundationPath, readText(foundationPath)],
    [routingPath, readText(routingPath)],
    [mainPath, readText(mainPath)]
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
      problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\\n")}`);
    }
  }

  if (!readText(foundationPath).includes("ncd2-left-rail")) {
    problems.push("NoctraMantineDocs.tsx missing ncd2-left-rail.");
  }

  if (!readText(foundationPath).includes("NoctraDocsSidebar")) {
    problems.push("NoctraMantineDocs.tsx missing NoctraDocsSidebar.");
  }

  if (!readText(cssPath).includes(".ncd2-left-nav")) {
    problems.push("docs.css missing .ncd2-left-nav.");
  }

  if (!readText(routingPath).includes('return cleanPath === "/" ? "/noctra/"')) {
    problems.push("docsRouting.ts docsHref does not hard-code /noctra clean route.");
  }

  if (!readText(mainPath).includes("sanitizeNoctraHashRoute")) {
    problems.push("main.tsx missing sanitizeNoctraHashRoute.");
  }
}

const report = [
  "# Left Navigation And Clean Links Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed files: ${changed.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Changed files",
  "",
  ...(changed.length > 0 ? [...new Set(changed)].map((file) => `- ${file}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added left docs navigation rail.",
  "- Added ordered Docs links.",
  "- Added generated component links.",
  "- Forced docsHref to return clean /noctra paths.",
  "- Added hash route sanitizer for old #/ links.",
  "- Added CSS for 3-column desktop docs shell."
].join("\\n");

writeFileSync(reportPath, `${report}\\n`, "utf8");

console.log(`Left navigation and clean links patch completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Left navigation and clean links patch failed.");
}
