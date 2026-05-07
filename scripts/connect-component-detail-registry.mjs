import { existsSync, readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const pagePath = "apps/docs/src/pages/UniversalComponentDocPage.tsx";
const reportPath = "component-detail-registry-connect-report.md";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function replaceFunctionBlock(source, name, replacement) {
  const candidates = [
    `export function ${name}`,
    `function ${name}`
  ];

  let start = -1;

  for (const candidate of candidates) {
    const index = source.indexOf(candidate);

    if (index >= 0) {
      start = index;
      break;
    }
  }

  if (start < 0) {
    throw new Error(`Could not find function ${name}.`);
  }

  const braceStart = source.indexOf("{", start);

  if (braceStart < 0) {
    throw new Error(`Could not find opening brace for ${name}.`);
  }

  let depth = 0;
  let end = -1;
  let quote = "";
  let escaped = false;

  for (let i = braceStart; i < source.length; i++) {
    const ch = source[i];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (ch === "\\") {
        escaped = true;
        continue;
      }

      if (ch === quote) {
        quote = "";
      }

      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") depth--;

    if (depth === 0) {
      end = i + 1;
      break;
    }
  }

  if (end < 0) {
    throw new Error(`Could not find closing brace for ${name}.`);
  }

  return `${source.slice(0, start)}${replacement.trimEnd()}${source.slice(end)}`;
}

function addImport(source) {
  const importLine = 'import { buildComponentSpecificCode, getComponentDocsDetail } from "../data/componentDocsDetailRegistry";';

  if (source.includes(importLine)) {
    return source;
  }

  const importMatches = [...source.matchAll(/^import .*?;$/gm)];

  if (importMatches.length === 0) {
    return `${importLine}\n${source}`;
  }

  const last = importMatches[importMatches.length - 1];
  const insertAt = last.index + last[0].length;

  return `${source.slice(0, insertAt)}\n${importLine}${source.slice(insertAt)}`;
}

function removeUnusedApiMapImport(source) {
  const apiImport = 'import { getComponentDocsApiEntry } from "../data/componentDocsApiMap";';

  if (!source.includes(apiImport)) {
    return source;
  }

  const withoutImport = source.replace(`${apiImport}\n`, "").replace(apiImport, "");

  if (withoutImport.includes("getComponentDocsApiEntry")) {
    return source;
  }

  return withoutImport;
}

const before = readText(pagePath);
let page = before;

page = addImport(page);

const buildCodeReplacement = `function buildCode(slug: string, label: string, state: VisualState) {
  return buildComponentSpecificCode(slug, label, {
    variant: state.variant,
    tone: state.tone,
    size: state.size,
    radius: state.radius,
    disabled: state.disabled,
    loading: state.loading,
    fullWidth: state.fullWidth
  });
}`;

const createPropsRowsReplacement = `function createPropsRows(slug: string, label: string): readonly NoctraDocsPropRow[] {
  const detail = getComponentDocsDetail(slug, label);

  return detail.props.map((prop) => ({
    name: prop.name,
    type: prop.type,
    defaultValue: prop.defaultValue,
    description: prop.required ? \`\${prop.description} Required.\` : prop.description
  } as NoctraDocsPropRow));
}`;

const createStylesRowsReplacement = `function createStylesRows(slug: string): readonly NoctraDocsStyleRow[] {
  const detail = getComponentDocsDetail(slug);

  return detail.styles.map((style) => ({
    selector: style.selector,
    value: style.value,
    description: style.description
  } as NoctraDocsStyleRow));
}`;

page = replaceFunctionBlock(page, "buildCode", buildCodeReplacement);
page = replaceFunctionBlock(page, "createPropsRows", createPropsRowsReplacement);
page = replaceFunctionBlock(page, "createStylesRows", createStylesRowsReplacement);

page = removeUnusedApiMapImport(page);

writeText(pagePath, page);

const after = readText(pagePath);
const problems = [];

for (const marker of [
  'import { buildComponentSpecificCode, getComponentDocsDetail } from "../data/componentDocsDetailRegistry";',
  "return buildComponentSpecificCode(slug, label",
  "const detail = getComponentDocsDetail(slug, label);",
  "const detail = getComponentDocsDetail(slug);",
  "prop.required",
  "detail.styles.map"
]) {
  if (!after.includes(marker)) {
    problems.push(`Missing page marker: ${marker}`);
  }
}

const sourceFile = ts.createSourceFile(
  pagePath,
  after,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);

for (const diagnostic of sourceFile.parseDiagnostics ?? []) {
  const pos = diagnostic.start ?? 0;
  const lineInfo = sourceFile.getLineAndCharacterOfPosition(pos);
  const line = lineInfo.line + 1;
  const col = lineInfo.character + 1;
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

  problems.push(`${pagePath}:${line}:${col} TS${diagnostic.code}: ${message}`);
}

const report = [
  "# Component Detail Registry Connect Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `UniversalComponentDocPage changed: ${before === after ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Connected buildCode to buildComponentSpecificCode.",
  "- Connected Props table to getComponentDocsDetail().props.",
  "- Connected Styles API table to getComponentDocsDetail().styles.",
  "- Kept NativeVisual untouched.",
  "- Avoided large JSX replacement.",
  "- Removed old componentDocsApiMap import only if it became unused."
].join("\n");

writeText(reportPath, report);
console.log(report);

if (problems.length > 0) {
  process.exitCode = 1;
}
