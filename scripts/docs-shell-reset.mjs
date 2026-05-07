import { readFileSync, writeFileSync } from "node:fs";

const buttonPath = "apps/docs/src/pages/ButtonReferencePage.tsx";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "docs-shell-reset-report.md";

let button = readFileSync(buttonPath, "utf8");
let css = readFileSync(cssPath, "utf8");

const beforeButton = button;
const beforeCss = css;

button = button
  .replace(/className="ncd-example-list"/g, 'className="ncd2-example-list"')
  .replace(/className='ncd-example-list'/g, "className='ncd2-example-list'")
  .replace(/className="nd-two-grid"/g, 'className="ncd2-controls-grid"')
  .replace(/className='nd-two-grid'/g, "className='ncd2-controls-grid'")
  .replace(/className="ncd-two-grid"/g, 'className="ncd2-controls-grid"')
  .replace(/className='ncd-two-grid'/g, "className='ncd2-controls-grid'")
  .replace(/className="ncd-grid"/g, 'className="ncd2-controls-grid"')
  .replace(/className='ncd-grid'/g, "className='ncd2-controls-grid'");

writeFileSync(buttonPath, button, "utf8");

const resetCss = `
/* NOCTRA_DOCS_SHELL_RESET_START */
.ncd2-shell{display:grid!important;grid-template-columns:minmax(0,760px) 230px!important;gap:42px!important;align-items:start!important;max-width:1070px!important;margin:0 auto!important;padding:42px 24px 96px!important}
.ncd2-main{min-width:0!important;max-width:760px!important}
.ncd2-rail{display:block!important;position:sticky!important;top:88px!important;align-self:start!important;min-width:0!important}
.ncd2-header{padding:0 0 24px!important;margin:0 0 18px!important;border:0!important;border-bottom:1px solid rgba(148,163,184,.18)!important;background:transparent!important;box-shadow:none!important}
.ncd2-header h1{font-size:42px!important;line-height:1.08!important;letter-spacing:-.045em!important;margin:8px 0 10px!important}
.ncd2-header p{max-width:650px!important;margin:0!important;color:var(--nc-text-muted,#a7b2c3)!important;line-height:1.65!important}
.ncd2-eyebrow{font-size:10px!important;line-height:1!important;letter-spacing:.13em!important;text-transform:uppercase!important;color:var(--nc-color-primary-300,#9b7cff)!important;font-weight:800!important;margin:0 0 9px!important}
.ncd2-meta{display:grid!important;grid-template-columns:92px minmax(0,1fr)!important;gap:8px 14px!important;margin:22px 0 0!important;max-width:460px!important}
.ncd2-meta-row{display:contents!important}
.ncd2-meta dt{font-size:13px!important;color:var(--nc-text-muted,#a7b2c3)!important}
.ncd2-meta dd{margin:0!important;font-size:13px!important;color:var(--nc-text,#f8fafc)!important}
.ncd2-meta a{color:var(--nc-text,#f8fafc)!important;text-decoration:none!important}
.ncd2-tabs{display:flex!important;gap:8px!important;align-items:center!important;flex-wrap:wrap!important;margin:0 0 30px!important;padding:0 0 14px!important;border-bottom:1px solid rgba(148,163,184,.18)!important}
.ncd2-tabs button{width:auto!important;min-width:auto!important;white-space:nowrap!important}
.ncd2-section{padding:0!important;margin:0 0 34px!important;background:transparent!important;border:0!important;box-shadow:none!important}
.ncd2-section h2{font-size:22px!important;line-height:1.25!important;letter-spacing:-.025em!important;margin:0 0 8px!important}
.ncd2-section h3{font-size:15px!important;margin:0!important}
.ncd2-section p,.ncd2-demo p,.ncd2-table-card p{font-size:14px!important;line-height:1.65!important;color:var(--nc-text-muted,#a7b2c3)!important;max-width:650px!important}
.ncd2-demo{border:1px solid rgba(148,163,184,.16)!important;background:rgba(15,23,42,.42)!important;border-radius:12px!important;padding:18px!important;margin-top:14px!important}
.ncd2-demo-head{margin:0 0 14px!important}
.ncd2-demo-grid{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(320px,.95fr)!important;gap:16px!important;align-items:stretch!important}
.ncd2-preview-panel,.ncd2-code-panel{border:1px solid rgba(148,163,184,.14)!important;border-radius:10px!important;background:rgba(2,6,23,.22)!important;padding:16px!important;min-width:0!important}
.ncd2-preview-panel>strong,.ncd2-code-panel>strong{display:block!important;font-size:13px!important;margin-bottom:10px!important}
.ncd2-preview-content{display:flex!important;align-items:center!important;justify-content:center!important;gap:10px!important;min-height:110px!important;flex-wrap:wrap!important}
.ncd2-code{display:block!important;max-width:100%!important;overflow:auto!important;margin:0!important;padding:14px!important;border-radius:10px!important;background:rgba(2,6,23,.78)!important;border:1px solid rgba(148,163,184,.12)!important;color:#dbeafe!important;font-size:12px!important;line-height:1.58!important}
.ncd2-controls-wrap{margin-top:16px!important}
.ncd2-controls-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
.ncd2-control-card{border:1px solid rgba(148,163,184,.13)!important;background:rgba(2,6,23,.22)!important;border-radius:10px!important;padding:12px!important;min-width:0!important}
.ncd2-control-card>strong{display:block!important;margin:0 0 10px!important;font-size:12px!important}
.ncd2-control-options{display:flex!important;gap:7px!important;flex-wrap:wrap!important;align-items:center!important}
.ncd2-control-options button{width:auto!important;min-width:auto!important;white-space:nowrap!important}
.ncd2-example-list{display:flex!important;flex-direction:column!important;border:1px solid rgba(148,163,184,.14)!important;border-radius:12px!important;overflow:hidden!important;background:rgba(2,6,23,.16)!important;margin-top:14px!important}
.ncd2-example-row{display:grid!important;grid-template-columns:130px minmax(0,1fr)!important;align-items:center!important;gap:16px!important;min-height:52px!important;padding:10px 14px!important;border-bottom:1px solid rgba(148,163,184,.11)!important}
.ncd2-example-row:last-child{border-bottom:0!important}
.ncd2-example-row strong{font-size:13px!important}
.ncd2-example-row span{display:flex!important;align-items:center!important;gap:10px!important;flex-wrap:wrap!important}
.ncd2-tab-panel{display:flex!important;flex-direction:column!important;gap:18px!important}
.ncd2-table-card{border:1px solid rgba(148,163,184,.16)!important;background:rgba(15,23,42,.42)!important;border-radius:12px!important;padding:18px!important;overflow:auto!important}
.ncd2-table-card h2{font-size:22px!important;margin:0 0 14px!important}
.ncd2-table{width:100%!important;border-collapse:collapse!important;font-size:13px!important}
.ncd2-table th{text-align:left!important;font-weight:700!important;color:var(--nc-text,#f5f7fb)!important;padding:11px 12px!important;border-bottom:1px solid rgba(148,163,184,.18)!important}
.ncd2-table td{vertical-align:top!important;padding:11px 12px!important;border-bottom:1px solid rgba(148,163,184,.11)!important;color:var(--nc-text-muted,#a7b2c3)!important}
.ncd2-toc{display:block!important;border-left:1px solid rgba(148,163,184,.18)!important;padding-left:16px!important;background:transparent!important;border-radius:0!important}
.ncd2-toc h3{font-size:13px!important;margin:0 0 10px!important;color:var(--nc-text,#fff)!important}
.ncd2-toc a{display:block!important;padding:6px 0!important;color:var(--nc-text-muted,#a7b2c3)!important;text-decoration:none!important;font-size:13px!important}
.ncd2-toc a:hover{color:var(--nc-text,#fff)!important}
.ncd2-prev-next{display:grid!important;grid-template-columns:1fr 1fr!important;gap:14px!important;margin-top:38px!important}
.ncd2-prev-next a{display:flex!important;flex-direction:column!important;gap:6px!important;border:1px solid rgba(148,163,184,.14)!important;border-radius:10px!important;padding:14px!important;color:inherit!important;text-decoration:none!important;background:rgba(15,23,42,.36)!important}
.ncd2-prev-next span{font-size:12px!important;color:var(--nc-text-muted,#a7b2c3)!important}
@media (max-width:1180px){.ncd2-shell{grid-template-columns:minmax(0,760px)!important;max-width:808px!important}.ncd2-rail{display:none!important}}
@media (max-width:760px){.ncd2-shell{padding:26px 14px 72px!important}.ncd2-main{max-width:100%!important}.ncd2-demo-grid,.ncd2-controls-grid,.ncd2-prev-next{grid-template-columns:1fr!important}.ncd2-header h1{font-size:34px!important}.ncd2-meta{grid-template-columns:1fr!important}.ncd2-example-row{grid-template-columns:1fr!important}}
/* NOCTRA_DOCS_SHELL_RESET_END */
`;

const blockPattern = /\/\* NOCTRA_DOCS_SHELL_RESET_START \*\/[\s\S]*?\/\* NOCTRA_DOCS_SHELL_RESET_END \*\//;

if (blockPattern.test(css)) {
  css = css.replace(blockPattern, resetCss.trim());
} else {
  css = `${css.trimEnd()}\n\n${resetCss.trim()}\n`;
}

writeFileSync(cssPath, css, "utf8");

const problems = [];

if (!readFileSync("apps/docs/src/components/docs-system/NoctraMantineDocs.tsx", "utf8").includes("ncd2-shell")) {
  problems.push("NoctraMantineDocs.tsx missing ncd2-shell");
}

if (!readFileSync("apps/docs/src/components/docs-system/NoctraMantineDocs.tsx", "utf8").includes("ncd2-rail")) {
  problems.push("NoctraMantineDocs.tsx missing ncd2-rail");
}

if (!css.includes(".ncd2-shell")) {
  problems.push("docs.css missing .ncd2-shell");
}

if (!css.includes("grid-template-columns:minmax(0,760px) 230px")) {
  problems.push("docs.css missing desktop main + rail grid");
}

if (!css.includes(".ncd2-rail{display:block")) {
  problems.push("docs.css missing visible rail rule");
}

const lines = [
  "# Docs Shell Reset Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Button changed: ${beforeButton === button ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === css ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Reset applied",
  "",
  "- Rewrote docs system shell to clean ncd2-* classes.",
  "- Main content and right rail are now explicit siblings.",
  "- TOC is removed from bottom flow and placed in sticky rail.",
  "- Header metadata is compact dl/dt/dd rows.",
  "- Demo preview/code and controls have explicit desktop grids.",
  "- Example rows are compact docs rows instead of tall cards."
];

writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");

console.log(`Docs shell reset completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  throw new Error("Docs shell reset failed.");
}
