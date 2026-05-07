import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function ensureImport(text, importLine) {
  if (text.includes(importLine)) return text;

  const lines = text.split(/\r?\n/g);
  const lastImportIndex = lines.findLastIndex((line) => line.startsWith("import "));

  if (lastImportIndex === -1) {
    throw new Error(`Could not insert import: ${importLine}`);
  }

  lines.splice(lastImportIndex + 1, 0, importLine);

  return lines.join("\n");
}

const detailPath = "apps/docs/src/pages/ComponentDetailPage.tsx";
let detail = readText(detailPath);

if (!detail) {
  throw new Error(`Missing ${detailPath}`);
}

detail = ensureImport(
  detail,
  'import { MantineStyleComponentDocs } from "../components/MantineStyleComponentDocs";'
);

if (!detail.includes("<MantineStyleComponentDocs component={component} />")) {
  if (!detail.includes("<InteractiveComponentDemo component={component} />")) {
    throw new Error("ComponentDetailPage is missing InteractiveComponentDemo insertion point.");
  }

  detail = detail.replace(
    "<InteractiveComponentDemo component={component} />",
    `<InteractiveComponentDemo component={component} />

          <MantineStyleComponentDocs component={component} />`
  );
}

writeText(detailPath, detail);

const componentsPagePath = "apps/docs/src/pages/ComponentsPage.tsx";
let componentsPage = readText(componentsPagePath);

componentsPage = ensureImport(componentsPage, 'import { docsHref } from "../lib/docsRouting";');

componentsPage = componentsPage
  .replace(/href=\{`#\/components\/\$\{component\.kebab\}`\}/g, "href={docsHref(`/components/${component.kebab}`)}")
  .replace(/href=\{`#\/components\/\$\{item\.kebab\}`\}/g, "href={docsHref(`/components/${item.kebab}`)}")
  .replace(/href="#\/components"/g, 'href={docsHref("/components")}');

writeText(componentsPagePath, componentsPage);

const chromePath = "apps/docs/src/components/DocsChrome.tsx";
let chrome = readText(chromePath);

chrome = ensureImport(chrome, 'import { docsHref } from "../lib/docsRouting";');

chrome = chrome
  .replace(/href="#\/"/g, 'href={docsHref("/")}')
  .replace(/href="#\/components"/g, 'href={docsHref("/components")}')
  .replace(/href="#\/release"/g, 'href={docsHref("/release")}')
  .replace(/href=\{`#\/components\/\$\{component\.kebab\}`\}/g, "href={docsHref(`/components/${component.kebab}`)}")
  .replace(/href=\{`#\/components\/\$\{item\.kebab\}`\}/g, "href={docsHref(`/components/${item.kebab}`)}");

writeText(chromePath, chrome);

const cssPath = "apps/docs/src/docs.css";
let css = readText(cssPath);

if (!css.includes(".nd-ms-docs")) {
  css += `
.nd-ms-docs{display:grid;gap:1.25rem}
.nd-ms-section{display:grid;gap:1rem;padding:1rem;border:1px solid var(--nd-line);border-radius:1.25rem;background:linear-gradient(180deg,rgba(15,23,42,.58),rgba(8,17,31,.36))}
.nd-ms-section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}
.nd-ms-section-head h2{margin:.25rem 0 0;font-size:1.5rem;letter-spacing:-.04em}
.nd-ms-section-head p{margin:.35rem 0 0;color:var(--nd-muted);line-height:1.6}
.nd-ms-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
.nd-ms-stack{display:grid;gap:.85rem;margin-top:1rem}
.nd-ms-sample{overflow:hidden;border:1px solid var(--nd-line);border-radius:1rem;background:rgba(2,6,23,.32)}
.nd-ms-sample-label{display:flex;align-items:center;justify-content:space-between;min-height:2.5rem;padding:0 .85rem;border-bottom:1px solid var(--nd-line);color:#ddd6fe;font-size:.78rem;font-weight:950;text-transform:uppercase;letter-spacing:.08em}
.nd-ms-sample .nd-preview-frame{border-radius:0;min-height:12rem}
@media (max-width:920px){.nd-ms-grid{grid-template-columns:1fr}.nd-ms-section-head{display:grid}}
`;
}

writeText(cssPath, css);

console.log("Mantine-style docs patch applied safely.");
