import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function walkCss(root) {
  if (!existsSync(root)) return [];

  const output = [];

  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      output.push(...walkCss(fullPath));
      continue;
    }

    if (entry.endsWith(".css")) {
      output.push(fullPath.replace(/\\/g, "/"));
    }
  }

  return output.sort((a, b) => a.localeCompare(b));
}

function relativeImportFromDocsSrc(path) {
  return `../../../${path}`;
}

const styleCssFiles = walkCss("packages/styles/src");
const bridgeImports = styleCssFiles.map((file) => `@import "${relativeImportFromDocsSrc(file)}";`);

const bridge = [
  "/* Generated docs style bridge. Keeps professional docs previews aligned with real Noctra styles. */",
  ...bridgeImports,
  "",
  ":root {",
  "  --nc-docs-preview-bg: #020617;",
  "  --nc-docs-preview-surface: #0b1220;",
  "  --nc-docs-preview-border: rgba(148, 163, 184, .18);",
  "  --nc-docs-preview-text: #f8fafc;",
  "  --nc-docs-preview-muted: #94a3b8;",
  "  --nc-docs-preview-accent: 139, 92, 246;",
  "}",
  "",
  ".nd-noctra-runtime {",
  "  color: var(--nc-docs-preview-text);",
  "  color-scheme: dark;",
  "}",
  "",
  ".nd-noctra-runtime *,",
  ".nd-noctra-runtime *::before,",
  ".nd-noctra-runtime *::after {",
  "  box-sizing: border-box;",
  "}",
  ""
].join("\n");

writeText("apps/docs/src/noctra-style-bridge.css", bridge);

const mainPath = "apps/docs/src/main.tsx";
let main = readText(mainPath);

if (!main.includes("./noctra-style-bridge.css")) {
  main = main.replace('import "./docs.css";', 'import "./noctra-style-bridge.css";\nimport "./docs.css";');
}

writeText(mainPath, main);

const chromePath = "apps/docs/src/components/DocsChrome.tsx";
let chrome = readText(chromePath);

if (!chrome.includes("function ExampleRuntimeNotice")) {
  const insertAfterCopyButton = `
function ExampleRuntimeNotice() {
  return (
    <div className="nd-example-runtime-notice">
      <span>Live preview</span>
      <small>Rendered inside the docs runtime with Noctra styles loaded.</small>
    </div>
  );
}
`;

  chrome = chrome.replace("export function ExampleBlock(", `${insertAfterCopyButton}\nexport function ExampleBlock(`);
}

const start = chrome.indexOf("export function ExampleBlock(");
const end = chrome.indexOf("export function SectionTitle", start);

if (start === -1 || end === -1) {
  throw new Error("Could not locate ExampleBlock replacement boundaries in DocsChrome.tsx");
}

const replacement = `export function ExampleBlock({ title, description, code, preview }: { title: ReactNode; description?: ReactNode; code: string; preview: ReactNode }) {
  const [activeTab, setActiveTab] = useState("preview");

  return (
    <section className="nd-example">
      <div className="nd-example-header">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>

        <div className="nd-example-actions">
          <button
            className="nd-example-tab"
            type="button"
            data-active={activeTab === "preview" || undefined}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
          <button
            className="nd-example-tab"
            type="button"
            data-active={activeTab === "code" || undefined}
            onClick={() => setActiveTab("code")}
          >
            Code
          </button>
          <CopyButton value={code} />
        </div>
      </div>

      {activeTab === "preview" ? (
        <div className="nd-example-preview nd-noctra-runtime">
          <ExampleRuntimeNotice />
          <div className="nd-example-canvas">{preview}</div>
        </div>
      ) : (
        <div className="nd-example-code-panel">
          <CodeBlock>{code}</CodeBlock>
        </div>
      )}
    </section>
  );
}

`;

chrome = `${chrome.slice(0, start)}${replacement}${chrome.slice(end)}`;

writeText(chromePath, chrome);

let css = readText("apps/docs/src/docs.css");

const runtimeCss = `
.nd-example-actions{display:flex;align-items:center;gap:.45rem;flex-wrap:wrap}
.nd-example-tab{display:inline-flex;align-items:center;justify-content:center;min-height:2.15rem;padding:0 .75rem;border:1px solid var(--nd-line);border-radius:999px;background:rgba(15,23,42,.7);color:var(--nd-muted);font:inherit;font-size:.78rem;font-weight:850;cursor:pointer}
.nd-example-tab[data-active]{border-color:var(--nd-line2);background:rgba(139,92,246,.16);color:#ddd6fe}
.nd-example-runtime-notice{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem;padding:.65rem .8rem;border:1px solid rgba(34,197,94,.22);border-radius:.9rem;background:rgba(34,197,94,.07)}
.nd-example-runtime-notice span{color:#86efac;font-size:.76rem;font-weight:950;text-transform:uppercase;letter-spacing:.08em}
.nd-example-runtime-notice small{color:var(--nd-muted);font-size:.76rem}
.nd-example-canvas{position:relative;overflow:auto;min-height:8rem;padding:1rem;border:1px solid var(--nd-line);border-radius:1rem;background:radial-gradient(circle at 0 0,rgba(139,92,246,.12),transparent 18rem),linear-gradient(180deg,rgba(2,6,23,.48),rgba(2,6,23,.28))}
.nd-example-code-panel{padding:1rem;background:rgba(2,6,23,.3)}
.nd-noctra-runtime :where(button,input,select,textarea){font:inherit}
.nd-noctra-runtime :where(a){color:inherit}
.nd-noctra-runtime :where(.nc-button,.noctra-button,button){min-height:2.25rem}
.nd-noctra-runtime :where(.nc-card,.noctra-card){max-width:100%}
@media (max-width:760px){.nd-example-header{display:grid}.nd-example-actions{justify-content:flex-start}.nd-example-runtime-notice{display:grid}}
`;

if (!css.includes(".nd-example-runtime-notice")) {
  css = `${css.trimEnd()}\n${runtimeCss}\n`;
}

writeText("apps/docs/src/docs.css", css);

const packagePath = "apps/docs/package.json";

if (existsSync(packagePath)) {
  const json = JSON.parse(readText(packagePath));
  json.dependencies = json.dependencies ?? {};

  if (!json.dependencies["@noctra/styles"]) {
    json.dependencies["@noctra/styles"] = "workspace:*";
  }

  if (!json.dependencies["@noctra/react"]) {
    json.dependencies["@noctra/react"] = "workspace:*";
  }

  writeText(packagePath, JSON.stringify(json, null, 2));
}

console.log(`Docs example runtime patched. Style imports: ${styleCssFiles.length}.`);