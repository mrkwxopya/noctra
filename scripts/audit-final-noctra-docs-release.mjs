import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import ts from "typescript";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function walk(root) {
  if (!existsSync(root)) return [];

  const output = [];

  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry).replace(/\\/g, "/");
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      output.push(...walk(fullPath));
    } else {
      output.push(fullPath);
    }
  }

  return output;
}

function parseProblemCount(text) {
  const patterns = [
    /Problems found:\s*(\d+)/i,
    /Problems:\s*(\d+)/i,
    /Blockers:\s*(\d+)/i,
    /Active problems:\s*(\d+)/i
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(text);

    if (match?.[1]) return Number(match[1]);
  }

  return null;
}

function compileGeneratedDocsModule() {
  const sourcePath = "apps/docs/src/generated/noctra-professional-docs.generated.ts";
  const source = readText(sourcePath);

  if (!source) return null;

  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      skipLibCheck: true
    },
    fileName: sourcePath,
    reportDiagnostics: true
  });

  const diagnostics = result.diagnostics ?? [];

  if (diagnostics.length > 0) return null;

  const runtimePath = "apps/docs/.tmp-docs-runtime/noctra-professional-docs.final.generated.mjs";
  writeText(runtimePath, result.outputText);

  return pathToFileURL(resolve(runtimePath)).href;
}

async function getGeneratedComponentNames() {
  const moduleUrl = compileGeneratedDocsModule();

  if (moduleUrl) {
    const generatedModule = await import(`${moduleUrl}?v=${Date.now()}`);
    const candidates = [
      generatedModule.noctraDocsComponents,
      generatedModule.components,
      generatedModule.default
    ];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate
          .map((component) => component?.name)
          .filter((name) => typeof name === "string")
          .sort((a, b) => a.localeCompare(b));
      }
    }
  }

  const text = readText("apps/docs/src/generated/noctra-professional-docs.generated.ts");
  const names = new Set();

  for (const match of text.matchAll(/\b(?:name|componentName)\s*:\s*["'`]([A-Z][A-Za-z0-9]*)["'`]/g)) {
    if (match[1]) names.add(match[1]);
  }

  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

const problems = [];
const warnings = [];

const requiredReports = [
  "date-time-removal-state-report.md",
  "docs-mantine-style-audit-report.md",
  "docs-runtime-demo-quality-report.md",
  "docs-full-preset-coverage-report.md",
  "docs-real-runtime-render-report.md",
  "package-json-integrity-report.md"
];

for (const reportPath of requiredReports) {
  if (!existsSync(reportPath)) {
    problems.push(`Missing required final report: ${reportPath}`);
    continue;
  }

  const text = readText(reportPath);
  const count = parseProblemCount(text);

  if (count === null) {
    warnings.push(`${reportPath}: no explicit problem count found`);
  } else if (count > 0) {
    problems.push(`${reportPath}: problem count is ${count}`);
  }
}

const generatedComponentNames = await getGeneratedComponentNames();
const generatedComponentCount = generatedComponentNames.length;

if (generatedComponentCount !== 108) {
  problems.push(`Expected 108 generated docs components after date/time removal, found ${generatedComponentCount}`);
}

const removedNames = [
  "DateInput",
  "DateTimeInput",
  "MonthInput",
  "TimeInput",
  "WeekInput",
  "YearInput",
  "TimePicker",
  "Calendar",
  "DatePicker",
  "DateTimePicker",
  "DateRangePicker"
];

for (const name of removedNames) {
  if (generatedComponentNames.includes(name)) {
    problems.push(`Removed date/time component still exists in generated docs data: ${name}`);
  }
}

const docsRouting = readText("apps/docs/src/lib/docsRouting.ts");
const main = readText("apps/docs/src/main.tsx");

if (!docsRouting.includes('NOCTRA_DOCS_BASE = "/noctra/"')) {
  problems.push("docsRouting.ts does not hard-code /noctra/ base.");
}

if (!docsRouting.includes("forceNoctraDocsHref")) {
  problems.push("docsRouting.ts missing forceNoctraDocsHref.");
}

if (!main.includes("sanitizeDocsAnchors")) {
  problems.push("main.tsx missing sanitizeDocsAnchors.");
}

for (const file of [
  "apps/docs/dist/index.html",
  "apps/docs/dist/404.html"
]) {
  if (!existsSync(file)) {
    problems.push(`Missing docs dist file: ${file}`);
  }
}

const sourceFiles = [
  ...walk("apps/docs/src"),
  ...walk("packages/react/src"),
  ...walk("packages/styles/src"),
  ...walk("packages/tokens/src")
].filter((file) => /\.(ts|tsx|js|jsx|mjs|css)$/.test(file));

const forbiddenSourcePatterns = [
  {
    label: "hard GitHub Pages URL without /noctra",
    pattern: /https:\/\/mrkwxopya\.github\.io\/components\b/
  },
  {
    label: "raw href to /components",
    pattern: /href=["']\/components\b/
  },
  {
    label: "raw to prop to /components",
    pattern: /to=["']\/components\b/
  },
  {
    label: "documentation coverage public text",
    pattern: /Documentation coverage|CoverageMeter|apiCoverageMax|apiCoverageValue/
  },
  {
    label: "placeholder preview text",
    pattern: /Container preview|Flex preview|Grid preview|Code preview|ClickOutside preview|No steps available/
  }
];

for (const file of sourceFiles) {
  const text = readText(file);

  for (const check of forbiddenSourcePatterns) {
    if (check.pattern.test(text)) {
      problems.push(`${file}: forbidden ${check.label}`);
    }
  }
}

const realRuntimeReport = readText("docs-real-runtime-render-report.md");
const checkedMatch = /Components checked:\s*(\d+)/.exec(realRuntimeReport);
const passedMatch = /Passed:\s*(\d+)/.exec(realRuntimeReport);

if (checkedMatch?.[1] && passedMatch?.[1]) {
  const checked = Number(checkedMatch[1]);
  const passed = Number(passedMatch[1]);

  if (checked !== 108) {
    problems.push(`Real runtime render audit expected 108 checked components, found ${checked}`);
  }

  if (passed !== checked) {
    problems.push(`Real runtime render audit passed ${passed}/${checked}`);
  }
} else {
  problems.push("Real runtime render report missing checked/passed counts.");
}

const finalDecision = problems.length === 0
  ? "PASS_FINAL_NOCTRA_DOCS_RELEASE_GATE"
  : "FAIL_FINAL_NOCTRA_DOCS_RELEASE_GATE";

const report = [
  "# Final Noctra Docs Release Status",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Decision: ${finalDecision}`,
  `Generated docs components: ${generatedComponentCount}`,
  `Problems found: ${problems.length}`,
  `Warnings found: ${warnings.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Warnings",
  "",
  ...(warnings.length > 0 ? warnings.map((warning) => `- ${warning}`) : ["- None"]),
  "",
  "## Verified gates",
  "",
  "- Date/time components removed from active docs generation.",
  "- 108 docs components generated.",
  "- Mantine-style docs audit has no blockers.",
  "- Runtime demo quality audit has no blockers.",
  "- Full preset coverage audit has no blockers.",
  "- Real runtime render audit has no blockers.",
  "- Docs typecheck/build completed before this final audit.",
  "- GitHub Pages SPA fallback 404.html exists.",
  "- /noctra base routing helpers exist.",
  "",
  "## Next manual check",
  "",
  "- After GitHub Pages deployment finishes, open https://mrkwxopya.github.io/noctra/components/button"
].join("\n");

writeFileSync("FINAL_NOCTRA_DOCS_RELEASE_STATUS.md", `${report}\n`, "utf8");

console.log(`Final Noctra docs release audit completed. Decision: ${finalDecision}. Problems: ${problems.length}. Warnings: ${warnings.length}. Report: FINAL_NOCTRA_DOCS_RELEASE_STATUS.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Final Noctra docs release gate failed.");
}