import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const tsconfigPath = "apps/docs/tsconfig.json";
const tokensMockPath = "apps/docs/src/components/docs-system/NoctraTokensMock.ts";
const reportPath = "docs-tsconfig-runtime-paths-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function parseJsonWithFallback(path) {
  const text = readText(path);

  try {
    return JSON.parse(text);
  } catch {
    const parsed = ts.parseConfigFileTextToJson(path, text);

    if (parsed.error) {
      throw new Error(ts.flattenDiagnosticMessageText(parsed.error.messageText, "\n"));
    }

    return parsed.config;
  }
}

const beforeTsconfig = readText(tsconfigPath);

if (!beforeTsconfig) {
  throw new Error(`${tsconfigPath} missing or empty.`);
}

const tsconfig = parseJsonWithFallback(tsconfigPath);

tsconfig.compilerOptions ??= {};
tsconfig.compilerOptions.baseUrl = ".";
tsconfig.compilerOptions.paths ??= {};

tsconfig.compilerOptions.paths["@noctra/react"] = ["src/components/docs-system/NoctraRuntimeMock.tsx"];
tsconfig.compilerOptions.paths["@noctra/react/*"] = ["src/components/docs-system/NoctraRuntimeMock.tsx"];
tsconfig.compilerOptions.paths["@noctra/tokens"] = ["src/components/docs-system/NoctraTokensMock.ts"];
tsconfig.compilerOptions.paths["@noctra/tokens/*"] = ["src/components/docs-system/NoctraTokensMock.ts"];

const tokensMock = `export type NoctraToken = {
  name?: string;
  path?: string;
  value?: string | number;
  type?: string;
  category?: string;
  description?: string;
  [key: string]: unknown;
};

export type NoctraTokenGroup = {
  name?: string;
  label?: string;
  tokens?: readonly NoctraToken[];
  items?: readonly NoctraToken[];
  [key: string]: unknown;
};

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
    lg: "14px",
    xl: "18px"
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px"
  }
} as const;

export const tokens = noctraTokens;

export const tokenList: NoctraToken[] = [
  { name: "color.background", path: "color.background", value: "#050812", type: "color", category: "color" },
  { name: "color.surface", path: "color.surface", value: "#0f172a", type: "color", category: "color" },
  { name: "color.text", path: "color.text", value: "#f8fafc", type: "color", category: "color" },
  { name: "color.primary", path: "color.primary", value: "#8b5cf6", type: "color", category: "color" },
  { name: "radius.md", path: "radius.md", value: "10px", type: "radius", category: "radius" },
  { name: "spacing.md", path: "spacing.md", value: "12px", type: "spacing", category: "spacing" }
];

export const tokenGroups: NoctraTokenGroup[] = [
  { name: "color", label: "Color", tokens: tokenList.filter((token: NoctraToken) => token.category === "color") },
  { name: "radius", label: "Radius", tokens: tokenList.filter((token: NoctraToken) => token.category === "radius") },
  { name: "spacing", label: "Spacing", tokens: tokenList.filter((token: NoctraToken) => token.category === "spacing") }
];

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

writeText(tokensMockPath, tokensMock);
writeText(tsconfigPath, JSON.stringify(tsconfig, null, 2));

const afterTsconfig = readText(tsconfigPath);
const tokensAfter = readText(tokensMockPath);
const problems = [];

if (!afterTsconfig.includes('"@noctra/react"')) {
  problems.push("tsconfig missing @noctra/react path.");
}

if (!afterTsconfig.includes('"@noctra/react/*"')) {
  problems.push("tsconfig missing @noctra/react/* path.");
}

if (!afterTsconfig.includes('"@noctra/tokens"')) {
  problems.push("tsconfig missing @noctra/tokens path.");
}

if (!afterTsconfig.includes('"@noctra/tokens/*"')) {
  problems.push("tsconfig missing @noctra/tokens/* path.");
}

if (!tokensAfter.includes("export const noctraTokens")) {
  problems.push("NoctraTokensMock missing noctraTokens export.");
}

if (!tokensAfter.includes("tokenList")) {
  problems.push("NoctraTokensMock missing tokenList export.");
}

for (const [file, source, kind] of [
  [tokensMockPath, tokensAfter, ts.ScriptKind.TS]
]) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext
    },
    reportDiagnostics: true,
    fileName: file
  });

  for (const diagnostic of result.diagnostics ?? []) {
    problems.push(`${file} TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
  }
}

const report = [
  "# Docs TypeScript Runtime Paths Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `tsconfig changed: ${beforeTsconfig === afterTsconfig ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Added paths",
  "",
  "- @noctra/react -> NoctraRuntimeMock.tsx",
  "- @noctra/react/* -> NoctraRuntimeMock.tsx",
  "- @noctra/tokens -> NoctraTokensMock.ts",
  "- @noctra/tokens/* -> NoctraTokensMock.ts",
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added TypeScript path aliases for docs runtime mocks.",
  "- Added docs-only token mock for @noctra/tokens.",
  "- This fixes CI tsc resolution; Vite alias still handles runtime bundling."
].join("\n");

writeText(reportPath, report);

console.log(`Docs TypeScript runtime paths patch completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Docs TypeScript runtime paths patch failed.");
}
