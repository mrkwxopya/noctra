import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const foundationPath = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const cssPath = "apps/docs/src/docs.css";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let foundation = readText(foundationPath);
let css = readText(cssPath);

if (!foundation) {
  throw new Error(`Missing or empty ${foundationPath}`);
}

if (!css) {
  throw new Error(`Missing or empty ${cssPath}`);
}

const beforeFoundation = foundation;
const beforeCss = css;

const classReplacements = [
  ["nd-related-card", "ncd-card ncd-related-card"],
  ["nd-detail-layout", "ncd-layout"],
  ["nd-detail-main", "ncd-main"],
  ["nd-detail-aside", "ncd-aside"],
  ["nd-doc-section", "ncd-section"],
  ["nd-kicker", "ncd-kicker"],
  ["nd-related-grid", "ncd-grid"],
  ["nd-two-grid", "ncd-two-grid"],
  ["nd-stack", "ncd-stack"],
  ["nd-card", "ncd-card"],
  ["nd-table", "ncd-table"],
  ["nd-code-block", "ncd-code"]
];

for (const [from, to] of classReplacements) {
  foundation = foundation.split(from).join(to);
}

foundation = foundation.replace(/className="ncd-card ncd-related-card"/g, 'className="ncd-card ncd-related-card"');

const cssBlock = '/* NOCTRA_DOCS_SYSTEM_LAYOUT_START */.ncd-layout{display:grid;grid-template-columns:minmax(0,860px) 220px;gap:36px;align-items:start;max-width:1160px;margin:0 auto;padding:34px 24px 90px}.ncd-main{min-width:0}.ncd-aside{position:sticky;top:88px}.ncd-section{margin:0 0 34px}.ncd-section>h1,.ncd-section h1{font-size:42px;line-height:1.08;margin:8px 0 10px;letter-spacing:-.04em}.ncd-section>h2{font-size:24px;line-height:1.2;margin:6px 0 8px;letter-spacing:-.025em}.ncd-section>p,.ncd-card p{max-width:720px;color:var(--nc-text-muted,#a7b2c3);line-height:1.65}.ncd-kicker{font-size:11px;letter-spacing:.11em;text-transform:uppercase;color:var(--nc-color-primary-300,#9b7cff);font-weight:800;margin-bottom:8px}.ncd-card{border:1px solid var(--nc-border-muted,rgba(148,163,184,.18));background:linear-gradient(180deg,rgba(15,23,42,.64),rgba(8,13,24,.72));border-radius:16px;padding:18px;box-shadow:0 1px 0 rgba(255,255,255,.03) inset}.ncd-related-card{min-height:76px;display:flex;flex-direction:column;gap:10px}.ncd-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;align-items:stretch}.ncd-two-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start}.ncd-stack{display:flex;flex-direction:column;gap:14px}.ncd-tabs{margin:4px 0 28px;padding-bottom:14px;border-bottom:1px solid rgba(148,163,184,.18)}.ncd-tabs .ncd-grid{display:flex;gap:8px;flex-wrap:wrap}.ncd-card[data-noctra-docs-system=demo] .ncd-two-grid{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr)}.ncd-card[data-noctra-docs-system=demo] .ncd-grid{display:flex;flex-wrap:wrap;align-items:center;gap:10px}.ncd-card[data-noctra-docs-system=control-group],.ncd-card[data-noctra-docs-system=boolean-control]{padding:14px;min-height:auto}.ncd-card[data-noctra-docs-system=control-group] .ncd-grid,.ncd-card[data-noctra-docs-system=boolean-control] .ncd-grid{display:flex;gap:8px;flex-wrap:wrap}.ncd-card[data-noctra-docs-system=control-group] button,.ncd-card[data-noctra-docs-system=boolean-control] button{width:auto;min-width:auto;white-space:nowrap}.ncd-table{width:100%;border-collapse:collapse;font-size:13px}.ncd-table th{text-align:left;font-weight:700;color:var(--nc-text,#f5f7fb);padding:12px;border-bottom:1px solid rgba(148,163,184,.18)}.ncd-table td{vertical-align:top;padding:12px;border-bottom:1px solid rgba(148,163,184,.12);color:var(--nc-text-muted,#a7b2c3)}.ncd-code{display:block;overflow:auto;margin:10px 0 0;padding:14px;border-radius:12px;background:rgba(2,6,23,.72);border:1px solid rgba(148,163,184,.16);font-size:12px;line-height:1.6;color:#dbeafe}.ncd-toc{font-size:13px}.ncd-toc a{display:block;padding:7px 0;color:var(--nc-text-muted,#a7b2c3);text-decoration:none}.ncd-toc a:hover{color:var(--nc-text,#fff)}@media (max-width:1100px){.ncd-layout{grid-template-columns:1fr}.ncd-aside{display:none}}@media (max-width:760px){.ncd-layout{padding:24px 14px}.ncd-two-grid{grid-template-columns:1fr}.ncd-section>h1,.ncd-section h1{font-size:34px}}/* NOCTRA_DOCS_SYSTEM_LAYOUT_END */';

const blockPattern = /\/\* NOCTRA_DOCS_SYSTEM_LAYOUT_START \*\/[\s\S]*?\/\* NOCTRA_DOCS_SYSTEM_LAYOUT_END \*\//;

if (blockPattern.test(css)) {
  css = css.replace(blockPattern, cssBlock);
} else {
  css = `${css.trimEnd()}\n${cssBlock}\n`;
}

writeText(foundationPath, foundation);
writeText(cssPath, css);

const requiredFoundation = [
  "ncd-layout",
  "ncd-main",
  "ncd-aside",
  "ncd-section",
  "ncd-grid",
  "ncd-two-grid",
  "ncd-card",
  "ncd-table",
  "ncd-code"
];

const requiredCss = [
  ".ncd-layout",
  ".ncd-two-grid",
  ".ncd-grid",
  ".ncd-card[data-noctra-docs-system=control-group]",
  ".ncd-card[data-noctra-docs-system=demo]",
  ".ncd-table",
  ".ncd-code"
];

const forbiddenFoundation = [
  "nd-detail-layout",
  "nd-detail-main",
  "nd-detail-aside",
  "nd-doc-section",
  "nd-related-grid",
  "nd-two-grid",
  "nd-card",
  "nd-related-card",
  "nd-table",
  "nd-code-block"
];

const problems = [];

for (const snippet of requiredFoundation) {
  if (!foundation.includes(snippet)) {
    problems.push(`Foundation missing class: ${snippet}`);
  }
}

for (const snippet of requiredCss) {
  if (!css.includes(snippet)) {
    problems.push(`CSS missing selector: ${snippet}`);
  }
}

for (const snippet of forbiddenFoundation) {
  if (foundation.includes(snippet)) {
    problems.push(`Old unstable docs class remains in foundation: ${snippet}`);
  }
}

const diagnostics = ts.transpileModule(foundation, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: foundationPath
}).diagnostics ?? [];

for (const diagnostic of diagnostics) {
  problems.push(`TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Noctra Docs System Visual Layout Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Foundation changed: ${beforeFoundation === foundation ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === css ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Fixed",
  "",
  "- Docs system now uses isolated ncd-* layout classes.",
  "- Controls can wrap horizontally instead of collapsing into narrow vertical cards.",
  "- Demo preview/code area uses a stable two-column layout.",
  "- Props and Styles API tables use stable full-width table layout.",
  "- Code blocks use stable readable pre/code styling."
].join("\n");

writeFileSync("noctra-docs-system-visual-layout-report.md", `${report}\n`, "utf8");

console.log(`Noctra docs system visual layout fixed. Problems: ${problems.length}. Report: noctra-docs-system-visual-layout-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Noctra docs system visual layout fix failed.");
}