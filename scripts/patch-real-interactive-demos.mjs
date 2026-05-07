import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const detailPath = "apps/docs/src/pages/ComponentDetailPage.tsx";

if (!existsSync(detailPath)) {
  throw new Error(`Missing ${detailPath}`);
}

let detail = readText(detailPath);

if (!detail.includes("../components/InteractiveComponentDemo")) {
  const importLines = detail.split(/\r?\n/g);
  const lastImportIndex = importLines.findLastIndex((line) => line.startsWith("import "));

  if (lastImportIndex === -1) {
    throw new Error("Could not find import block in ComponentDetailPage.tsx");
  }

  importLines.splice(
    lastImportIndex + 1,
    0,
    'import { InteractiveComponentDemo } from "../components/InteractiveComponentDemo";'
  );

  detail = importLines.join("\n");
}

if (!detail.includes("<InteractiveComponentDemo component={component} />")) {
  const showcaseStackPattern = /<div className="nd-example-stack">\s*([\s\S]*?)\s*<\/div>/;

  if (showcaseStackPattern.test(detail)) {
    detail = detail.replace(
      showcaseStackPattern,
      `<div className="nd-example-stack">
            <InteractiveComponentDemo component={component} />
            $1
          </div>`
    );
  } else {
    const showcaseSectionPattern = /(<section id="showcase" className="nd-doc-section">[\s\S]*?<SectionTitle[\s\S]*?\/>\s*)/;

    if (!showcaseSectionPattern.test(detail)) {
      throw new Error("Could not find showcase section in ComponentDetailPage.tsx");
    }

    detail = detail.replace(
      showcaseSectionPattern,
      `$1
          <div className="nd-example-stack">
            <InteractiveComponentDemo component={component} />
          </div>
`
    );
  }
}

writeText(detailPath, detail);

const cssPath = "apps/docs/src/docs.css";
let css = readText(cssPath);

const runtimeCss = `
.nd-real-demo{overflow:hidden;border:1px solid rgba(139,92,246,.34);border-radius:1.25rem;background:linear-gradient(135deg,rgba(139,92,246,.12),rgba(8,17,31,.64));box-shadow:0 24px 80px rgba(0,0,0,.24)}
.nd-real-demo-header{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:1rem;border-bottom:1px solid var(--nd-line)}
.nd-real-demo-header h3{margin:.25rem 0 0;font-size:1.25rem}
.nd-real-demo-header p{margin:.35rem 0 0;color:var(--nd-muted);line-height:1.55}
.nd-real-demo-tabs{display:flex;align-items:center;gap:.45rem;flex-wrap:wrap}
.nd-real-demo-tabs button,.nd-real-demo-toolbar button{display:inline-flex;align-items:center;justify-content:center;min-height:2.15rem;padding:0 .75rem;border:1px solid var(--nd-line);border-radius:999px;background:rgba(15,23,42,.72);color:var(--nd-muted);font:inherit;font-size:.78rem;font-weight:850;cursor:pointer}
.nd-real-demo-tabs button[data-active]{border-color:var(--nd-line2);background:rgba(139,92,246,.18);color:#ddd6fe}
.nd-real-demo-toolbar{display:flex;align-items:end;gap:.65rem;flex-wrap:wrap;padding:1rem;border-bottom:1px solid var(--nd-line);background:rgba(2,6,23,.22)}
.nd-real-demo-control{display:grid;gap:.28rem;min-width:8rem}
.nd-real-demo-control span,.nd-real-demo-toggle span{color:var(--nd-muted);font-size:.72rem;font-weight:850}
.nd-real-demo-control select{min-height:2.15rem;border:1px solid var(--nd-line);border-radius:.75rem;background:rgba(2,6,23,.55);color:var(--nd-text);padding:0 .65rem}
.nd-real-demo-toggle{display:inline-flex;align-items:center;gap:.45rem;min-height:2.15rem;padding:0 .65rem;border:1px solid var(--nd-line);border-radius:.75rem;background:rgba(2,6,23,.32)}
.nd-real-demo-stage{padding:1rem;background:radial-gradient(circle at 0 0,rgba(139,92,246,.12),transparent 22rem),rgba(2,6,23,.26)}
.nd-real-demo-canvas{min-height:10rem;display:flex;align-items:center;justify-content:center;overflow:auto;padding:1.25rem;border:1px solid var(--nd-line);border-radius:1rem;background:linear-gradient(180deg,rgba(2,6,23,.42),rgba(15,23,42,.28))}
.nd-real-demo-stage[data-canvas="wide"] .nd-real-demo-canvas{justify-content:stretch}
.nd-real-demo-stage[data-canvas="wide"] .nd-real-demo-canvas>*{width:100%;max-width:100%}
.nd-real-demo-stage[data-canvas="compact"] .nd-real-demo-canvas{min-height:6rem;padding:.75rem}
.nd-real-demo-code{padding:1rem}
.nd-real-demo-props{padding:1rem;overflow:auto}
.nd-real-demo-props table{width:100%;border-collapse:collapse;border:1px solid var(--nd-line);border-radius:1rem;overflow:hidden}
.nd-real-demo-props th,.nd-real-demo-props td{padding:.75rem;border-bottom:1px solid var(--nd-line);text-align:left;vertical-align:top}
.nd-real-demo-props th{background:rgba(15,23,42,.72);font-size:.72rem;text-transform:uppercase;letter-spacing:.06em}
.nd-real-demo-props td{color:var(--nd-muted);font-size:.85rem}
.nd-real-demo-props code{color:#bfdbfe;word-break:break-word}
.nd-real-demo-error{display:grid;gap:.35rem;padding:1rem;border:1px solid rgba(239,68,68,.28);border-radius:1rem;background:rgba(239,68,68,.08);color:#fecaca}
.nd-real-demo-error span,.nd-real-demo-error small{color:#fca5a5}
@media (max-width:760px){.nd-real-demo-header{display:grid}.nd-real-demo-toolbar{display:grid}.nd-real-demo-control{min-width:0}.nd-real-demo-tabs{justify-content:flex-start}}
`;

if (!css.includes(".nd-real-demo{")) {
  css = `${css.trimEnd()}\n${runtimeCss}\n`;
  writeText(cssPath, css);
}

console.log("Real interactive component demos patched into ComponentDetailPage.");