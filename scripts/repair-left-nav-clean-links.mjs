import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const reportPath = "left-nav-clean-links-repair-report.md";
const foundationPath = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const docsChromePath = "apps/docs/src/components/DocsChrome.tsx";
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

function ensureDocsHrefImport(source, importPath) {
  if (!source.includes("docsHref(")) return source;

  const importRegex = new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*["']${importPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'];`);

  if (importRegex.test(source)) {
    return source.replace(importRegex, (match, names) => {
      const parts = names
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (!parts.includes("docsHref")) {
        parts.push("docsHref");
      }

      return `import { ${parts.join(", ")} } from "${importPath}";`;
    });
  }

  return `import { docsHref } from "${importPath}";\n${source}`;
}

function patchHashLinks(source, importPath) {
  let next = source;

  next = next.replace(/href\s*=\s*["']#\/([^"']*)["']/g, (_match, route) => {
    const clean = `/${String(route || "").replace(/^\/+/, "")}`;
    return `href={docsHref("${clean}")}`;
  });

  next = next.replace(/href\s*:\s*["']#\/([^"']*)["']/g, (_match, route) => {
    const clean = `/${String(route || "").replace(/^\/+/, "")}`;
    return `href: docsHref("${clean}")`;
  });

  next = next.replace(/["']#\/([^"']*)["']/g, (_match, route) => {
    const clean = `/${String(route || "").replace(/^\/+/, "")}`;
    return `docsHref("${clean}")`;
  });

  next = ensureDocsHrefImport(next, importPath);

  return next;
}

let foundation = readText(foundationPath);
let docsChrome = readText(docsChromePath);
let routing = readText(routingPath);
let main = readText(mainPath);
let css = readText(cssPath);

if (!foundation) problems.push(`${foundationPath} missing or empty.`);
if (!docsChrome) problems.push(`${docsChromePath} missing or empty.`);
if (!routing) problems.push(`${routingPath} missing or empty.`);
if (!main) problems.push(`${mainPath} missing or empty.`);
if (!css) problems.push(`${cssPath} missing or empty.`);

if (problems.length === 0) {
  const beforeFoundation = foundation;
  const beforeDocsChrome = docsChrome;
  const beforeRouting = routing;
  const beforeMain = main;
  const beforeCss = css;

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
    const sidebar = `
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

    foundation = foundation.replace("export function NoctraDocsShell", `${sidebar}\nexport function NoctraDocsShell`);
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

  docsChrome = patchHashLinks(docsChrome, "../lib/docsRouting");

  if (!routing.includes("export const NOCTRA_DOCS_BASE")) {
    routing = `export const NOCTRA_DOCS_BASE = "/noctra/";\n${routing}`;
  }

  if (!routing.includes("normalizeNoctraDocsPath")) {
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

  routing = routing.replace(
    /export function docsHref[\s\S]*?\n\}/,
`export function docsHref(path = "/") {
  const cleanPath = normalizeNoctraDocsPath(path);
  return cleanPath === "/" ? "/noctra/" : \`/noctra\${cleanPath}\`;
}`
  );

  if (!routing.includes("export function forceNoctraDocsHref")) {
    routing = `${routing.trimEnd()}

export function forceNoctraDocsHref(path = "/") {
  return docsHref(path);
}
`;
  }

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

  const cssBlock = `
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

  const blockPattern = /\/\* NOCTRA_LEFT_NAV_AND_CLEAN_LINKS_START \*\/[\s\S]*?\/\* NOCTRA_LEFT_NAV_AND_CLEAN_LINKS_END \*\//;

  if (blockPattern.test(css)) {
    css = css.replace(blockPattern, cssBlock.trim());
  } else {
    css = `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;
  }

  if (foundation !== beforeFoundation) writeText(foundationPath, foundation);
  if (docsChrome !== beforeDocsChrome) writeText(docsChromePath, docsChrome);
  if (routing !== beforeRouting) writeText(routingPath, routing);
  if (main !== beforeMain) writeText(mainPath, main);
  if (css !== beforeCss) writeText(cssPath, css);

  const sourceFiles = collectFiles(srcRoot).filter((file) => !file.includes("safety-backups"));
  const hashHits = [];

  for (const file of sourceFiles) {
    const source = readText(file);

    if (source.includes("#/")) {
      hashHits.push(file);
    }
  }

  if (hashHits.length > 0) {
    problems.push(`Hash route fragments still exist in active docs source: ${hashHits.join(", ")}`);
  }

  if (!readText(foundationPath).includes('className="ncd2-left-rail"')) {
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

  for (const [file, source] of [
    [foundationPath, readText(foundationPath)],
    [docsChromePath, readText(docsChromePath)],
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
}

const report = [
  "# Left Navigation And Clean Links Repair Report",
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
  "- Repaired ncd2-left-rail injection.",
  "- Cleaned remaining DocsChrome hash route links.",
  "- Ensured docsHref returns clean /noctra paths.",
  "- Ensured hash route sanitizer exists.",
  "- Ensured left navigation CSS exists."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Left navigation and clean links repair completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Left navigation and clean links repair failed.");
}
