import { existsSync, readFileSync, writeFileSync } from "node:fs";

const cssPath = "apps/docs/src/docs.css";
const reportPath = "docs-foundation-runtime-decouple-css-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let css = readText(cssPath);
const before = css;

const block = `
/* NOCTRA_DOCS_FOUNDATION_NATIVE_CONTROLS_START */
.ncd2-tab-button,.ncd2-control-button{appearance:none;border:1px solid rgba(148,163,184,.2);background:rgba(15,23,42,.46);color:var(--nc-text,#f8fafc);border-radius:8px;min-height:30px;padding:0 12px;font:inherit;font-size:13px;line-height:1;cursor:pointer;white-space:nowrap}
.ncd2-tab-button:hover,.ncd2-control-button:hover{background:rgba(148,163,184,.12)}
.ncd2-tab-button.is-active,.ncd2-control-button.is-active{border-color:rgba(139,92,246,.55);background:rgba(124,58,237,.3);color:#fff}
.ncd2-search-input{width:min(320px,100%);min-height:36px;border:1px solid rgba(148,163,184,.22);background:rgba(2,6,23,.38);color:var(--nc-text,#f8fafc);border-radius:10px;padding:0 12px;font:inherit;font-size:14px;outline:none}
.ncd2-search-input:focus{border-color:rgba(139,92,246,.62);box-shadow:0 0 0 3px rgba(139,92,246,.13)}
.ncd2-table code{display:inline-flex;align-items:center;border:1px solid rgba(148,163,184,.16);background:rgba(2,6,23,.46);border-radius:6px;padding:2px 6px;font-size:12px;color:#dbeafe}
/* NOCTRA_DOCS_FOUNDATION_NATIVE_CONTROLS_END */
`;

const pattern = /\/\* NOCTRA_DOCS_FOUNDATION_NATIVE_CONTROLS_START \*\/[\s\S]*?\/\* NOCTRA_DOCS_FOUNDATION_NATIVE_CONTROLS_END \*\//;

if (pattern.test(css)) {
  css = css.replace(pattern, block.trim());
} else {
  css = `${css.trimEnd()}\n\n${block.trim()}\n`;
}

writeText(cssPath, css);

const problems = [];

if (!css.includes(".ncd2-tab-button")) {
  problems.push("docs.css missing .ncd2-tab-button.");
}

if (!css.includes(".ncd2-control-button")) {
  problems.push("docs.css missing .ncd2-control-button.");
}

const report = [
  "# Docs Foundation Runtime Decouple CSS Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === css ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");

console.log(`Docs foundation runtime decouple CSS completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  throw new Error("Docs foundation runtime decouple CSS failed.");
}
