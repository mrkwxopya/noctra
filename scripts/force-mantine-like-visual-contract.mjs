import { existsSync, readFileSync, writeFileSync } from "node:fs";

const cssPath = "apps/docs/src/docs.css";
const reportPath = "mantine-like-visual-contract-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const before = readText(cssPath);

if (!before) {
  throw new Error(`${cssPath} missing or empty.`);
}

const block = `
/* NOCTRA_MANTINE_LIKE_VISUAL_CONTRACT_START */
:root{--ncd-m-bg:#0b0f19;--ncd-m-panel:#101624;--ncd-m-soft:#151d2f;--ncd-m-line:rgba(148,163,184,.16);--ncd-m-line-strong:rgba(148,163,184,.26);--ncd-m-text:#e5e7eb;--ncd-m-muted:#94a3b8;--ncd-m-faint:#64748b;--ncd-m-accent:#8b5cf6;--ncd-m-accent-soft:rgba(139,92,246,.12);--ncd-m-radius:10px;--ncd-m-content:820px;--ncd-m-left:260px;--ncd-m-right:238px}
html,body,#root{min-height:100%;background:var(--ncd-m-bg)!important;color:var(--ncd-m-text)}
body{margin:0;overflow-y:scroll}
*,*::before,*::after{box-sizing:border-box}
.ncd3-chrome,.ncd-docs-page,.ncd-page,.ncd2-page{min-height:100vh;background:radial-gradient(circle at 50% -10%,rgba(139,92,246,.10),transparent 34rem),var(--ncd-m-bg)!important;color:var(--ncd-m-text)}
.ncd3-topbar{position:sticky;top:0;z-index:100;height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;border-bottom:1px solid var(--ncd-m-line);background:rgba(11,15,25,.94);backdrop-filter:blur(14px)}
.ncd3-brand{display:inline-flex;align-items:center;gap:10px;color:var(--ncd-m-text);font-weight:700;text-decoration:none}
.ncd3-brand-mark{width:22px;height:22px;border-radius:7px;background:linear-gradient(135deg,#8b5cf6,#38bdf8);box-shadow:0 0 26px rgba(139,92,246,.35)}
.ncd3-topnav{display:flex;align-items:center;gap:4px}
.ncd3-topnav a{display:inline-flex;align-items:center;height:34px;padding:0 10px;border-radius:8px;color:var(--ncd-m-muted);font-size:13px;text-decoration:none}
.ncd3-topnav a:hover{background:rgba(148,163,184,.08);color:var(--ncd-m-text)}
.ncd3-content{min-width:0}

/* Mantine-like 3 column documentation shell */
.ncd2-shell,.ncd2-docs-shell,.ncd-docs-shell,.ncd-layout-shell,.ncd-main-shell,.ncd-docs-layout,.ncd-layout,.ncd-page-inner{width:100%}
.ncd2-layout,.ncd2-docs-layout,.ncd2-grid,.ncd-docs-grid,.ncd-layout-grid,.ncd-main-grid,.ncd-content-grid{width:100%;max-width:1480px;margin:0 auto;display:grid;grid-template-columns:var(--ncd-m-left) minmax(0,var(--ncd-m-content)) var(--ncd-m-right);gap:38px;padding:34px 30px 78px;align-items:start}
.ncd2-left-rail,.ncd-left-rail,.ncd-docs-nav,.ncd-docs-sidebar,.ncd-page-sidebar,.ncd3-left-rail{position:sticky;top:78px;align-self:start;max-height:calc(100vh - 92px);overflow:auto;padding:0 14px 28px 0;border-right:1px solid var(--ncd-m-line);scrollbar-width:thin}
.ncd2-main,.ncd-docs-main,.ncd-content-main,.ncd-page-main,.ncd-main{min-width:0;width:100%;max-width:var(--ncd-m-content)}
.ncd2-right-rail,.ncd2-toc,.ncd-docs-aside,.ncd-aside,.ncd-page-aside,.ncd-docs-toc,.ncd-page-toc,.ncd3-right-rail{position:sticky;top:78px;align-self:start;max-height:calc(100vh - 92px);overflow:auto;padding-left:18px;border-left:1px solid var(--ncd-m-line);font-size:13px;color:var(--ncd-m-muted);scrollbar-width:thin}

/* Legacy/detail pages get the same feeling */
.nd-detail-layout,.nd-page-layout{width:100%;max-width:1180px;margin:0 auto;display:grid;grid-template-columns:minmax(0,var(--ncd-m-content)) var(--ncd-m-right);gap:38px;padding:34px 30px 78px;align-items:start}
.nd-detail-main,.nd-page-main{min-width:0;max-width:var(--ncd-m-content)}
.nd-detail-aside,.nd-page-aside{position:sticky;top:78px;align-self:start;max-height:calc(100vh - 92px);overflow:auto;padding-left:18px;border-left:1px solid var(--ncd-m-line);font-size:13px;color:var(--ncd-m-muted)}

/* Left navigation visual */
.ncd2-left-rail a,.ncd-left-rail a,.ncd-docs-nav a,.ncd-docs-sidebar a,.ncd-page-sidebar a,.ncd3-left-rail a{display:flex;align-items:center;min-height:28px;padding:4px 8px;border-radius:7px;color:var(--ncd-m-muted);font-size:13px;line-height:1.35;text-decoration:none}
.ncd2-left-rail a:hover,.ncd-left-rail a:hover,.ncd-docs-nav a:hover,.ncd-docs-sidebar a:hover,.ncd-page-sidebar a:hover,.ncd3-left-rail a:hover{background:rgba(148,163,184,.08);color:var(--ncd-m-text)}
.ncd2-left-rail [aria-current="page"],.ncd-left-rail [aria-current="page"],.ncd-docs-nav [aria-current="page"],.ncd-docs-sidebar [aria-current="page"]{background:var(--ncd-m-accent-soft);color:#ddd6fe}
.ncd2-left-rail h2,.ncd2-left-rail h3,.ncd-left-rail h2,.ncd-left-rail h3,.ncd-docs-nav h2,.ncd-docs-nav h3,.ncd-docs-sidebar h2,.ncd-docs-sidebar h3{margin:18px 8px 7px;color:var(--ncd-m-faint);font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700}

/* Right TOC visual */
.ncd2-right-rail a,.ncd2-toc a,.ncd-docs-aside a,.ncd-aside a,.ncd-page-aside a,.ncd-docs-toc a,.ncd-page-toc a,.nd-detail-aside a{display:block;padding:4px 0 4px 10px;border-left:1px solid transparent;color:var(--ncd-m-muted);font-size:13px;line-height:1.35;text-decoration:none}
.ncd2-right-rail a:hover,.ncd2-toc a:hover,.ncd-docs-aside a:hover,.ncd-aside a:hover,.ncd-page-aside a:hover,.ncd-docs-toc a:hover,.ncd-page-toc a:hover,.nd-detail-aside a:hover{border-left-color:var(--ncd-m-accent);color:var(--ncd-m-text)}
.ncd2-right-rail h2,.ncd2-right-rail h3,.ncd2-toc h2,.ncd2-toc h3,.ncd-docs-aside h2,.ncd-docs-aside h3,.ncd-aside h2,.ncd-aside h3,.ncd-page-aside h2,.ncd-page-aside h3,.nd-detail-aside h2,.nd-detail-aside h3{margin:0 0 10px;color:var(--ncd-m-text);font-size:13px;font-weight:650}

/* Mantine-like page header */
.ncd2-hero,.ncd-docs-hero,.ncd-component-hero,.ncd-page-hero,.ncd3-page-hero,.nd-detail-hero{padding:0 0 26px;margin:0 0 18px;border-bottom:1px solid var(--ncd-m-line);background:transparent!important;box-shadow:none!important}
.ncd2-hero h1,.ncd-docs-hero h1,.ncd-component-hero h1,.ncd-page-hero h1,.ncd3-page-hero h1,.nd-detail-hero h1{margin:0 0 10px;color:var(--ncd-m-text);font-size:42px;line-height:1.08;font-weight:750;letter-spacing:-.035em}
.ncd2-hero p,.ncd-docs-hero p,.ncd-component-hero p,.ncd-page-hero p,.ncd3-page-hero p,.nd-detail-hero p{max-width:680px;margin:0;color:var(--ncd-m-muted);font-size:16px;line-height:1.65}
.ncd2-kicker,.ncd-kicker,.ncd3-eyebrow,.ncd-eyebrow{margin:0 0 10px;color:var(--ncd-m-accent);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.ncd2-meta,.ncd-component-meta,.ncd-docs-meta,.ncd-page-meta,.ncd3-meta{display:flex;flex-wrap:wrap;gap:10px 18px;margin-top:18px;color:var(--ncd-m-muted);font-size:13px}
.ncd2-meta>*,
.ncd-component-meta>*,
.ncd-docs-meta>*,
.ncd-page-meta>*{min-width:0;padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important}

/* Tabs like Mantine docs */
.ncd2-tabs,.ncd-doc-tabs,.ncd-section-tabs,.ncd-tabs{display:flex;align-items:center;gap:22px;margin:24px 0 28px;border-bottom:1px solid var(--ncd-m-line)}
.ncd2-tabs button,.ncd-doc-tab,.ncd-section-tabs button,.ncd-tabs button{appearance:none;border:0;border-bottom:2px solid transparent;background:transparent!important;color:var(--ncd-m-muted);padding:0 0 12px;margin:0;border-radius:0;font:inherit;font-size:14px;font-weight:650;cursor:pointer}
.ncd2-tabs button:hover,.ncd-doc-tab:hover,.ncd-section-tabs button:hover,.ncd-tabs button:hover{color:var(--ncd-m-text)}
.ncd2-tabs [aria-selected="true"],.ncd-doc-tab[aria-selected="true"],.ncd-section-tabs [aria-selected="true"],.ncd-tabs [aria-selected="true"]{color:var(--ncd-m-text);border-bottom-color:var(--ncd-m-accent)}

/* Content rhythm */
.ncd2-section,.ncd-doc-section,.ncd-section,.ncd3-card,.nd-section{margin:0 0 34px;padding:0;background:transparent!important;border:0!important;box-shadow:none!important}
.ncd2-section>h2,.ncd-doc-section>h2,.ncd-section>h2,.ncd3-section-title h2,.nd-section h2{margin:0 0 12px;color:var(--ncd-m-text);font-size:26px;line-height:1.25;font-weight:720;letter-spacing:-.02em}
.ncd2-section>p,.ncd-doc-section>p,.ncd-section>p,.ncd3-section-title p,.nd-section p{color:var(--ncd-m-muted);line-height:1.7}
.ncd-card,.ncd-panel,.ncd-demo-panel,.ncd-preview-panel,.ncd-code-panel,.ncd-props-panel,.ncd-control-card,.ncd-compact-card,.ncd3-table-card,.nd-card,.nd-component-card,.nd-related-card{border:1px solid var(--ncd-m-line)!important;background:rgba(15,23,42,.34)!important;border-radius:var(--ncd-m-radius)!important;box-shadow:none!important}
.ncd-demo-panel,.ncd-preview-panel,.ncd-code-panel,.ncd-props-panel,.ncd3-table-card{padding:18px}
.ncd-demo-grid,.ncd-preview-code-grid,.ncd-configurator-grid,.ncd-controls-grid{gap:14px!important}
.ncd-code,.ncd-code-block,pre,code{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace}
pre,.ncd-code-block,.ncd-code-scroll{border:1px solid var(--ncd-m-line)!important;background:#070b14!important;border-radius:var(--ncd-m-radius)!important;color:#dbeafe}

/* Tables */
.ncd-props-table,.ncd3-table,.nd-table{width:100%;border-collapse:collapse;font-size:13px}
.ncd-props-table th,.ncd3-table th,.nd-table th{padding:10px 12px;border-bottom:1px solid var(--ncd-m-line-strong);color:var(--ncd-m-muted);font-weight:650;text-align:left}
.ncd-props-table td,.ncd3-table td,.nd-table td{padding:12px;border-bottom:1px solid var(--ncd-m-line);vertical-align:top;color:var(--ncd-m-text)}
.ncd-props-table tr:last-child td,.ncd3-table tr:last-child td,.nd-table tr:last-child td{border-bottom:0}

/* Previous next flatter */
.ncd-prev-next,.ncd2-prev-next,.nd-prev-next{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:42px;padding-top:22px;border-top:1px solid var(--ncd-m-line)}
.ncd-prev-next a,.ncd2-prev-next a,.nd-prev-next a{display:flex;flex-direction:column;gap:4px;padding:14px 16px;border:1px solid var(--ncd-m-line);border-radius:var(--ncd-m-radius);background:rgba(15,23,42,.28);color:var(--ncd-m-text);text-decoration:none}
.ncd-prev-next a:hover,.ncd2-prev-next a:hover,.nd-prev-next a:hover{border-color:var(--ncd-m-line-strong);background:rgba(148,163,184,.07)}

/* Responsive */
@media (max-width:1180px){.ncd2-layout,.ncd2-docs-layout,.ncd2-grid,.ncd-docs-grid,.ncd-layout-grid,.ncd-main-grid,.ncd-content-grid{grid-template-columns:220px minmax(0,1fr);gap:28px}.ncd2-right-rail,.ncd2-toc,.ncd-docs-aside,.ncd-aside,.ncd-page-aside,.ncd-docs-toc,.ncd-page-toc,.ncd3-right-rail{display:none}.nd-detail-layout,.nd-page-layout{grid-template-columns:minmax(0,1fr)}.nd-detail-aside,.nd-page-aside{display:none}}
@media (max-width:860px){.ncd3-topbar{height:auto;min-height:58px;align-items:flex-start;flex-direction:column;gap:10px;padding:14px 18px}.ncd3-topnav{flex-wrap:wrap}.ncd2-layout,.ncd2-docs-layout,.ncd2-grid,.ncd-docs-grid,.ncd-layout-grid,.ncd-main-grid,.ncd-content-grid,.nd-detail-layout,.nd-page-layout{display:block;padding:24px 18px 64px}.ncd2-left-rail,.ncd-left-rail,.ncd-docs-nav,.ncd-docs-sidebar,.ncd-page-sidebar,.ncd3-left-rail{position:relative;top:auto;max-height:none;margin-bottom:26px;padding:0 0 18px;border-right:0;border-bottom:1px solid var(--ncd-m-line)}.ncd2-hero h1,.ncd-docs-hero h1,.ncd-component-hero h1,.ncd-page-hero h1,.ncd3-page-hero h1,.nd-detail-hero h1{font-size:34px}.ncd-prev-next,.ncd2-prev-next,.nd-prev-next{grid-template-columns:1fr}}
/* NOCTRA_MANTINE_LIKE_VISUAL_CONTRACT_END */
`;

const pattern = /\/\* NOCTRA_MANTINE_LIKE_VISUAL_CONTRACT_START \*\/[\s\S]*?\/\* NOCTRA_MANTINE_LIKE_VISUAL_CONTRACT_END \*\//;

const after = pattern.test(before)
  ? before.replace(pattern, block.trim())
  : `${before.trimEnd()}\n\n${block.trim()}\n`;

writeText(cssPath, after);

const problems = [];

for (const required of [
  "NOCTRA_MANTINE_LIKE_VISUAL_CONTRACT_START",
  "grid-template-columns:var(--ncd-m-left) minmax(0,var(--ncd-m-content)) var(--ncd-m-right)",
  "position:sticky",
  "ncd2-left-rail",
  "ncd2-right-rail",
  "nd-detail-layout",
  "ncd3-topbar"
]) {
  if (!after.includes(required)) {
    problems.push(`Missing visual contract marker: ${required}`);
  }
}

const report = [
  "# Mantine-like Visual Contract Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === after ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Forced 3-column desktop docs shell.",
  "- Forced sticky left navigation and right TOC.",
  "- Flattened hero/header/tabs to Mantine-like docs rhythm.",
  "- Reduced heavy card styling.",
  "- Covered both ncd/ncd2/ncd3 and legacy nd detail page class names.",
  "- Did not change docs runtime or routing logic."
].join("\n");

writeText(reportPath, report);

console.log(`Mantine-like visual contract completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Mantine-like visual contract failed.");
}
