import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const tsconfigPath = "apps/docs/tsconfig.json";
const reportPath = "legacy-main-before-exclude-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function parseJson(path) {
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

const before = readText(tsconfigPath);

if (!before) {
  throw new Error(`${tsconfigPath} missing or empty.`);
}

const config = parseJson(tsconfigPath);

const excludes = new Set(Array.isArray(config.exclude) ? config.exclude : []);

[
  "src/**/*.before-*.ts",
  "src/**/*.before-*.tsx",
  "src/**/*.pre-*.ts",
  "src/**/*.pre-*.tsx",
  "src/**/*.bak.ts",
  "src/**/*.bak.tsx",
  "src/main.before-noctra-docs-pages.tsx"
].forEach((item) => excludes.add(item));

config.exclude = [...excludes].sort();

writeText(tsconfigPath, JSON.stringify(config, null, 2));

const after = readText(tsconfigPath);
const problems = [];

if (existsSync("apps/docs/src/main.before-noctra-docs-pages.tsx")) {
  problems.push("Legacy main.before-noctra-docs-pages.tsx still exists under apps/docs/src.");
}

if (!after.includes("src/**/*.before-*.tsx")) {
  problems.push("tsconfig exclude missing src/**/*.before-*.tsx.");
}

if (!after.includes("src/main.before-noctra-docs-pages.tsx")) {
  problems.push("tsconfig exclude missing exact legacy main.before path.");
}

const report = [
  "# Legacy main.before Typecheck Exclude Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `tsconfig changed: ${before === after ? "no" : "yes"}`,
  `Legacy file still active: ${existsSync("apps/docs/src/main.before-noctra-docs-pages.tsx") ? "yes" : "no"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Moved legacy main.before-noctra-docs-pages.tsx out of apps/docs/src.",
  "- Added tsconfig excludes for before/pre/bak TS/TSX files.",
  "- Prevented archived source snapshots from participating in docs typecheck."
].join("\n");

writeText(reportPath, report);

console.log(`Legacy main.before exclude completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Legacy main.before exclude failed.");
}
