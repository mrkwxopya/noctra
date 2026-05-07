import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const file = "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function replaceExportFunction(source, functionName, replacement) {
  const marker = `export function ${functionName}`;
  const start = source.indexOf(marker);

  if (start === -1) {
    throw new Error(`Could not find function ${functionName}`);
  }

  const nextExport = source.indexOf("\nexport function ", start + marker.length);
  const end = nextExport === -1 ? source.length : nextExport;

  return `${source.slice(0, start)}${replacement.trimEnd()}\n\n${source.slice(end).trimStart()}`;
}

let text = readText(file);

if (!text) {
  throw new Error(`Missing or empty ${file}`);
}

const before = text;

text = text.replace(
  'const TableRuntime = (runtime.Table ?? "table") as RuntimeComponent;',
  'const TableRuntime = (runtime.Table ?? "table") as RuntimeComponent;\nconst hasRuntimeTable = Boolean(runtime.Table);'
);

if (!text.includes("function NoctraDocsRuntimeTable")) {
  text = text.replace(
    "export function NoctraDocsPropsTable",
`function NoctraDocsRuntimeTable({
  columns,
  rows,
  system
}: {
  columns: readonly string[];
  rows: readonly ReactNode[][];
  system: string;
}) {
  if (hasRuntimeTable) {
    return (
      <TableRuntime
        className="nd-table"
        data-noctra-docs-system={system}
        columns={columns}
        rows={rows}
        data={rows}
      />
    );
  }

  return (
    <table className="nd-table" data-noctra-docs-system={system}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function NoctraDocsPropsTable`
  );
}

text = replaceExportFunction(text, "NoctraDocsPropsTable", `export function NoctraDocsPropsTable({ rows }: { rows: readonly NoctraDocsPropRow[] }) {
  const columns = ["Name", "Type", "Required", "Default", "Description"] as const;

  const tableRows = rows.map((row) => [
    <InlineCodeRuntime key={\`\${row.name}-name\`}>{row.name}</InlineCodeRuntime>,
    row.type,
    row.required ? "Required" : "Optional",
    row.defaultValue ?? "—",
    row.description
  ]);

  return (
    <NoctraDocsRuntimeTable
      columns={columns}
      rows={tableRows}
      system="props-table"
    />
  );
}`);

text = replaceExportFunction(text, "NoctraDocsSimpleTable", `export function NoctraDocsSimpleTable({
  title,
  columns,
  rows
}: {
  title: string;
  columns: readonly string[];
  rows: readonly ReactNode[][];
}) {
  return (
    <Card className="nd-card">
      <h2>{title}</h2>
      <NoctraDocsRuntimeTable
        columns={columns}
        rows={rows}
        system="simple-table"
      />
    </Card>
  );
}`);

text = replaceExportFunction(text, "NoctraCodeBlock", `export function NoctraCodeBlock({ code }: { code: string }) {
  return (
    <CodeBlockRuntime code={code} value={code}>
      {code}
    </CodeBlockRuntime>
  );
}`);

writeText(file, text);

const required = [
  "hasRuntimeTable",
  "function NoctraDocsRuntimeTable",
  "columns={columns}",
  "rows={rows}",
  "data={rows}",
  "code={code}",
  "value={code}",
  "system=\"props-table\"",
  "system=\"simple-table\""
];

const missing = required.filter((snippet) => !text.includes(snippet));

const forbidden = [
  "<TableRuntime className=\"nd-table\" data-noctra-docs-system=\"props-table\">",
  "<TableRuntime className=\"nd-table\">",
  "<CodeBlockRuntime>{code}</CodeBlockRuntime>"
];

const remainingForbidden = forbidden.filter((snippet) => text.includes(snippet));

const diagnostics = ts.transpileModule(text, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: file
}).diagnostics ?? [];

const syntaxProblems = diagnostics.map((diagnostic) => {
  return `TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
});

const problems = [
  ...missing.map((item) => `Missing required runtime-safe snippet: ${item}`),
  ...remainingForbidden.map((item) => `Forbidden unsafe snippet remains: ${item}`),
  ...syntaxProblems
];

const report = [
  "# Noctra Docs Runtime Table/CodeBlock Crash Fix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed: ${before === text ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Fixed",
  "",
  "- Noctra docs table wrapper now passes columns / rows / data to runtime Table.",
  "- Native table fallback still exists if Noctra Table is unavailable.",
  "- Noctra code block wrapper now passes code and value props.",
  "- Props table and Styles API table use the same safe table adapter."
].join("\n");

writeFileSync("noctra-docs-runtime-table-codeblock-crash-fix-report.md", `${report}\n`, "utf8");

console.log(`Noctra docs runtime table/codeblock crash fix completed. Problems: ${problems.length}. Report: noctra-docs-runtime-table-codeblock-crash-fix-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Noctra docs runtime table/codeblock crash fix failed.");
}