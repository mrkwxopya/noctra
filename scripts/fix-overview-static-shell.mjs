import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const staticPagePath = "apps/docs/src/pages/NoctraStaticDocsPage.tsx";
const cssPath = "apps/docs/src/docs.css";
const fallbackPath = "scripts/generate-static-route-fallbacks.mjs";
const reportPath = "overview-static-shell-fix-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const beforeStaticPage = readText(staticPagePath);
const beforeCss = readText(cssPath);
const beforeFallback = readText(fallbackPath);

const staticPage = `import type { ReactNode } from "react";
import { docsHref } from "../lib/docsRouting";

export type NoctraStaticDocsPageProps = {
  page?: string;
  route?: string;
  title?: ReactNode;
  description?: ReactNode;
};

const docsLinks = [
  { label: "Overview", href: "/overview/" }
];

const overviewCards = [
  {
    title: "Components",
    description: "Production-ready React components with predictable props, states, slots and styling hooks."
  },
  {
    title: "Design tokens",
    description: "Dark-first semantic tokens for surfaces, borders, text, focus, feedback and component states."
  },
  {
    title: "Styles API",
    description: "Each component exposes stable selectors, CSS variables and data attributes for controlled customization."
  },
  {
    title: "Configurator",
    description: "Component pages include interactive controls that update preview state and generated usage examples."
  }
];

const overviewStats = [
  { label: "Component pages", value: "100+" },
  { label: "Docs shell", value: "Unified" },
  { label: "Routing", value: "Stable" },
  { label: "Theme", value: "Dark-first" }
];

function getPageTitle(page?: string, title?: ReactNode) {
  if (title) return title;

  if (page === "overview" || !page) return "Overview";

  return page
    .replace(/[-_]+/g, " ")
    .replace(/\\b\\w/g, (letter) => letter.toUpperCase());
}

function getPageDescription(page?: string, description?: ReactNode) {
  if (description) return description;

  if (page === "overview" || !page) {
    return "Noctra is a dark-first React component system focused on clean APIs, premium surfaces, stable styling hooks and production documentation.";
  }

  return "Noctra documentation page.";
}

export function NoctraStaticDocsPage({
  page = "overview",
  title,
  description
}: NoctraStaticDocsPageProps) {
  const pageTitle = getPageTitle(page, title);
  const pageDescription = getPageDescription(page, description);

  return (
    <div className="nmx-static-page nmx-overview-page">
      <aside className="nmx-left-rail" aria-label="Docs navigation">
        <div className="nmx-rail-section">
          <div className="nmx-rail-title">Docs</div>
          <nav className="nmx-rail-links">
            {docsLinks.map((item) => (
              <a
                key={item.href}
                href={docsHref(item.href)}
                className="nmx-rail-link"
                data-active={item.href.includes("/overview") ? "true" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <main className="nmx-static-content">
        <header className="nmx-hero nmx-overview-hero">
          <div>
            <p className="nmx-eyebrow">Noctra Docs</p>
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>

          <div className="nmx-overview-actions" aria-label="Overview actions">
            <a href={docsHref("/components/button/")}>View components</a>
            <a href={docsHref("/components/card/")}>Open Card docs</a>
          </div>
        </header>

        <section className="nmx-overview-stats" aria-label="Overview stats">
          {overviewStats.map((item) => (
            <article key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </section>

        <section className="nmx-section-card nmx-overview-section" id="overview">
          <div className="nmx-section-heading">
            <p className="nmx-eyebrow">Foundation</p>
            <h2>Built like the component pages</h2>
            <p>
              This overview now uses the same spacing, dark surface language, left rail behavior and content rhythm as the component documentation pages.
            </p>
          </div>

          <div className="nmx-overview-grid">
            {overviewCards.map((card) => (
              <article key={card.title} className="nmx-overview-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="nmx-section-card nmx-overview-section">
          <div className="nmx-section-heading">
            <p className="nmx-eyebrow">Workflow</p>
            <h2>Recommended next path</h2>
            <p>
              Continue from component pages first. They now carry the registry-driven props, Styles API and preview polish work.
            </p>
          </div>

          <div className="nmx-overview-flow">
            <a href={docsHref("/components/button/")}>Button</a>
            <a href={docsHref("/components/input/")}>Input</a>
            <a href={docsHref("/components/select/")}>Select</a>
            <a href={docsHref("/components/modal/")}>Modal</a>
            <a href={docsHref("/components/table/")}>Table</a>
          </div>
        </section>
      </main>

      <aside className="nmx-right-toc" aria-label="Table of contents">
        <div className="nmx-toc-title">On this page</div>
        <a href="#overview">Overview</a>
        <a href="#overview">Foundation</a>
      </aside>
    </div>
  );
}

export default NoctraStaticDocsPage;
`;

let css = beforeCss;

const cssBlock = `
/* OVERVIEW_STATIC_SHELL_FIX_START */
.nmx-overview-page,
.nmx-static-page {
  min-height: 100vh;
}

.nmx-overview-page {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 230px;
  gap: 32px;
  width: min(1480px, 100%);
  margin: 0 auto;
  padding: 34px 28px 80px;
  background:
    radial-gradient(circle at 50% -10%, rgba(139, 92, 246, .10), transparent 34rem),
    var(--nmx-bg, #070b14);
  color: var(--nmx-text, #f8fafc);
}

.nmx-overview-page .nmx-left-rail,
.nmx-overview-page .nmx-right-toc {
  position: sticky;
  top: 24px;
  align-self: start;
  max-height: calc(100vh - 48px);
}

.nmx-overview-page .nmx-left-rail {
  padding-right: 22px;
  border-right: 1px solid var(--nmx-line, rgba(148, 163, 184, .14));
}

.nmx-overview-page .nmx-right-toc {
  padding-left: 22px;
  border-left: 1px solid var(--nmx-line, rgba(148, 163, 184, .14));
}

.nmx-rail-section {
  display: grid;
  gap: 10px;
}

.nmx-rail-title,
.nmx-toc-title {
  color: var(--nmx-muted, #94a3b8);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.nmx-rail-links,
.nmx-right-toc {
  display: grid;
  gap: 6px;
}

.nmx-rail-link,
.nmx-right-toc a {
  display: flex;
  align-items: center;
  min-height: 32px;
  color: var(--nmx-muted, #94a3b8);
  text-decoration: none;
  font-size: 13px;
  border-radius: 9px;
}

.nmx-rail-link {
  padding: 0 10px;
}

.nmx-rail-link[data-active="true"],
.nmx-rail-link:hover,
.nmx-right-toc a:hover {
  color: var(--nmx-text, #f8fafc);
  background: rgba(148, 163, 184, .08);
}

.nmx-static-content {
  min-width: 0;
  display: grid;
  gap: 22px;
}

.nmx-overview-hero {
  display: grid;
  gap: 22px;
  padding: 42px;
  border: 1px solid var(--nmx-line, rgba(148, 163, 184, .14));
  border-radius: 24px;
  background:
    radial-gradient(circle at 100% 0%, rgba(139, 92, 246, .18), transparent 38%),
    rgba(15, 23, 42, .62);
  box-shadow: 0 24px 80px rgba(0, 0, 0, .24);
}

.nmx-eyebrow {
  margin: 0 0 8px;
  color: #a78bfa;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: .10em;
  text-transform: uppercase;
}

.nmx-overview-hero h1 {
  margin: 0;
  color: var(--nmx-text, #f8fafc);
  font-size: clamp(42px, 6vw, 72px);
  line-height: .95;
  letter-spacing: -.055em;
}

.nmx-overview-hero p {
  max-width: 760px;
  margin: 16px 0 0;
  color: var(--nmx-muted, #94a3b8);
  font-size: 16px;
  line-height: 1.65;
}

.nmx-overview-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.nmx-overview-actions a,
.nmx-overview-flow a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(139, 92, 246, .34);
  border-radius: 11px;
  background: rgba(139, 92, 246, .14);
  color: #ede9fe;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
}

.nmx-overview-actions a:last-child {
  border-color: rgba(148, 163, 184, .18);
  background: rgba(15, 23, 42, .54);
  color: var(--nmx-text, #f8fafc);
}

.nmx-overview-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.nmx-overview-stats article,
.nmx-overview-card,
.nmx-section-card {
  border: 1px solid var(--nmx-line, rgba(148, 163, 184, .14));
  background: rgba(15, 23, 42, .54);
  box-shadow: 0 18px 60px rgba(0, 0, 0, .18);
}

.nmx-overview-stats article {
  display: grid;
  gap: 4px;
  padding: 16px;
  border-radius: 16px;
}

.nmx-overview-stats strong {
  color: var(--nmx-text, #f8fafc);
  font-size: 20px;
  letter-spacing: -.03em;
}

.nmx-overview-stats span {
  color: var(--nmx-muted, #94a3b8);
  font-size: 12px;
}

.nmx-section-card {
  display: grid;
  gap: 22px;
  padding: 24px;
  border-radius: 22px;
}

.nmx-section-heading {
  display: grid;
  gap: 6px;
}

.nmx-section-heading h2 {
  margin: 0;
  color: var(--nmx-text, #f8fafc);
  font-size: 26px;
  letter-spacing: -.035em;
}

.nmx-section-heading p {
  max-width: 760px;
  margin: 0;
  color: var(--nmx-muted, #94a3b8);
  font-size: 14px;
  line-height: 1.65;
}

.nmx-overview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.nmx-overview-card {
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: 18px;
}

.nmx-overview-card h3 {
  margin: 0;
  color: var(--nmx-text, #f8fafc);
  font-size: 16px;
}

.nmx-overview-card p {
  margin: 0;
  color: var(--nmx-muted, #94a3b8);
  font-size: 13px;
  line-height: 1.6;
}

.nmx-overview-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* Docs left menu must keep only Overview in static docs */
.nmx-overview-page .nmx-left-rail a[href$="/components/"],
.nmx-overview-page .nmx-left-rail a[href$="/architecture/"],
.nmx-overview-page .nmx-left-rail a[href$="/theming/"],
.nmx-overview-page .nmx-left-rail a[href$="/tokens/"],
.nmx-overview-page .nmx-left-rail a[href$="/quality/"],
.nmx-overview-page .nmx-left-rail a[href$="/release/"],
.nmx-overview-page .nmx-left-rail a[href$="/getting-started/"],
.nmx-overview-page .nmx-left-rail a[href$="/accessibility/"] {
  display: none !important;
}

@media (max-width: 1180px) {
  .nmx-overview-page {
    grid-template-columns: 230px minmax(0, 1fr);
  }

  .nmx-overview-page .nmx-right-toc {
    display: none;
  }
}

@media (max-width: 860px) {
  .nmx-overview-page {
    display: block;
    padding: 24px 18px 64px;
  }

  .nmx-overview-page .nmx-left-rail {
    position: relative;
    top: auto;
    max-height: none;
    margin-bottom: 24px;
    padding: 0 0 18px;
    border-right: 0;
    border-bottom: 1px solid var(--nmx-line, rgba(148, 163, 184, .14));
  }

  .nmx-overview-hero {
    padding: 28px 20px;
  }

  .nmx-overview-stats,
  .nmx-overview-grid {
    grid-template-columns: 1fr;
  }
}
/* OVERVIEW_STATIC_SHELL_FIX_END */
`;

const cssPattern = /\/\* OVERVIEW_STATIC_SHELL_FIX_START \*\/[\s\S]*?\/\* OVERVIEW_STATIC_SHELL_FIX_END \*\//;

css = cssPattern.test(css)
  ? css.replace(cssPattern, cssBlock.trim())
  : `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;

let fallback = beforeFallback;

if (!fallback.includes('"/overview"')) {
  fallback = fallback.replace(
    /const generalRoutes = \[[\s\S]*?\];/,
    `const generalRoutes = [
  "/",
  "/overview",
  "/getting-started",
  "/components",
  "/architecture",
  "/tokens",
  "/theming",
  "/quality",
  "/release",
  "/layout",
  "/accessibility"
];`
  );
}

writeText(staticPagePath, staticPage);
writeText(cssPath, css);
writeText(fallbackPath, fallback);

const afterStaticPage = readText(staticPagePath);
const afterCss = readText(cssPath);
const afterFallback = readText(fallbackPath);

const problems = [];

for (const marker of [
  "export function NoctraStaticDocsPage",
  "nmx-overview-page",
  "nmx-left-rail",
  "nmx-right-toc",
  "View components",
  "Open Card docs",
  "docsHref"
]) {
  if (!afterStaticPage.includes(marker)) {
    problems.push(`Missing static page marker: ${marker}`);
  }
}

for (const marker of [
  "OVERVIEW_STATIC_SHELL_FIX_START",
  ".nmx-overview-page",
  ".nmx-overview-hero",
  ".nmx-overview-stats",
  ".nmx-overview-card",
  "grid-template-columns: 260px minmax(0, 1fr) 230px"
]) {
  if (!afterCss.includes(marker)) {
    problems.push(`Missing CSS marker: ${marker}`);
  }
}

for (const marker of [
  '"/overview"',
  '"/components"'
]) {
  if (!afterFallback.includes(marker)) {
    problems.push(`Missing fallback marker: ${marker}`);
  }
}

const staticSourceFile = ts.createSourceFile(
  staticPagePath,
  afterStaticPage,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);

for (const diagnostic of staticSourceFile.parseDiagnostics ?? []) {
  const pos = diagnostic.start ?? 0;
  const lineInfo = staticSourceFile.getLineAndCharacterOfPosition(pos);
  const line = lineInfo.line + 1;
  const col = lineInfo.character + 1;
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

  problems.push(`${staticPagePath}:${line}:${col} TS${diagnostic.code}: ${message}`);
}

const report = [
  "# Overview Static Shell Fix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `NoctraStaticDocsPage changed: ${beforeStaticPage === afterStaticPage ? "no" : "yes"}`,
  `docs.css changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `fallback generator changed: ${beforeFallback === afterFallback ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Rebuilt Overview as a Mantine-like static docs shell.",
  "- Added left rail with only Overview.",
  "- Added right table of contents.",
  "- Added hero, stats, cards and workflow sections.",
  "- Matched the component docs spacing, surfaces, dark theme and rail layout.",
  "- Preserved component pages and UniversalComponentDocPage.tsx.",
  "- Ensured overview remains part of static route fallbacks."
].join("\n");

writeText(reportPath, report);
console.log(report);

if (problems.length > 0) {
  process.exitCode = 1;
}
