import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const filePath = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const reportPath = "full-mantine-shell-compat-types-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let text = readText(filePath);

if (!text) {
  throw new Error(`${filePath} missing or empty.`);
}

const before = text;

const sectionReplacement = `export function NoctraDocsSection({
  title,
  description,
  children,
  id,
  eyebrow
}: {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  id?: string;
  eyebrow?: ReactNode;
}) {
  return (
    <section className="nmx-section" id={id}>
      {eyebrow ? <div className="nmx-section-eyebrow">{eyebrow}</div> : null}
      {title ? <h2>{title}</h2> : null}
      {description ? <p className="nmx-section-description">{description}</p> : null}
      {children}
    </section>
  );
}

`;

text = text.replace(
  /export function NoctraDocsSection\([\s\S]*?\n}\n\nexport function NoctraDocsDemo/,
  `${sectionReplacement}export function NoctraDocsDemo`
);

const demoReplacement = `export function NoctraDocsDemo({
  title,
  description,
  children,
  code,
  preview,
  controls
}: {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  code?: string;
  preview?: ReactNode;
  controls?: ReactNode;
}) {
  const previewNode = preview ?? children;

  return (
    <section className="nmx-demo">
      {title || description ? (
        <div className="nmx-demo-head">
          {title ? <h3>{title}</h3> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}

      {controls ? <div className="nmx-demo-controls">{controls}</div> : null}
      <div className="nmx-demo-preview">{previewNode}</div>

      {code ? <NoctraDocsCodeBlock code={code} /> : null}
    </section>
  );
}

`;

text = text.replace(
  /export function NoctraDocsDemo\([\s\S]*?\n}\n\nexport function NoctraDocsCodeBlock/,
  `${demoReplacement}export function NoctraDocsCodeBlock`
);

const tableCellReplacement = `function tableCellValue(row: NoctraDocsTableRow, column: string, index: number): ReactNode {
  if (Array.isArray(row)) return row[index] ?? "—";

  const record = row as Record<string, ReactNode>;
  return record[column] ?? record[column.toLowerCase()] ?? "—";
}

`;

text = text.replace(
  /function tableCellValue\([\s\S]*?\n}\n\nexport function NoctraDocsTable/,
  `${tableCellReplacement}export function NoctraDocsTable`
);

const compatBlock = `
/* FULL_MANTINE_COMPAT_COMPONENTS_START */
export const NoctraCodeBlock = NoctraDocsCodeBlock;
export const NoctraDocsPreviousNext = NoctraDocsPrevNext;
export const NoctraDocsSimpleTable = NoctraDocsTable;

export type NoctraDocsControlOption<T extends string = string> =
  | T
  | {
      label?: ReactNode;
      value: T;
    };

function controlOptionValue<T extends string>(option: NoctraDocsControlOption<T>): T {
  return typeof option === "string" ? option : option.value;
}

function controlOptionLabel<T extends string>(option: NoctraDocsControlOption<T>): ReactNode {
  return typeof option === "string" ? option : option.label ?? option.value;
}

export function NoctraDocsControlGroup<T extends string = string>({
  label,
  value,
  options = [],
  onChange,
  children
}: {
  label?: ReactNode;
  value?: T;
  options?: readonly NoctraDocsControlOption<T>[];
  onChange?: (value: T) => void;
  children?: ReactNode;
}) {
  return (
    <div className="nmx-control-group">
      {label ? <label>{label}</label> : null}

      {children ?? (
        <div className="nmx-control-options">
          {options.map((option) => {
            const optionValue = controlOptionValue(option);
            const selected = value === optionValue;

            return (
              <button
                aria-pressed={selected}
                key={optionValue}
                onClick={() => onChange?.(optionValue)}
                type="button"
              >
                {controlOptionLabel(option)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function NoctraDocsBooleanControl({
  label,
  checked,
  value,
  onChange
}: {
  label?: ReactNode;
  checked?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
}) {
  const resolved = Boolean(checked ?? value);

  return (
    <label className="nmx-boolean-control">
      <input
        checked={resolved}
        onChange={(event) => onChange?.(event.currentTarget.checked)}
        type="checkbox"
      />
      <span>{label}</span>
    </label>
  );
}

export function NoctraDocsExampleGrid({
  children
}: {
  children?: ReactNode;
}) {
  return <div className="nmx-example-grid">{children}</div>;
}

export function NoctraDocsExampleCard({
  title,
  description,
  children,
  preview,
  code,
  controls
}: {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  preview?: ReactNode;
  code?: string;
  controls?: ReactNode;
}) {
  return (
    <NoctraDocsDemo
      code={code}
      controls={controls}
      description={description}
      preview={preview ?? children}
      title={title}
    />
  );
}

export function NoctraDocsPropsPanel({
  title = "Props",
  rows = [],
  children
}: {
  title?: ReactNode;
  rows?: readonly NoctraDocsPropRow[];
  children?: ReactNode;
}) {
  return children ? (
    <section className="nmx-table-block">
      <h3>{title}</h3>
      {children}
    </section>
  ) : (
    <NoctraDocsPropsTable rows={rows} title={title} />
  );
}

export function NoctraDocsStylesApiPanel({
  title = "Styles API",
  rows = [],
  children
}: {
  title?: ReactNode;
  rows?: readonly NoctraDocsStyleRow[];
  children?: ReactNode;
}) {
  return children ? (
    <section className="nmx-table-block">
      <h3>{title}</h3>
      {children}
    </section>
  ) : (
    <NoctraDocsStylesTable rows={rows} title={title} />
  );
}
/* FULL_MANTINE_COMPAT_COMPONENTS_END */
`;

const blockPattern = /\/\* FULL_MANTINE_COMPAT_COMPONENTS_START \*\/[\s\S]*?\/\* FULL_MANTINE_COMPAT_COMPONENTS_END \*\//;

if (blockPattern.test(text)) {
  text = text.replace(blockPattern, compatBlock.trim());
} else {
  text = text.replace("export default NoctraMantineDocs;", `${compatBlock}\n\nexport default NoctraMantineDocs;`);
}

writeText(filePath, text);

let cssPath = "apps/docs/src/docs.css";
let css = readText(cssPath);

const cssBlock = `
/* FULL_MANTINE_COMPAT_COMPONENTS_CSS_START */
.nmx-section-eyebrow{margin:0 0 8px;color:var(--nmx-accent);font-size:11px;font-weight:750;letter-spacing:.08em;text-transform:uppercase}
.nmx-demo-controls{padding:16px 18px;border-bottom:1px solid var(--nmx-line);background:rgba(15,23,42,.20)}
.nmx-control-group{display:grid;gap:8px;margin:0 0 12px}
.nmx-control-group>label{color:var(--nmx-muted);font-size:12px;font-weight:700}
.nmx-control-options{display:flex;flex-wrap:wrap;gap:8px}
.nmx-control-options button{appearance:none;border:1px solid var(--nmx-line);background:rgba(15,23,42,.38);color:var(--nmx-muted);border-radius:8px;padding:7px 10px;font:inherit;font-size:12px;cursor:pointer}
.nmx-control-options button:hover{border-color:var(--nmx-line-strong);color:var(--nmx-text)}
.nmx-control-options button[aria-pressed="true"]{border-color:rgba(139,92,246,.6);background:var(--nmx-accent-soft);color:#ddd6fe}
.nmx-boolean-control{display:inline-flex;align-items:center;gap:8px;color:var(--nmx-muted);font-size:13px;cursor:pointer}
.nmx-boolean-control input{accent-color:var(--nmx-accent)}
.nmx-example-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
@media (max-width:860px){.nmx-example-grid{grid-template-columns:1fr}}
/* FULL_MANTINE_COMPAT_COMPONENTS_CSS_END */
`;

const cssPattern = /\/\* FULL_MANTINE_COMPAT_COMPONENTS_CSS_START \*\/[\s\S]*?\/\* FULL_MANTINE_COMPAT_COMPONENTS_CSS_END \*\//;

css = cssPattern.test(css)
  ? css.replace(cssPattern, cssBlock.trim())
  : `${css.trimEnd()}\n\n${cssBlock.trim()}\n`;

writeText(cssPath, css);

const after = readText(filePath);
const problems = [];

for (const required of [
  "NoctraCodeBlock",
  "NoctraDocsBooleanControl",
  "NoctraDocsControlGroup",
  "NoctraDocsExampleCard",
  "NoctraDocsExampleGrid",
  "NoctraDocsPreviousNext",
  "NoctraDocsPropsPanel",
  "NoctraDocsSimpleTable",
  "NoctraDocsStylesApiPanel",
  "eyebrow?: ReactNode",
  "preview?: ReactNode",
  "controls?: ReactNode",
  "const record = row as Record<string, ReactNode>"
]) {
  if (!after.includes(required)) {
    problems.push(`Missing compatibility piece: ${required}`);
  }
}

const result = ts.transpileModule(after, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: filePath
});

for (const diagnostic of result.diagnostics ?? []) {
  problems.push(`${filePath} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Full Mantine Shell Compatibility Types Report",
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
  "- Added old ButtonReferencePage docs-system exports back as wrappers.",
  "- Added eyebrow support to NoctraDocsSection.",
  "- Added preview and controls support to NoctraDocsDemo.",
  "- Added typed control callbacks to prevent implicit any.",
  "- Fixed NoctraDocsTable row indexing under strict TypeScript."
].join("\n");

writeText(reportPath, report);

console.log(`Full Mantine shell compatibility completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Full Mantine shell compatibility failed.");
}
