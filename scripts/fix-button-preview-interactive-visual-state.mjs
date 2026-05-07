import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const runtimePath = "apps/docs/src/components/docs-system/NoctraRuntimeMock.tsx";
const cssPath = "apps/docs/src/docs.css";
const reportPath = "button-preview-interactive-visual-state-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let runtime = readText(runtimePath);
let css = readText(cssPath);

if (!runtime) throw new Error(`${runtimePath} missing or empty.`);
if (!css) throw new Error(`${cssPath} missing or empty.`);

const beforeRuntime = runtime;
const beforeCss = css;

function insertBefore(source, marker, block) {
  if (source.includes(block.trim().split("\n")[0])) return source;

  const index = source.indexOf(marker);

  if (index < 0) {
    throw new Error(`Marker not found: ${marker}`);
  }

  return `${source.slice(0, index)}${block.trimEnd()}\n\n${source.slice(index)}`;
}

const helpers = `
function safeAttr(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

function boolAttr(value: unknown): string | undefined {
  return value === true ? "true" : undefined;
}

function mockStateClass(displayName: string, props: Record<string, unknown>): string {
  const parts = [
    "ncr-mock",
    \`ncr-mock-\${kebab(displayName)}\`
  ];

  const variant = safeAttr(props.variant);
  const tone = safeAttr(props.tone);
  const size = safeAttr(props.size);
  const radius = safeAttr(props.radius);

  if (variant) parts.push(\`ncr-variant-\${kebab(variant)}\`);
  if (tone) parts.push(\`ncr-tone-\${kebab(tone)}\`);
  if (size) parts.push(\`ncr-size-\${kebab(size)}\`);
  if (radius) parts.push(\`ncr-radius-\${kebab(radius)}\`);
  if (props.loading === true) parts.push("ncr-loading");
  if (props.disabled === true) parts.push("ncr-disabled");
  if (props.fullWidth === true) parts.push("ncr-full-width");

  return parts.join(" ");
}
`;

runtime = insertBefore(runtime, "function createNoctraMock", helpers);

runtime = runtime.replace(
  /const commonProps: Record<string, unknown> = \{\s*\.\.\.safeProps,\s*ref,\s*className: cx\("ncr-mock", `ncr-mock-\$\{kebab\(displayName\)\}`, className\),\s*style: typeof style === "object" && style !== null && !Array\.isArray\(style\) \? style : undefined\s*\};/s,
  `const commonProps: Record<string, unknown> = {
      ...safeProps,
      ref,
      className: cx(mockStateClass(displayName, props as Record<string, unknown>), className),
      style: typeof style === "object" && style !== null && !Array.isArray(style) ? style : undefined,
      "data-variant": safeAttr((props as Record<string, unknown>).variant),
      "data-tone": safeAttr((props as Record<string, unknown>).tone),
      "data-size": safeAttr((props as Record<string, unknown>).size),
      "data-radius": safeAttr((props as Record<string, unknown>).radius),
      "data-loading": boolAttr((props as Record<string, unknown>).loading),
      "data-full-width": boolAttr((props as Record<string, unknown>).fullWidth)
    };`
);

runtime = runtime.replace(
  /commonProps\.disabled = Boolean\(disabled\);/g,
  `commonProps.disabled = Boolean(disabled || (props as Record<string, unknown>).loading === true);`
);

const cssBlock = `
/* BUTTON_PREVIEW_INTERACTIVE_VISUAL_STATE_START */
.ncd3-topbar{display:none!important}
.ncd3-content{min-height:100vh}
.ncr-mock-button{min-width:96px;font-weight:650;transition:background .12s ease,border-color .12s ease,color .12s ease,transform .12s ease,opacity .12s ease}
.ncr-mock-button:hover{transform:translateY(-1px)}
.ncr-mock-button.ncr-full-width{width:100%}
.ncr-mock-button.ncr-size-xs{min-height:26px;padding:0 9px;font-size:11px}
.ncr-mock-button.ncr-size-sm{min-height:30px;padding:0 11px;font-size:12px}
.ncr-mock-button.ncr-size-md{min-height:36px;padding:0 14px;font-size:13px}
.ncr-mock-button.ncr-size-lg{min-height:42px;padding:0 18px;font-size:14px}
.ncr-mock-button.ncr-size-xl{min-height:48px;padding:0 22px;font-size:15px}
.ncr-mock-button.ncr-radius-none{border-radius:0}
.ncr-mock-button.ncr-radius-xs{border-radius:4px}
.ncr-mock-button.ncr-radius-sm{border-radius:7px}
.ncr-mock-button.ncr-radius-md{border-radius:10px}
.ncr-mock-button.ncr-radius-lg{border-radius:14px}
.ncr-mock-button.ncr-radius-xl{border-radius:18px}
.ncr-mock-button.ncr-radius-full{border-radius:999px}
.ncr-mock-button.ncr-tone-neutral{background:rgba(148,163,184,.18);border-color:rgba(148,163,184,.35);color:#e5e7eb}
.ncr-mock-button.ncr-tone-primary{background:rgba(139,92,246,.34);border-color:rgba(139,92,246,.62);color:#ede9fe}
.ncr-mock-button.ncr-tone-success{background:rgba(34,197,94,.22);border-color:rgba(34,197,94,.50);color:#bbf7d0}
.ncr-mock-button.ncr-tone-warning{background:rgba(245,158,11,.22);border-color:rgba(245,158,11,.52);color:#fde68a}
.ncr-mock-button.ncr-tone-danger{background:rgba(239,68,68,.22);border-color:rgba(239,68,68,.52);color:#fecaca}
.ncr-mock-button.ncr-tone-info{background:rgba(56,189,248,.20);border-color:rgba(56,189,248,.50);color:#bae6fd}
.ncr-mock-button.ncr-variant-filled{box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
.ncr-mock-button.ncr-variant-light{background:rgba(148,163,184,.10);border-color:rgba(148,163,184,.24)}
.ncr-mock-button.ncr-variant-outline{background:transparent}
.ncr-mock-button.ncr-variant-subtle{background:transparent;border-color:transparent}
.ncr-mock-button.ncr-variant-ghost{background:transparent;border-color:transparent;color:#c4b5fd}
.ncr-mock-button.ncr-loading{position:relative;color:transparent!important;pointer-events:none}
.ncr-mock-button.ncr-loading::after{content:"";position:absolute;width:14px;height:14px;border-radius:999px;border:2px solid currentColor;border-right-color:transparent;color:#fff;animation:ncr-spin .8s linear infinite}
.ncr-mock-button.ncr-disabled,.ncr-mock-button:disabled{opacity:.46;cursor:not-allowed;transform:none}
@keyframes ncr-spin{to{transform:rotate(360deg)}}
/* BUTTON_PREVIEW_INTERACTIVE_VISUAL_STATE_END */
`;

const cssPattern = /\/\* BUTTON_PREVIEW_INTERACTIVE_VISUAL_STATE_START \*\/[\s\S]*?\/\* BUTTON_PREVIEW_INTERACTIVE_VISUAL_STATE_END \*\//;

css = cssPattern.test(css)
  ? css.replace(cssPattern, cssBlock.trim())
  : `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;

writeText(runtimePath, runtime);
writeText(cssPath, css);

const afterRuntime = readText(runtimePath);
const afterCss = readText(cssPath);

const problems = [];

for (const required of [
  "mockStateClass",
  "data-variant",
  "data-tone",
  "data-size",
  "data-radius",
  "ncr-tone-primary",
  "ncr-variant-outline",
  "BUTTON_PREVIEW_INTERACTIVE_VISUAL_STATE_START",
  ".ncd3-topbar{display:none!important}"
]) {
  if (!afterRuntime.includes(required) && !afterCss.includes(required)) {
    problems.push(`Missing preview state fix: ${required}`);
  }
}

const result = ts.transpileModule(afterRuntime, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: runtimePath
});

for (const diagnostic of result.diagnostics ?? []) {
  problems.push(`${runtimePath} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Button Preview Interactive Visual State Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Runtime changed: ${beforeRuntime === afterRuntime ? "no" : "yes"}`,
  `CSS changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Hid docs top header.",
  "- Added variant/tone/size/radius/loading/disabled/fullWidth visual classes to docs runtime mock.",
  "- Added data attributes for preview debugging.",
  "- Added CSS states so clicking Button controls visibly changes the preview."
].join("\n");

writeText(reportPath, report);

console.log(`Button preview interactive visual state completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Button preview interactive visual state failed.");
}
