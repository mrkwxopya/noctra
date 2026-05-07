import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const filePath = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";
const reportPath = "full-mantine-shell-remaining-compat-report.md";

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

function replaceFunction(source, name, replacement) {
  const start = source.indexOf(`export function ${name}`);

  if (start < 0) {
    throw new Error(`Could not find export function ${name}.`);
  }

  const nextExport = source.indexOf("\nexport ", start + 1);
  const end = nextExport >= 0 ? nextExport : source.length;

  return `${source.slice(0, start)}${replacement.trimEnd()}\n\n${source.slice(end).trimStart()}`;
}

text = text
  .replace(/code\?: string;/g, "code?: string | undefined;")
  .replace(/preview\?: ReactNode;/g, "preview?: ReactNode | undefined;")
  .replace(/controls\?: ReactNode;/g, "controls?: ReactNode | undefined;")
  .replace(/title\?: ReactNode;/g, "title?: ReactNode | undefined;")
  .replace(/description\?: ReactNode;/g, "description?: ReactNode | undefined;")
  .replace(/children\?: ReactNode;/g, "children?: ReactNode | undefined;");

const exampleCard = `
export function NoctraDocsExampleCard({
  title,
  label,
  description,
  children,
  preview,
  code,
  controls
}: {
  title?: ReactNode | undefined;
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  children?: ReactNode | undefined;
  preview?: ReactNode | undefined;
  code?: string | undefined;
  controls?: ReactNode | undefined;
}) {
  const demoProps: {
    title?: ReactNode | undefined;
    description?: ReactNode | undefined;
    preview?: ReactNode | undefined;
    code?: string | undefined;
    controls?: ReactNode | undefined;
  } = {
    title: title ?? label,
    description,
    preview: preview ?? children,
    controls
  };

  if (code !== undefined) {
    demoProps.code = code;
  }

  return <NoctraDocsDemo {...demoProps} />;
}
`;

text = replaceFunction(text, "NoctraDocsExampleCard", exampleCard);

const stylesPanel = `
export function NoctraDocsStylesApiPanel({
  title = "Styles API",
  rows = [],
  selectors = [],
  variables = [],
  dataAttributes = [],
  children
}: {
  title?: ReactNode | undefined;
  rows?: readonly NoctraDocsStyleRow[];
  selectors?: readonly { selector?: ReactNode; description?: ReactNode }[];
  variables?: readonly { variable?: ReactNode; name?: ReactNode; description?: ReactNode }[];
  dataAttributes?: readonly { attribute?: ReactNode; name?: ReactNode; description?: ReactNode }[];
  children?: ReactNode | undefined;
}) {
  const mergedRows: NoctraDocsStyleRow[] = [
    ...rows,
    ...selectors.map((item) => ({
      selector: item.selector ?? "—",
      description: item.description ?? "—",
      value: "Selector"
    })),
    ...variables.map((item) => ({
      selector: item.variable ?? item.name ?? "—",
      description: item.description ?? "—",
      value: "CSS variable"
    })),
    ...dataAttributes.map((item) => ({
      selector: item.attribute ?? item.name ?? "—",
      description: item.description ?? "—",
      value: "Data attribute"
    }))
  ];

  return children ? (
    <section className="nmx-table-block">
      <h3>{title}</h3>
      {children}
    </section>
  ) : (
    <NoctraDocsStylesTable rows={mergedRows} title={title} />
  );
}
`;

text = replaceFunction(text, "NoctraDocsStylesApiPanel", stylesPanel);

const demo = `
export function NoctraDocsDemo({
  title,
  description,
  children,
  code,
  preview,
  controls
}: {
  title?: ReactNode | undefined;
  description?: ReactNode | undefined;
  children?: ReactNode | undefined;
  code?: string | undefined;
  preview?: ReactNode | undefined;
  controls?: ReactNode | undefined;
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

      {code !== undefined ? <NoctraDocsCodeBlock code={code} /> : null}
    </section>
  );
}
`;

text = replaceFunction(text, "NoctraDocsDemo", demo);

writeText(filePath, text);

const after = readText(filePath);
const problems = [];

for (const required of [
  "label?: ReactNode | undefined",
  "selectors?: readonly",
  "variables?: readonly",
  "dataAttributes?: readonly",
  "if (code !== undefined)",
  "const demoProps"
]) {
  if (!after.includes(required)) {
    problems.push(`Missing remaining compatibility fix: ${required}`);
  }
}

if (after.includes("code: string | undefined;")) {
  problems.push("Found required code property allowing undefined instead of optional code property.");
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
  "# Full Mantine Shell Remaining Compatibility Report",
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
  "- Added label prop compatibility to NoctraDocsExampleCard.",
  "- Added selectors, variables and dataAttributes compatibility to NoctraDocsStylesApiPanel.",
  "- Avoided passing code={undefined} under exactOptionalPropertyTypes.",
  "- Kept Mantine-like shell structure intact."
].join("\n");

writeText(reportPath, report);

console.log(`Full Mantine shell remaining compatibility completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Full Mantine shell remaining compatibility failed.");
}
