import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const reportPath = "mantine-desktop-structure-restore-report.md";
const docsRoot = "apps/docs/src";
const cssPath = "apps/docs/src/docs.css";
const backupDir = "safety-backups/mantine-desktop-structure";

if (!existsSync(backupDir)) {
  mkdirSync(backupDir, { recursive: true });
}

const touched = [];
const problems = [];

function backupFile(path) {
  if (!existsSync(path)) return;
  const safeName = path.replace(/[\/\\:]/g, "__");
  writeFileSync(join(backupDir, safeName), readFileSync(path, "utf8"), "utf8");
}

function patchFile(path, transform) {
  if (!existsSync(path)) return false;
  const before = readFileSync(path, "utf8");
  const after = transform(before);
  if (after !== before) {
    backupFile(path);
    writeFileSync(path, after, "utf8");
    touched.push(path);
    return true;
  }
  return false;
}

function collectFiles(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...collectFiles(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

const tsxFiles = collectFiles(docsRoot).filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"));

for (const file of tsxFiles) {
  patchFile(file, (source) => {
    let next = source;

    next = next.replace(/className="ncd-card ncd-related-card"/g, 'className="ncd-related-link"');
    next = next.replace(/className='ncd-card ncd-related-card'/g, "className='ncd-related-link'");
    next = next.replace(/className="ncd-card\s+ncd-related-card\s+([^"]*)"/g, 'className="ncd-related-link $1"');
    next = next.replace(/className='ncd-card\s+ncd-related-card\s+([^']*)'/g, "className='ncd-related-link $1'");

    next = next.replace(/ncd-related-card/g, "ncd-related-link");

    return next;
  });
}

const cssBlock = `
/* === Mantine-like desktop structure restore === */
.ncd-page,
.ncd-docs-page,
.ncd-docs-shell {
  width: 100%;
}

.ncd-page-inner,
.ncd-docs-inner,
.ncd-docs-shell__inner,
.ncd-docs-layout,
.ncd-layout-shell,
.ncd-main-shell {
  width: min(1440px, calc(100vw - 64px));
  margin-inline: auto;
}

.ncd-page-body,
.ncd-docs-body,
.ncd-docs-grid,
.ncd-docs-shell__body,
.ncd-layout-grid,
.ncd-content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}

@media (min-width: 1240px) {
  .ncd-page-body,
  .ncd-docs-body,
  .ncd-docs-grid,
  .ncd-docs-shell__body,
  .ncd-layout-grid,
  .ncd-content-grid {
    grid-template-columns: minmax(0, 1fr) 260px;
  }
}

.ncd-page-main,
.ncd-docs-main,
.ncd-content-main,
.ncd-docs-shell__main {
  min-width: 0;
  max-width: 100%;
}

@media (min-width: 1240px) {
  .ncd-page-main,
  .ncd-docs-main,
  .ncd-content-main,
  .ncd-docs-shell__main {
    width: min(920px, 100%);
  }
}

.ncd-page-aside,
.ncd-docs-aside,
.ncd-toc-aside,
.ncd-docs-shell__aside {
  min-width: 0;
}

@media (min-width: 1240px) {
  .ncd-page-aside,
  .ncd-docs-aside,
  .ncd-toc-aside,
  .ncd-docs-shell__aside {
    position: sticky;
    top: 88px;
    align-self: start;
  }
}

.ncd-hero,
.ncd-page-hero,
.ncd-docs-hero,
.ncd-component-hero {
  display: block;
  padding: 0 0 20px 0;
  margin: 0 0 20px 0;
  border: 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: transparent;
  box-shadow: none;
  border-radius: 0;
}

.ncd-hero-meta,
.ncd-docs-meta,
.ncd-page-meta,
.ncd-component-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, max-content));
  gap: 8px 18px;
  margin-top: 14px;
}

.ncd-hero-stats,
.ncd-stat-grid,
.ncd-stat-cards {
  display: none !important;
}

.ncd-tabs,
.ncd-doc-tabs,
.ncd-section-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.ncd-tab,
.ncd-doc-tab,
.ncd-tabs button,
.ncd-tabs a {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 8px;
  box-shadow: none;
}

.ncd-section,
.ncd-doc-section,
.ncd-demo-section,
.ncd-props-section,
.ncd-related-section,
.ncd-example-section {
  padding: 0;
  margin: 0 0 28px 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
}

.ncd-card,
.ncd-panel,
.ncd-demo-panel,
.ncd-props-panel,
.ncd-code-panel,
.ncd-preview-panel,
.ncd-table-wrap,
.ncd-surface {
  background: rgba(11, 21, 45, 0.82);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: none;
  border-radius: 12px;
}

.ncd-demo-grid,
.ncd-preview-code-grid,
.ncd-usage-grid,
.ncd-basic-example-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

@media (min-width: 980px) {
  .ncd-demo-grid,
  .ncd-preview-code-grid,
  .ncd-usage-grid,
  .ncd-basic-example-grid {
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.95fr);
  }
}

.ncd-controls-grid,
.ncd-configurator-grid,
.ncd-playground-controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (min-width: 980px) {
  .ncd-controls-grid,
  .ncd-configurator-grid,
  .ncd-playground-controls {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.ncd-example-list,
.ncd-variant-list,
.ncd-tone-list,
.ncd-size-list,
.ncd-radius-list,
.ncd-state-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.ncd-example-row,
.ncd-variant-row,
.ncd-tone-row,
.ncd-size-row,
.ncd-radius-row,
.ncd-state-row,
.ncd-related-link {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 10px 14px;
  background: rgba(11, 21, 45, 0.82);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  text-decoration: none;
}

.ncd-related-links,
.ncd-related-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.ncd-toc,
.ncd-page-toc,
.ncd-docs-toc,
.ncd-table-of-contents {
  background: rgba(11, 21, 45, 0.82);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 14px;
}

.ncd-toc a,
.ncd-page-toc a,
.ncd-docs-toc a,
.ncd-table-of-contents a {
  display: block;
  padding: 6px 0;
  text-decoration: none;
  opacity: 0.92;
}

.ncd-mobile-toc,
.ncd-bottom-toc {
  display: none !important;
}

.ncd-props-table,
.ncd-styles-api-table,
.ncd-table {
  width: 100%;
  border-collapse: collapse;
}

.ncd-props-table th,
.ncd-props-table td,
.ncd-styles-api-table th,
.ncd-styles-api-table td,
.ncd-table th,
.ncd-table td {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  text-align: left;
  vertical-align: top;
}

.ncd-code-scroll,
.ncd-code-block,
pre.ncd-code,
.ncd-preview-panel pre {
  overflow: auto;
}

@media (max-width: 1239px) {
  .ncd-page-inner,
  .ncd-docs-inner,
  .ncd-docs-shell__inner,
  .ncd-docs-layout,
  .ncd-layout-shell,
  .ncd-main-shell {
    width: min(100%, calc(100vw - 28px));
  }
}
`;

patchFile(cssPath, (source) => {
  if (source.includes("Mantine-like desktop structure restore")) {
    return source;
  }
  return `${source.trimEnd()}\n\n${cssBlock.trim()}\n`;
});

const checks = [];

if (existsSync(cssPath)) {
  const css = readFileSync(cssPath, "utf8");
  checks.push(["desktop 2-column layout", /grid-template-columns:\s*minmax\(0,\s*1fr\)\s*260px/.test(css)]);
  checks.push(["sticky toc", /position:\s*sticky/.test(css) && /top:\s*88px/.test(css)]);
  checks.push(["demo preview\/code desktop grid", /grid-template-columns:\s*minmax\(0,\s*1fr\)\s*minmax\(320px,\s*0\.95fr\)/.test(css)]);
  checks.push(["related cards flattened", !/ncd-related-card/.test(css)]);
}

for (const file of tsxFiles) {
  const content = readFileSync(file, "utf8");
  if (/ncd-related-card/.test(content)) {
    problems.push(`Old card-heavy snippet remains in ${file}`);
  }
}

for (const [label, ok] of checks) {
  if (!ok) {
    problems.push(`Missing expected structure: ${label}`);
  }
}

const lines = [
  "# Mantine Desktop Structure Restore Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Touched files: ${touched.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Touched files",
  "",
  ...(touched.length ? touched.map((file) => `- ${file}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Verified goals",
  "",
  "- Restore wider desktop content shell",
  "- Restore right-side sticky table of contents styling",
  "- Flatten heavy cards into docs-style panels",
  "- Make preview/code area closer to Mantine-like docs structure",
  "- Replace old related-card visual pattern"
];

writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");

console.log(`Mantine desktop structure restore completed. Touched: ${touched.length}. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  throw new Error("Mantine desktop structure restore failed.");
}
