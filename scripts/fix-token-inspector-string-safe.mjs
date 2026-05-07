import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const inspectorPath = "apps/docs/src/components/TokenInspector.tsx";
const reportPath = "token-inspector-string-safe-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

const before = readText(inspectorPath);

if (!before) {
  throw new Error(`${inspectorPath} missing or empty.`);
}

const next = `import { noctraTokenMeta, type NoctraToken } from "@noctra/tokens";

type TokenView = {
  key: string;
  name: string;
  value: string;
  type: string;
  category: string;
  description: string;
};

function safeString(value: unknown, fallback = ""): string {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
  return fallback;
}

function normalizeToken(token: NoctraToken, index: number): TokenView {
  const name = safeString(token.name ?? token.path, \`token-\${index + 1}\`);
  const path = safeString(token.path, name);

  return {
    key: path || name || \`token-\${index + 1}\`,
    name,
    value: safeString(token.value, "—"),
    type: safeString(token.type, "token"),
    category: safeString(token.category, "general"),
    description: safeString(token.description)
  };
}

const tokens: TokenView[] = noctraTokenMeta.map((token: NoctraToken, index: number) => normalizeToken(token, index));

export function TokenInspector() {
  return (
    <section className="ncd3-card">
      <div className="ncd3-section-title">
        <h2>Token inspector</h2>
        <p>Preview the active token metadata used by the docs build.</p>
      </div>

      <div className="ncd3-table-card">
        <table className="ncd3-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
              <th>Type</th>
              <th>Category</th>
            </tr>
          </thead>

          <tbody>
            {tokens.map((token: TokenView) => (
              <tr key={token.key}>
                <td>
                  <code>{token.name}</code>
                  {token.description ? <p>{token.description}</p> : null}
                </td>
                <td>{token.value}</td>
                <td>{token.type}</td>
                <td>{token.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TokenInspector;
`;

writeText(inspectorPath, next);

const after = readText(inspectorPath);
const problems = [];

if (!after.includes("safeString")) {
  problems.push("TokenInspector missing safeString helper.");
}

if (!after.includes("TokenView")) {
  problems.push("TokenInspector missing TokenView type.");
}

if (after.includes("(token) =>")) {
  problems.push("TokenInspector still has untyped token callback.");
}

const result = ts.transpileModule(after, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    jsx: ts.JsxEmit.ReactJSX
  },
  reportDiagnostics: true,
  fileName: inspectorPath
});

for (const diagnostic of result.diagnostics ?? []) {
  problems.push(`${inspectorPath} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
}

const report = [
  "# Token Inspector String Safe Report",
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
  "- Replaced TokenInspector with a string-safe docs-only implementation.",
  "- Normalized token key/name/value/type/category before rendering.",
  "- Removed unknown values from JSX key and children positions."
].join("\n");

writeText(reportPath, report);

console.log(`TokenInspector string-safe patch completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("TokenInspector string-safe patch failed.");
}
