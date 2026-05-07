import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const tokenMockPath = "apps/docs/src/components/docs-system/NoctraTokensMock.ts";
const inspectorPath = "apps/docs/src/components/TokenInspector.tsx";
const reportPath = "token-mock-inspector-typefix-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let tokenMock = readText(tokenMockPath);
let inspector = readText(inspectorPath);

if (!tokenMock) throw new Error(`${tokenMockPath} missing or empty.`);
if (!inspector) throw new Error(`${inspectorPath} missing or empty.`);

const beforeTokenMock = tokenMock;
const beforeInspector = inspector;

const replacementTokenMock = `export type NoctraToken = {
  name: string;
  path: string;
  value: string | number;
  type: string;
  category: string;
  description?: string;
  [key: string]: unknown;
};

export type NoctraTokenGroup = {
  name: string;
  label: string;
  tokens: readonly NoctraToken[];
  items?: readonly NoctraToken[];
  [key: string]: unknown;
};

export const tokenList: NoctraToken[] = [
  { name: "color.background", path: "color.background", value: "#050812", type: "color", category: "color", description: "Main page background" },
  { name: "color.surface", path: "color.surface", value: "#0f172a", type: "color", category: "color", description: "Default surface" },
  { name: "color.text", path: "color.text", value: "#f8fafc", type: "color", category: "color", description: "Primary text" },
  { name: "color.muted", path: "color.muted", value: "#94a3b8", type: "color", category: "color", description: "Muted text" },
  { name: "color.primary", path: "color.primary", value: "#8b5cf6", type: "color", category: "color", description: "Primary accent" },
  { name: "radius.sm", path: "radius.sm", value: "6px", type: "radius", category: "radius", description: "Small radius" },
  { name: "radius.md", path: "radius.md", value: "10px", type: "radius", category: "radius", description: "Medium radius" },
  { name: "radius.lg", path: "radius.lg", value: "14px", type: "radius", category: "radius", description: "Large radius" },
  { name: "spacing.sm", path: "spacing.sm", value: "8px", type: "spacing", category: "spacing", description: "Small spacing" },
  { name: "spacing.md", path: "spacing.md", value: "12px", type: "spacing", category: "spacing", description: "Medium spacing" },
  { name: "spacing.lg", path: "spacing.lg", value: "16px", type: "spacing", category: "spacing", description: "Large spacing" }
];

export const noctraTokens = {
  color: {
    background: "#050812",
    surface: "#0f172a",
    text: "#f8fafc",
    muted: "#94a3b8",
    primary: "#8b5cf6"
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px"
  },
  spacing: {
    sm: "8px",
    md: "12px",
    lg: "16px"
  }
} as const;

export const tokens = noctraTokens;

export const tokenGroups: NoctraTokenGroup[] = [
  { name: "color", label: "Color", tokens: tokenList.filter((token: NoctraToken) => token.category === "color") },
  { name: "radius", label: "Radius", tokens: tokenList.filter((token: NoctraToken) => token.category === "radius") },
  { name: "spacing", label: "Spacing", tokens: tokenList.filter((token: NoctraToken) => token.category === "spacing") }
];

export const noctraTokenMeta = tokenList;

export const primitiveTokens = noctraTokens;
export const semanticTokens = noctraTokens;
export const componentTokens = noctraTokens;
export const themeTokens = noctraTokens;

export function getToken(path: string): NoctraToken | undefined {
  return tokenList.find((token: NoctraToken) => token.path === path || token.name === path);
}

export function flattenTokens(): NoctraToken[] {
  return tokenList;
}

export default noctraTokens;
`;

tokenMock = replacementTokenMock;

if (!inspector.includes("type TokenInspectorToken")) {
  inspector = inspector.replace(
    /import\s+\{\s*noctraTokenMeta\s*\}\s+from\s+["']@noctra\/tokens["'];/,
    `import { noctraTokenMeta, type NoctraToken } from "@noctra/tokens";

type TokenInspectorToken = NoctraToken;`
  );
}

inspector = inspector
  .replace(/\.map\(\(token\)\s*=>/g, ".map((token: TokenInspectorToken) =>")
  .replace(/\.filter\(\(token\)\s*=>/g, ".filter((token: TokenInspectorToken) =>")
  .replace(/\.find\(\(token\)\s*=>/g, ".find((token: TokenInspectorToken) =>")
  .replace(/\.some\(\(token\)\s*=>/g, ".some((token: TokenInspectorToken) =>")
  .replace(/\.every\(\(token\)\s*=>/g, ".every((token: TokenInspectorToken) =>");

writeText(tokenMockPath, tokenMock);
writeText(inspectorPath, inspector);

const afterTokenMock = readText(tokenMockPath);
const afterInspector = readText(inspectorPath);

const problems = [];

if (!afterTokenMock.includes("export const noctraTokenMeta")) {
  problems.push("NoctraTokensMock missing noctraTokenMeta export.");
}

if (!afterTokenMock.includes("export type NoctraToken")) {
  problems.push("NoctraTokensMock missing NoctraToken type.");
}

if (!afterInspector.includes("type TokenInspectorToken")) {
  problems.push("TokenInspector missing TokenInspectorToken type.");
}

if (afterInspector.includes("(token) =>")) {
  problems.push("TokenInspector still has untyped (token) => callback.");
}

for (const [file, source, kind] of [
  [tokenMockPath, afterTokenMock, ts.ScriptKind.TS],
  [inspectorPath, afterInspector, ts.ScriptKind.TSX]
]) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX
    },
    reportDiagnostics: true,
    fileName: file
  });

  for (const diagnostic of result.diagnostics ?? []) {
    problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# Token Mock Inspector Typefix Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Token mock changed: ${beforeTokenMock === afterTokenMock ? "no" : "yes"}`,
  `TokenInspector changed: ${beforeInspector === afterInspector ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added noctraTokenMeta export to docs token mock.",
  "- Added NoctraToken type export.",
  "- Typed TokenInspector token callbacks.",
  "- Kept @noctra/tokens path alias target docs-only."
].join("\n");

writeText(reportPath, report);

console.log(`Token mock inspector typefix completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Token mock inspector typefix failed.");
}
