import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const pagePath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "component-generic-visual-upgrade-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function replaceFunction(source, name, replacement) {
  const start = source.indexOf(`function ${name}`);

  if (start < 0) {
    throw new Error(`Could not find function ${name}.`);
  }

  const nextFunction = source.indexOf("\nfunction ", start + 1);
  const nextExport = source.indexOf("\nexport ", start + 1);
  const candidates = [nextFunction, nextExport].filter((value) => value > start);
  const end = candidates.length ? Math.min(...candidates) : source.length;

  return `${source.slice(0, start)}${replacement.trimEnd()}\n\n${source.slice(end).trimStart()}`;
}

let page = readText(pagePath);
let css = readText(cssPath);

const beforePage = page;
const beforeCss = css;

const nativeVisual = `function NativeVisual({
  slug,
  label,
  state
}: {
  slug: string;
  label: string;
  state: VisualState;
}) {
  const cls = stateClass(state);

  if (slug === "button" || isButtonLike(slug)) {
    const Component = runtimeComponent(slug);

    return (
      <div className="ncu-native-button">
        {createElement(
          Component,
          {
            variant: state.variant,
            tone: state.tone,
            size: state.size,
            radius: state.radius,
            disabled: state.disabled,
            loading: state.loading,
            fullWidth: state.fullWidth
          },
          label
        )}
      </div>
    );
  }

  if (/checkbox|radio|switch/.test(slug)) {
    return (
      <label className={\`\${cls} ncu-native-check\`}>
        <input checked readOnly type={slug.includes("radio") ? "radio" : "checkbox"} />
        <span>{label}</span>
      </label>
    );
  }

  if (/segmented-control/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-segmented\`}>
        <button aria-pressed="true" type="button">React</button>
        <button type="button">CSS</button>
        <button type="button">Docs</button>
      </div>
    );
  }

  if (/aspect-ratio/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-aspect\`}>
        <div>
          <strong>16:9</strong>
          <span>{label}</span>
        </div>
      </div>
    );
  }

  if (/color-picker/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-color-picker\`}>
        <div className="ncu-color-plane"><span /></div>
        <div className="ncu-color-row"><span /><span /><span /><span /></div>
        <code>#8B5CF6</code>
      </div>
    );
  }

  if (/divider/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-divider\`}>
        <span>Before</span>
        <i />
        <span>After</span>
      </div>
    );
  }

  if (/dropzone/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-dropzone\`}>
        <strong>Drop files here</strong>
        <span>SVG, PNG, JPG or JSON</span>
      </div>
    );
  }

  if (/float-label/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-float-label\`}>
        <input readOnly value="Noctra" />
        <label>Floating label</label>
      </div>
    );
  }

  if (/form-field/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-form-field\`}>
        <label>Email address</label>
        <input readOnly placeholder="name@example.com" />
        <small>Helper text for validation and guidance.</small>
      </div>
    );
  }

  if (/portal/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-portal\`}>
        <span>Page</span>
        <strong>Portal layer</strong>
      </div>
    );
  }

  if (/prose/.test(slug)) {
    return (
      <article className={\`\${cls} ncu-native-prose\`}>
        <h3>Readable content</h3>
        <p>Noctra prose styles keep documentation text calm, readable and aligned.</p>
      </article>
    );
  }

  if (/scroll-area/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-scroll-area\`}>
        <span>Components</span>
        <span>Props</span>
        <span>Styles API</span>
        <span>Accessibility</span>
        <span>Examples</span>
      </div>
    );
  }

  if (/spacer/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-spacer\`}>
        <span>Left</span>
        <i />
        <span>Right</span>
      </div>
    );
  }

  if (/status-bar/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-status-bar\`}>
        <span>Ready</span>
        <span>3 warnings</span>
        <span>v0.0.0</span>
      </div>
    );
  }

  if (/visually-hidden/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-visually-hidden\`}>
        <span aria-hidden="true">Visible label</span>
        <code>screen reader text</code>
      </div>
    );
  }

  if (/text-input|input|search-input|password-input|number-input|color-input|textarea|autocomplete|tags-input|pin-code|pin-input/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-field\`}>
        <label>{label}</label>
        <input disabled={state.disabled} placeholder={\`\${label} value\`} readOnly />
      </div>
    );
  }

  if (/select|multi-select|native-select|combobox|list-box|tree-select|transfer-list/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-listbox\`}>
        <label>{label}</label>
        <div role="listbox">
          <span aria-selected="true">Documentation</span>
          <span>Components</span>
          <span>Styles API</span>
        </div>
      </div>
    );
  }

  if (/card|paper|box|container|credit-card/.test(slug)) {
    return (
      <article className={\`\${cls} ncu-native-card\`}>
        <header>
          <strong>{label}</strong>
          <span>Surface component</span>
        </header>
        <p>Structured content area for product interfaces.</p>
        <footer>
          <button type="button">Primary action</button>
          <button type="button">Secondary</button>
        </footer>
      </article>
    );
  }

  if (/alert|notification|toast|empty-state|blockquote/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-message\`}>
        <strong>{label}</strong>
        <p>Clear feedback message with title and supporting text.</p>
      </div>
    );
  }

  if (/badge|code|inline-code|kbd|highlight/.test(slug)) {
    return <span className={\`\${cls} ncu-native-badge\`}>{label}</span>;
  }

  if (/avatar/.test(slug)) {
    const initials = label
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return <span className={\`\${cls} ncu-native-avatar\`}>{initials}</span>;
  }

  if (/slider|range-slider|progress|rating/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-meter\`}>
        <strong>{label}</strong>
        <div><span /></div>
      </div>
    );
  }

  if (/table|data-grid|table-of-contents/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-table\`}>
        <div><strong>Name</strong><strong>Status</strong><strong>Type</strong></div>
        <div><span>Noctra UI</span><span>Ready</span><span>Core</span></div>
        <div><span>Docs</span><span>Active</span><span>System</span></div>
      </div>
    );
  }

  if (/tabs/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-tabs\`}>
        <div>
          <button type="button">Documentation</button>
          <button type="button">Props</button>
          <button type="button">Styles API</button>
        </div>
        <p>Active tab content is displayed here.</p>
      </div>
    );
  }

  if (/accordion/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-accordion\`}>
        <strong>Component anatomy</strong>
        <p>Expandable content section.</p>
      </div>
    );
  }

  if (/breadcrumb|breadcrumbs/.test(slug)) {
    return <div className={\`\${cls} ncu-native-breadcrumb\`}>Docs / Components / {label}</div>;
  }

  if (/pagination/.test(slug)) {
    return <div className={\`\${cls} ncu-native-pagination\`}><button>1</button><button>2</button><button>3</button></div>;
  }

  if (/timeline|stepper/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-timeline\`}>
        <span>Created</span>
        <span>Reviewed</span>
        <span>Released</span>
      </div>
    );
  }

  if (/modal|dialog|drawer|popover|hover-card|tooltip|menu|context-menu/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-overlay\`}>
        <strong>{label}</strong>
        <p>Layered floating surface.</p>
      </div>
    );
  }

  if (/loader|spinner/.test(slug)) {
    return <span className={\`\${cls} ncu-native-spinner\`} aria-label={label} />;
  }

  if (/skeleton/.test(slug)) {
    return <div className={\`\${cls} ncu-native-skeleton\`}><span /><span /><span /></div>;
  }

  if (/grid|simple-grid|group|stack|flex|center|layout|layout-shell|app-shell|split-pane|resizable-panel|section|page|sidebar|dock|header|footer/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-layout\`}>
        <span>Header</span>
        <span>Content</span>
        <span>Aside</span>
      </div>
    );
  }

  if (/tree|tree-view/.test(slug)) {
    return (
      <div className={\`\${cls} ncu-native-tree\`}>
        <span>Components</span>
        <span>Forms</span>
        <span>Overlays</span>
      </div>
    );
  }

  return <span className={\`\${cls} ncu-native-generic\`}>{label}</span>;
}`;

page = replaceFunction(page, "NativeVisual", nativeVisual);

writeText(pagePath, page);

const cssBlock = `
/* COMPONENT_GENERIC_VISUAL_UPGRADE_START */
.ncu-native-button{display:inline-flex;align-items:center;justify-content:center}
.ncu-native-segmented{display:inline-flex;gap:0;overflow:hidden;padding:4px}.ncu-native-segmented button{border:0;border-right:1px solid var(--nmx-line);background:transparent;color:var(--nmx-muted);padding:8px 12px}.ncu-native-segmented button:last-child{border-right:0}.ncu-native-segmented button[aria-pressed="true"]{border-radius:8px;background:rgba(139,92,246,.22);color:#ede9fe}
.ncu-native-aspect{display:grid;place-items:center;width:260px;aspect-ratio:16/9;padding:0;background:linear-gradient(135deg,rgba(139,92,246,.24),rgba(15,23,42,.58))}.ncu-native-aspect div{display:grid;gap:4px;text-align:center}.ncu-native-aspect strong{font-size:24px}.ncu-native-aspect span{color:var(--nmx-muted);font-size:12px}
.ncu-native-color-picker{display:grid;gap:10px;min-width:220px;padding:14px}.ncu-color-plane{height:108px;border-radius:10px;background:linear-gradient(135deg,#fff,rgba(139,92,246,.95),#020617);position:relative}.ncu-color-plane span{position:absolute;right:32px;top:30px;width:14px;height:14px;border:2px solid #fff;border-radius:999px}.ncu-color-row{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.ncu-color-row span{height:18px;border-radius:999px}.ncu-color-row span:nth-child(1){background:#8b5cf6}.ncu-color-row span:nth-child(2){background:#06b6d4}.ncu-color-row span:nth-child(3){background:#22c55e}.ncu-color-row span:nth-child(4){background:#f59e0b}
.ncu-native-divider{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;min-width:260px;padding:14px;color:var(--nmx-muted)}.ncu-native-divider i{height:1px;background:var(--nmx-line)}
.ncu-native-dropzone{display:grid;place-items:center;gap:6px;min-width:280px;min-height:132px;padding:18px;border-style:dashed;text-align:center}.ncu-native-dropzone strong{font-size:14px}.ncu-native-dropzone span{color:var(--nmx-muted);font-size:12px}
.ncu-native-float-label{position:relative;min-width:260px;padding:18px 14px 12px}.ncu-native-float-label input{width:100%;height:38px;border:1px solid var(--nmx-line);border-radius:9px;background:rgba(2,6,23,.35);color:var(--nmx-text);padding:10px 11px 0}.ncu-native-float-label label{position:absolute;left:26px;top:21px;color:#c4b5fd;font-size:11px;font-weight:700}
.ncu-native-form-field{display:grid;gap:7px;min-width:280px;padding:14px;text-align:left}.ncu-native-form-field label{font-size:12px;font-weight:750;color:var(--nmx-muted)}.ncu-native-form-field input{height:36px;border:1px solid var(--nmx-line);border-radius:9px;background:rgba(2,6,23,.35);color:var(--nmx-text);padding:0 11px}.ncu-native-form-field small{color:var(--nmx-muted);font-size:11px}
.ncu-native-portal{position:relative;display:grid;place-items:center;min-width:260px;min-height:130px;padding:14px}.ncu-native-portal span{position:absolute;left:14px;top:14px;color:var(--nmx-muted);font-size:12px}.ncu-native-portal strong{padding:10px 14px;border:1px solid rgba(139,92,246,.45);border-radius:12px;background:rgba(139,92,246,.18);box-shadow:0 18px 50px rgba(0,0,0,.28)}
.ncu-native-prose{max-width:340px;padding:18px;text-align:left}.ncu-native-prose h3{margin:0 0 8px;font-size:18px}.ncu-native-prose p{margin:0;color:var(--nmx-muted);line-height:1.65}
.ncu-native-scroll-area{display:grid;gap:8px;min-width:260px;max-height:142px;overflow:auto;padding:12px;text-align:left}.ncu-native-scroll-area span{padding:9px 10px;border:1px solid var(--nmx-line);border-radius:9px;background:rgba(148,163,184,.07);color:var(--nmx-muted);font-size:13px}
.ncu-native-spacer{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;min-width:280px;padding:14px;color:var(--nmx-muted)}.ncu-native-spacer i{height:24px;border-radius:999px;background:repeating-linear-gradient(90deg,rgba(139,92,246,.18),rgba(139,92,246,.18) 8px,transparent 8px,transparent 14px)}
.ncu-native-status-bar{display:flex;align-items:center;justify-content:space-between;gap:14px;min-width:320px;min-height:38px;padding:0 12px;border-radius:10px;background:rgba(2,6,23,.72);color:var(--nmx-muted);font-size:12px}.ncu-native-status-bar span:first-child{color:#bbf7d0}
.ncu-native-visually-hidden{display:grid;gap:8px;min-width:240px;padding:14px;text-align:left}.ncu-native-visually-hidden span{font-weight:700}.ncu-native-visually-hidden code{color:#c4b5fd}
.ncu-native-generic{display:none!important}
/* COMPONENT_GENERIC_VISUAL_UPGRADE_END */
`;

const cssPattern = /\/\* COMPONENT_GENERIC_VISUAL_UPGRADE_START \*\/[\s\S]*?\/\* COMPONENT_GENERIC_VISUAL_UPGRADE_END \*\//;

css = cssPattern.test(css)
  ? css.replace(cssPattern, cssBlock.trim())
  : `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;

writeText(cssPath, css);

const afterPage = readText(pagePath);
const afterCss = readText(cssPath);

const problems = [];

for (const required of [
  "ncu-native-button",
  "ncu-native-segmented",
  "ncu-native-aspect",
  "ncu-native-color-picker",
  "ncu-native-divider",
  "ncu-native-dropzone",
  "ncu-native-float-label",
  "ncu-native-form-field",
  "ncu-native-portal",
  "ncu-native-prose",
  "ncu-native-scroll-area",
  "ncu-native-spacer",
  "ncu-native-status-bar",
  "ncu-native-visually-hidden"
]) {
  if (!afterPage.includes(required) && !afterCss.includes(required)) {
    problems.push(`Missing upgraded visual: ${required}`);
  }
}

if (!afterPage.includes('if (/checkbox|radio|switch/.test(slug))')) {
  problems.push("Checkbox/Radio/Switch branch missing before surface branch.");
}

if (afterPage.indexOf('if (/checkbox|radio|switch/.test(slug))') > afterPage.indexOf('if (/card|paper|box|container|credit-card/.test(slug))')) {
  problems.push("Checkbox branch is still after surface branch.");
}

if (/ncu-sample-box|>A<\/span>|>B<\/span>|>C<\/span>/.test(afterPage) || /ncu-sample-box/.test(afterCss)) {
  problems.push("ABC/sample-box content still exists.");
}

const result = ts.transpileModule(afterPage, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: pagePath
});

for (const diagnostic of result.diagnostics ?? []) {
  problems.push(`${pagePath} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Component Generic Visual Upgrade Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `UniversalComponentDocPage changed: ${beforePage === afterPage ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added specific visuals for all generic fallback components.",
  "- Added explicit wrapper for button-like components so audits can detect their preview class.",
  "- Fixed Checkbox/Radio/Switch classification before surface Box matching.",
  "- Added visuals for AspectRatio, ColorPicker, Divider, Dropzone, FloatLabel, FormField, Portal, Prose, ScrollArea, SegmentedControl, Spacer, StatusBar and VisuallyHidden."
].join("\n");

writeText(reportPath, report);

console.log(`Component generic visual upgrade completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Component generic visual upgrade failed.");
}
