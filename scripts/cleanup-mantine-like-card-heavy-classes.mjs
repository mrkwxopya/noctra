import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const sourceFiles = [
  "apps/docs/src/components/docs-system/NoctraMantineDocs.tsx",
  "apps/docs/src/pages/ButtonReferencePage.tsx"
];

const cssPath = "apps/docs/src/docs.css";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function lineHits(path, source, needle) {
  return source
    .split(/\r?\n/)
    .map((line, index) => ({ line, index: index + 1 }))
    .filter((entry) => entry.line.includes(needle))
    .map((entry) => `${path}:${entry.index}: ${entry.line.trim()}`);
}

const problems = [];
const changedFiles = [];
const hitsBefore = [];
const hitsAfter = [];

for (const file of sourceFiles) {
  let text = readText(file);

  if (!text) {
    problems.push(`${file} missing or empty.`);
    continue;
  }

  const before = text;

  hitsBefore.push(...lineHits(file, text, "ncd-card ncd-related-card"));

  text = text
    .replace(/className="ncd-card ncd-related-card"/g, 'className="ncd-compact-card"')
    .replace(/className='ncd-card ncd-related-card'/g, "className='ncd-compact-card'")
    .replace(/`ncd-card ncd-related-card`/g, "`ncd-compact-card`")
    .replace(/"ncd-card ncd-related-card"/g, '"ncd-compact-card"')
    .replace(/'ncd-card ncd-related-card'/g, "'ncd-compact-card'");

  if (before !== text) {
    changedFiles.push(file);
    writeText(file, text);
  }

  hitsAfter.push(...lineHits(file, text, "ncd-card ncd-related-card"));

  const result = ts.transpileModule(text, {
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

let css = readText(cssPath);

if (!css) {
  problems.push(`${cssPath} missing or empty.`);
} else {
  const beforeCss = css;
  const cleanupBlock = '/* NOCTRA_MANTINE_LIKE_CARD_CLEANUP_START */.ncd-compact-card{border:1px solid rgba(148,163,184,.14);background:rgba(15,23,42,.32);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:8px;color:inherit;text-decoration:none}.ncd-compact-card strong{font-size:13px}.ncd-compact-card span{font-size:13px;color:var(--nc-text-muted,#a7b2c3)}/* NOCTRA_MANTINE_LIKE_CARD_CLEANUP_END */';
  const blockPattern = /\/\* NOCTRA_MANTINE_LIKE_CARD_CLEANUP_START \*\/[\s\S]*?\/\* NOCTRA_MANTINE_LIKE_CARD_CLEANUP_END \*\//;

  if (blockPattern.test(css)) {
    css = css.replace(blockPattern, cleanupBlock);
  } else {
    css = `${css.trimEnd()}\n${cleanupBlock}\n`;
  }

  if (beforeCss !== css) {
    changedFiles.push(cssPath);
    writeText(cssPath, css);
  }

  if (!css.includes(".ncd-compact-card")) {
    problems.push("CSS missing .ncd-compact-card.");
  }
}

if (hitsAfter.length > 0) {
  problems.push(`Old ncd-card ncd-related-card classes still remain: ${hitsAfter.length}`);
}

const report = [
  "# Mantine-Like Card Heavy Class Cleanup Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Changed files: ${changedFiles.length}`,
  `Old class hits before: ${hitsBefore.length}`,
  `Old class hits after: ${hitsAfter.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Changed files",
  "",
  ...(changedFiles.length > 0 ? changedFiles.map((file) => `- ${file}`) : ["- None"]),
  "",
  "## Hits before",
  "",
  ...(hitsBefore.length > 0 ? hitsBefore.map((hit) => `- ${hit}`) : ["- None"]),
  "",
  "## Hits after",
  "",
  ...(hitsAfter.length > 0 ? hitsAfter.map((hit) => `- ${hit}`) : ["- None"]),
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync("mantine-like-card-heavy-class-cleanup-report.md", `${report}\n`, "utf8");

console.log(`Mantine-like card-heavy class cleanup completed. Problems: ${problems.length}. Report: mantine-like-card-heavy-class-cleanup-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Mantine-like card-heavy class cleanup failed.");
}