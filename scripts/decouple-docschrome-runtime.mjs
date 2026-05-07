import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const chromePath = "apps/docs/src/components/DocsChrome.tsx";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "docschrome-runtime-decouple-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const beforeChrome = readText(chromePath);
const beforeCss = readText(cssPath);

if (!beforeChrome) {
  throw new Error(`${chromePath} missing or empty.`);
}

if (!beforeCss) {
  throw new Error(`${cssPath} missing or empty.`);
}

const chrome = `import type { ReactNode } from "react";
import { docsHref } from "../lib/docsRouting";

export type DocsChromeProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

const chromeLinks = [
  { label: "Docs", href: docsHref("/") },
  { label: "Components", href: docsHref("/components") },
  { label: "Architecture", href: docsHref("/architecture") },
  { label: "Tokens", href: docsHref("/tokens") },
  { label: "GitHub", href: "https://github.com/mrkwxopya/noctra", external: true }
] as const;

export function DocsChrome({ children }: DocsChromeProps) {
  return (
    <div className="ncd3-chrome" data-noctra-docs-system="chrome">
      <header className="ncd3-topbar">
        <a className="ncd3-brand" href={docsHref("/")}>
          <span className="ncd3-brand-mark" aria-hidden="true" />
          <span>Noctra</span>
        </a>

        <nav className="ncd3-topnav" aria-label="Main docs navigation">
          {chromeLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="ncd3-content">
        {children}
      </div>
    </div>
  );
}

export default DocsChrome;
`;

writeText(chromePath, chrome);

let css = beforeCss;

const cssBlock = `
/* NOCTRA_DOCSCHROME_NATIVE_RUNTIME_DECOUPLE_START */
.ncd3-chrome{min-height:100vh;background:var(--nc-page-bg,#050812);color:var(--nc-text,#f8fafc)}
.ncd3-topbar{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:18px;min-height:58px;padding:0 24px;border-bottom:1px solid rgba(148,163,184,.14);background:rgba(5,8,18,.86);backdrop-filter:blur(14px)}
.ncd3-brand{display:inline-flex;align-items:center;gap:10px;color:inherit;text-decoration:none;font-weight:800;letter-spacing:-.02em}
.ncd3-brand-mark{width:18px;height:18px;border-radius:6px;background:linear-gradient(135deg,#8b5cf6,#06b6d4);box-shadow:0 0 24px rgba(139,92,246,.35)}
.ncd3-topnav{display:flex;align-items:center;gap:4px;flex-wrap:wrap}
.ncd3-topnav a{display:inline-flex;align-items:center;min-height:32px;padding:0 10px;border-radius:8px;color:var(--nc-text-muted,#a7b2c3);text-decoration:none;font-size:13px}
.ncd3-topnav a:hover{background:rgba(148,163,184,.1);color:var(--nc-text,#f8fafc)}
.ncd3-content{min-width:0}
@media (max-width:760px){.ncd3-topbar{padding:0 14px;align-items:flex-start;flex-direction:column;height:auto;padding-top:12px;padding-bottom:12px}.ncd3-topnav{width:100%}}
/* NOCTRA_DOCSCHROME_NATIVE_RUNTIME_DECOUPLE_END */
`;

const cssPattern = /\/\* NOCTRA_DOCSCHROME_NATIVE_RUNTIME_DECOUPLE_START \*\/[\s\S]*?\/\* NOCTRA_DOCSCHROME_NATIVE_RUNTIME_DECOUPLE_END \*\//;

if (cssPattern.test(css)) {
  css = css.replace(cssPattern, cssBlock.trim());
} else {
  css = `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;
}

writeText(cssPath, css);

const afterChrome = readText(chromePath);
const afterCss = readText(cssPath);
const problems = [];

if (afterChrome.includes("@noctra/react")) {
  problems.push("DocsChrome still imports @noctra/react.");
}

if (afterChrome.includes("NoctraReact")) {
  problems.push("DocsChrome still references NoctraReact.");
}

if (afterChrome.includes("#/")) {
  problems.push("DocsChrome still contains hash route fragment #/.");
}

if (!afterChrome.includes("docsHref")) {
  problems.push("DocsChrome missing docsHref clean routing.");
}

if (!afterChrome.includes("export default DocsChrome")) {
  problems.push("DocsChrome missing default export.");
}

if (!afterCss.includes(".ncd3-topbar")) {
  problems.push("docs.css missing ncd3 topbar styles.");
}

const syntaxResult = ts.transpileModule(afterChrome, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: chromePath
});

for (const diagnostic of syntaxResult.diagnostics ?? []) {
  problems.push(`TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# DocsChrome Runtime Decouple Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Chrome changed: ${beforeChrome === afterChrome ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Replaced DocsChrome with native semantic chrome.",
  "- Removed any possible @noctra/react runtime dependency from global docs chrome.",
  "- Kept clean docsHref links.",
  "- Added lightweight topbar CSS.",
  "- Left component demo/runtime pages untouched."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`DocsChrome runtime decouple completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("DocsChrome runtime decouple failed.");
}
