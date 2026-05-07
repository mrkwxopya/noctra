import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import ts from "typescript";

const target = "apps/docs/src/components/DocsChrome.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function getSyntaxProblems(source) {
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX
    },
    reportDiagnostics: true,
    fileName: target
  });

  return (result.diagnostics ?? []).map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
    return `TS${diagnostic.code}: ${message}`;
  });
}

function latestDocsChromeBackup() {
  if (!existsSync("safety-backups")) return null;

  const candidates = readdirSync("safety-backups")
    .filter((name) =>
      name.includes("DocsChrome") ||
      name.includes("apps_docs_src_components_DocsChrome_tsx")
    )
    .filter((name) => name.endsWith(".bak") || name.endsWith(".tsx"))
    .sort()
    .reverse();

  return candidates.length > 0 ? `safety-backups/${candidates[0]}` : null;
}

function removeNamedFunction(source, functionName) {
  const marker = `export function ${functionName}`;
  const start = source.indexOf(marker);

  if (start === -1) return source;

  const nextExportRegex = /\nexport\s+(function|const|class|interface|type)\s+[A-Za-z0-9_$]+/g;
  nextExportRegex.lastIndex = start + marker.length;

  const next = nextExportRegex.exec(source);
  const end = next?.index ?? source.length;

  return `${source.slice(0, start)}${source.slice(end)}`;
}

function removeDanglingCoverageFragments(source) {
  let text = source;

  text = text.replace(
    /\n\s*\}:\s*\{[\s\S]*?\n\s*\}\)\s*\{[\s\S]*?(?=\nexport\s+(function|const|class|interface|type)\s+[A-Za-z0-9_$]+|\s*$)/g,
    (block) => {
      if (
        block.includes("value: number") ||
        block.includes("max: number") ||
        block.includes("percentage") ||
        block.includes("Coverage")
      ) {
        return "\n";
      }

      return block;
    }
  );

  text = text.replace(/\bCoverageMeter,\s*/g, "");
  text = text.replace(/,\s*CoverageMeter\b/g, "");
  text = text.replace(/\n{3,}/g, "\n\n");

  return text;
}

function removeCoverageMeter(source) {
  let text = source;

  text = removeNamedFunction(text, "CoverageMeter");
  text = removeDanglingCoverageFragments(text);

  return text.trimEnd() + "\n";
}

const before = readText(target);

if (!before) {
  throw new Error(`Missing or empty ${target}`);
}

let chosenSource = before;
let restoredFromBackup = false;

const beforeProblems = getSyntaxProblems(before);

if (beforeProblems.length > 0) {
  const backup = latestDocsChromeBackup();

  if (backup) {
    const backupText = readText(backup);

    if (backupText && backupText.length > 100) {
      chosenSource = backupText;
      restoredFromBackup = true;
    }
  }
}

const repaired = removeCoverageMeter(chosenSource);
const afterProblems = getSyntaxProblems(repaired);

writeText(target, repaired);

const remainingForbidden = [
  "CoverageMeter",
  "Documentation coverage",
  "apiCoverageMax",
  "apiCoverageValue"
].filter((term) => repaired.includes(term));

const report = [
  "# DocsChrome Coverage Syntax Repair Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Restored from backup: ${restoredFromBackup ? "yes" : "no"}`,
  `Syntax problems before: ${beforeProblems.length}`,
  `Syntax problems after: ${afterProblems.length}`,
  `Remaining forbidden terms: ${remainingForbidden.length}`,
  "",
  "## Before syntax problems",
  "",
  ...(beforeProblems.length > 0 ? beforeProblems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## After syntax problems",
  "",
  ...(afterProblems.length > 0 ? afterProblems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Remaining forbidden terms",
  "",
  ...(remainingForbidden.length > 0 ? remainingForbidden.map((term) => `- ${term}`) : ["- None"])
].join("\n");

writeFileSync("docschrome-coverage-syntax-repair-report.md", `${report}\n`, "utf8");

console.log(`DocsChrome coverage syntax repair completed. Before syntax problems: ${beforeProblems.length}. After syntax problems: ${afterProblems.length}. Remaining forbidden terms: ${remainingForbidden.length}. Report: docschrome-coverage-syntax-repair-report.md`);

if (afterProblems.length > 0 || remainingForbidden.length > 0) {
  console.error(report);
  throw new Error("DocsChrome coverage syntax repair failed.");
}