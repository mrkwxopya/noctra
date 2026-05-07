import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const pagePath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const cssPath = "apps/docs/src/docs.css";
const registryPath = "apps/docs/src/data/componentDocsDetailRegistry.ts";
const reportPath = "safe-special-preview-polish-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const page = readText(pagePath);
const registry = readText(registryPath);
const beforeCss = readText(cssPath);

let css = beforeCss;

const cssBlock = `
/* SAFE_SPECIAL_PREVIEW_POLISH_START */

/* Shared special preview base */
.ncu-native-button,
.ncu-native-field,
.ncu-native-listbox,
.ncu-native-table,
.ncu-native-overlay,
.ncu-native-card,
.ncu-native-message,
.ncu-native-layout,
.ncu-native-tabs,
.ncu-native-meter,
.ncu-native-check,
.ncu-native-accordion,
.ncu-native-breadcrumb,
.ncu-native-pagination,
.ncu-native-timeline,
.ncu-native-tree,
.ncu-native-spinner,
.ncu-native-skeleton,
.ncu-native-avatar,
.ncu-native-badge,
.ncu-native-aspect,
.ncu-native-color-picker,
.ncu-native-divider,
.ncu-native-dropzone,
.ncu-native-float-label,
.ncu-native-form-field,
.ncu-native-portal,
.ncu-native-prose,
.ncu-native-scroll-area,
.ncu-native-segmented,
.ncu-native-spacer,
.ncu-native-status-bar,
.ncu-native-visually-hidden {
  box-sizing: border-box;
}

/* Overlay components: Modal, Dialog, Drawer, Popover, Menu, Tooltip */
.ncu-native-overlay {
  display: grid;
  gap: 12px;
  width: min(420px, 100%);
  padding: 14px;
  border: 1px solid rgba(139, 92, 246, .28);
  border-radius: 16px;
  background:
    radial-gradient(circle at 20% 0%, rgba(139, 92, 246, .18), transparent 42%),
    rgba(15, 23, 42, .66);
  box-shadow: 0 20px 70px rgba(0, 0, 0, .24);
}

.ncu-native-overlay button,
.ncu-native-overlay [role="button"] {
  min-height: 34px;
  width: max-content;
  border: 1px solid rgba(139, 92, 246, .40);
  border-radius: 10px;
  background: rgba(139, 92, 246, .18);
  color: #ede9fe;
  padding: 0 12px;
  font: inherit;
  cursor: pointer;
}

.ncu-native-overlay [role="dialog"],
.ncu-native-overlay-panel,
.ncu-native-overlay .ncu-panel,
.ncu-native-overlay article,
.ncu-native-overlay section {
  width: min(360px, 100%);
  padding: 14px;
  border: 1px solid rgba(139, 92, 246, .40);
  border-radius: 16px;
  background: rgba(2, 6, 23, .92);
  box-shadow: 0 24px 80px rgba(0, 0, 0, .34);
}

/* Feedback components: Alert, Toast, Notification */
.ncu-native-message {
  display: grid;
  gap: 6px;
  width: min(420px, 100%);
  padding: 14px;
  border: 1px solid rgba(34, 197, 94, .30);
  border-radius: 16px;
  background: rgba(34, 197, 94, .10);
  color: #dcfce7;
}

.ncu-native-message strong {
  color: #f0fdf4;
}

.ncu-native-message p,
.ncu-native-message span {
  margin: 0;
  color: #bbf7d0;
  font-size: 13px;
  line-height: 1.55;
}

/* Selection components: Select, MultiSelect, ListBox, Combobox */
.ncu-native-listbox {
  display: grid;
  gap: 8px;
  width: min(380px, 100%);
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, .18);
  border-radius: 16px;
  background: rgba(15, 23, 42, .62);
}

.ncu-native-listbox label,
.ncu-native-listbox strong {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 750;
}

.ncu-native-listbox [role="listbox"],
.ncu-native-listbox ul,
.ncu-native-listbox .ncu-list {
  display: grid;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, .18);
  border-radius: 12px;
  background: rgba(2, 6, 23, .42);
}

.ncu-native-listbox [role="option"],
.ncu-native-listbox li,
.ncu-native-listbox span {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(148, 163, 184, .12);
  color: #e5e7eb;
  font-size: 13px;
}

.ncu-native-listbox [aria-selected="true"],
.ncu-native-listbox [data-selected="true"],
.ncu-native-listbox li:first-child,
.ncu-native-listbox span:first-child {
  background: rgba(139, 92, 246, .18);
  color: #ede9fe;
}

.ncu-native-listbox [role="option"]:last-child,
.ncu-native-listbox li:last-child,
.ncu-native-listbox span:last-child {
  border-bottom: 0;
}

/* Data components: Table, DataGrid, TableOfContents */
.ncu-native-table {
  display: grid;
  overflow: hidden;
  width: min(560px, 100%);
  border: 1px solid rgba(148, 163, 184, .18);
  border-radius: 16px;
  background: rgba(15, 23, 42, .62);
}

.ncu-native-table > div,
.ncu-native-table tr {
  display: grid;
  grid-template-columns: 1.35fr 1fr 1fr;
}

.ncu-native-table strong,
.ncu-native-table span,
.ncu-native-table th,
.ncu-native-table td {
  padding: 10px 12px;
  border-right: 1px solid rgba(148, 163, 184, .12);
  border-bottom: 1px solid rgba(148, 163, 184, .12);
  color: #e5e7eb;
  font-size: 13px;
}

.ncu-native-table strong,
.ncu-native-table th {
  color: #f8fafc;
  background: rgba(148, 163, 184, .08);
}

.ncu-native-table strong:last-child,
.ncu-native-table span:last-child,
.ncu-native-table th:last-child,
.ncu-native-table td:last-child {
  border-right: 0;
}

/* Tabs / navigation previews */
.ncu-native-tabs,
.ncu-native-accordion,
.ncu-native-breadcrumb,
.ncu-native-pagination,
.ncu-native-timeline,
.ncu-native-tree {
  display: grid;
  gap: 12px;
  width: min(440px, 100%);
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, .18);
  border-radius: 16px;
  background: rgba(15, 23, 42, .62);
}

.ncu-native-tabs button,
.ncu-native-pagination button {
  min-height: 32px;
  border: 1px solid rgba(148, 163, 184, .18);
  border-radius: 9px;
  background: rgba(15, 23, 42, .75);
  color: #f8fafc;
  padding: 0 10px;
}

.ncu-native-tabs button:first-child,
.ncu-native-pagination button:first-child {
  border-color: rgba(139, 92, 246, .50);
  background: rgba(139, 92, 246, .16);
  color: #ede9fe;
}

/* ColorPicker */
.ncu-native-color-picker {
  display: grid;
  gap: 10px;
  width: 270px;
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, .18);
  border-radius: 16px;
  background: rgba(15, 23, 42, .62);
}

.ncu-native-color-picker::before {
  content: "";
  display: block;
  height: 120px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fff, rgba(139, 92, 246, .95), #111827);
}

.ncu-native-color-picker::after {
  content: "#8B5CF6";
  color: #c4b5fd;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
}

/* Dropzone */
.ncu-native-dropzone {
  display: grid;
  place-items: center;
  gap: 6px;
  width: min(400px, 100%);
  min-height: 150px;
  border: 1px dashed rgba(139, 92, 246, .52);
  border-radius: 18px;
  background: rgba(139, 92, 246, .10);
  color: #ede9fe;
  text-align: center;
}

.ncu-native-dropzone::before {
  content: "Drop files here";
  font-weight: 800;
}

.ncu-native-dropzone::after {
  content: "SVG, PNG, JPG or JSON";
  color: #c4b5fd;
  font-size: 12px;
}

/* Surface / Card / CreditCard */
.ncu-native-card {
  display: grid;
  gap: 10px;
  width: min(430px, 100%);
  padding: 16px;
  border: 1px solid rgba(148, 163, 184, .18);
  border-radius: 18px;
  background:
    radial-gradient(circle at 100% 0%, rgba(139, 92, 246, .12), transparent 38%),
    rgba(15, 23, 42, .62);
}

.ncu-native-card header,
.ncu-native-card footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ncu-native-card p {
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.55;
}

/* Meters */
.ncu-native-meter {
  display: grid;
  gap: 8px;
  width: min(340px, 100%);
  padding: 14px;
  border: 1px solid rgba(148, 163, 184, .18);
  border-radius: 16px;
  background: rgba(15, 23, 42, .62);
}

.ncu-native-meter > div {
  height: 8px;
  border-radius: 999px;
  background: rgba(148, 163, 184, .16);
  overflow: hidden;
}

.ncu-native-meter > div span,
.ncu-native-meter > span {
  display: block;
  width: 62%;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #8b5cf6, #22c55e);
}

/* Configurator state polish */
.ncr-variant-outline,
.ncu-state-variant-outline {
  background: transparent !important;
  border-color: rgba(139, 92, 246, .62) !important;
  color: #ddd6fe !important;
}

.ncr-variant-light,
.ncu-state-variant-light {
  background: rgba(139, 92, 246, .14) !important;
  border-color: rgba(139, 92, 246, .28) !important;
  color: #ede9fe !important;
}

.ncr-variant-subtle,
.ncu-state-variant-subtle {
  background: transparent !important;
  border-color: transparent !important;
  color: #c4b5fd !important;
}

.ncr-tone-success,
.ncu-state-tone-success {
  border-color: rgba(34, 197, 94, .52) !important;
  color: #bbf7d0 !important;
  box-shadow: 0 0 0 1px rgba(34, 197, 94, .18);
}

.ncr-tone-warning,
.ncu-state-tone-warning {
  border-color: rgba(245, 158, 11, .56) !important;
  color: #fde68a !important;
}

.ncr-tone-danger,
.ncu-state-tone-danger {
  border-color: rgba(239, 68, 68, .56) !important;
  color: #fecaca !important;
}

.ncr-size-xs,
.ncu-state-size-xs {
  min-height: 26px !important;
  font-size: 11px !important;
  padding-inline: 8px !important;
}

.ncr-size-sm,
.ncu-state-size-sm {
  min-height: 30px !important;
  font-size: 12px !important;
  padding-inline: 10px !important;
}

.ncr-size-lg,
.ncu-state-size-lg {
  min-height: 42px !important;
  font-size: 15px !important;
  padding-inline: 16px !important;
}

.ncr-size-xl,
.ncu-state-size-xl {
  min-height: 48px !important;
  font-size: 16px !important;
  padding-inline: 20px !important;
}

.ncr-radius-none,
.ncu-state-radius-none {
  border-radius: 0 !important;
}

.ncr-radius-sm,
.ncu-state-radius-sm {
  border-radius: 6px !important;
}

.ncr-radius-lg,
.ncu-state-radius-lg {
  border-radius: 14px !important;
}

.ncr-radius-xl,
.ncu-state-radius-xl {
  border-radius: 18px !important;
}

.ncr-radius-full,
.ncu-state-radius-full {
  border-radius: 999px !important;
}

.ncr-disabled,
.ncu-state-disabled {
  cursor: not-allowed !important;
  opacity: .48 !important;
}

.ncr-loading,
.ncu-state-loading {
  position: relative;
  opacity: .78;
}

.ncr-full-width,
.ncu-state-full-width {
  width: 100% !important;
  display: flex !important;
}

/* SAFE_SPECIAL_PREVIEW_POLISH_END */
`;

const cssPattern = /\/\* SAFE_SPECIAL_PREVIEW_POLISH_START \*\/[\s\S]*?\/\* SAFE_SPECIAL_PREVIEW_POLISH_END \*\//;

css = cssPattern.test(css)
  ? css.replace(cssPattern, cssBlock.trim())
  : `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;

writeText(cssPath, css);

const afterCss = readText(cssPath);
const problems = [];

for (const marker of [
  "SAFE_SPECIAL_PREVIEW_POLISH_START",
  ".ncu-native-overlay",
  ".ncu-native-message",
  ".ncu-native-listbox",
  ".ncu-native-table",
  ".ncu-native-color-picker",
  ".ncu-native-dropzone",
  ".ncu-native-card",
  ".ncr-variant-outline"
]) {
  if (!afterCss.includes(marker)) {
    problems.push(`Missing CSS marker: ${marker}`);
  }
}

for (const marker of [
  "export function getComponentDocsDetail",
  "export function buildComponentSpecificCode",
  "getComponentPreviewKind"
]) {
  if (!registry.includes(marker)) {
    problems.push(`Missing registry marker: ${marker}`);
  }
}

for (const marker of [
  "function NativeVisual",
  "runtimeComponent(slug)",
  "function buildCode",
  "function createPropsRows",
  "function createStylesRows"
]) {
  if (!page.includes(marker)) {
    problems.push(`Missing page marker: ${marker}`);
  }
}

const pageFile = ts.createSourceFile(
  pagePath,
  page,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);

for (const diagnostic of pageFile.parseDiagnostics ?? []) {
  const pos = diagnostic.start ?? 0;
  const lineInfo = pageFile.getLineAndCharacterOfPosition(pos);
  const line = lineInfo.line + 1;
  const col = lineInfo.character + 1;
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

  problems.push(`${pagePath}:${line}:${col} TS${diagnostic.code}: ${message}`);
}

const registryFile = ts.createSourceFile(
  registryPath,
  registry,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS
);

for (const diagnostic of registryFile.parseDiagnostics ?? []) {
  const pos = diagnostic.start ?? 0;
  const lineInfo = registryFile.getLineAndCharacterOfPosition(pos);
  const line = lineInfo.line + 1;
  const col = lineInfo.character + 1;
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

  problems.push(`${registryPath}:${line}:${col} TS${diagnostic.code}: ${message}`);
}

const report = [
  "# Safe Special Preview Polish Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `docs.css changed: ${beforeCss === afterCss ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Did not replace NativeVisual TSX.",
  "- Did not modify UniversalComponentDocPage.tsx.",
  "- Polished existing native preview classes for overlays, feedback, selection, data, tabs, color picker, dropzone, surface, meter and configurator states.",
  "- Verified registry and page markers without risky JSX surgery."
].join("\n");

writeFileSync(reportPath, `${report}\n`, "utf8");
console.log(report);

if (problems.length > 0) {
  process.exitCode = 1;
}
