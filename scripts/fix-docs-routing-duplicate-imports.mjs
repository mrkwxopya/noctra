import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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
    const fullPath = join(root, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      output.push(...walk(fullPath));
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry)) {
      output.push(fullPath.replace(/\\/g, "/"));
    }
  }

  return output;
}

function unique(values) {
  return Array.from(new Set(values)).filter(Boolean);
}

function parseImportNames(block) {
  return block
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeDocsRoutingImports(file) {
  let text = readText(file);

  const importRegex = /import\s*\{([\s\S]*?)\}\s*from\s*["']([^"']*docsRouting)["'];\s*\r?\n?/g;
  const matches = Array.from(text.matchAll(importRegex));

  if (matches.length === 0) return false;

  const names = [];
  let importSource = matches[0]?.[2] ?? "";

  for (const match of matches) {
    names.push(...parseImportNames(match[1] ?? ""));
    importSource = match[2] ?? importSource;
  }

  text = text.replace(importRegex, "");

  const cleanNames = unique(names).sort((a, b) => a.localeCompare(b));

  if (cleanNames.length === 0) {
    writeText(file, text);
    return true;
  }

  const importBlock =
    cleanNames.length <= 3
      ? `import { ${cleanNames.join(", ")} } from "${importSource}";`
      : `import {\n  ${cleanNames.join(",\n  ")}\n} from "${importSource}";`;

  const lines = text.split(/\r?\n/g);
  const lastImportIndex = lines.findLastIndex((line) => line.startsWith("import "));

  if (lastImportIndex === -1) {
    lines.unshift(importBlock);
  } else {
    lines.splice(lastImportIndex + 1, 0, importBlock);
  }

  writeText(file, lines.join("\n"));

  return true;
}

function ensureMainRoutingImport() {
  const file = "apps/docs/src/main.tsx";
  let text = readText(file);

  text = text.replace(/import\s*\{[\s\S]*?\}\s*from\s*["']\.\/lib\/docsRouting["'];\s*\r?\n?/g, "");

  const importBlock = `import {
  canonicalizeDocsCleanRoute,
  docsHref,
  forceNoctraDocsHref,
  isInternalDocsUrl,
  parseDocsRouteFromLocation,
  sanitizeDocsAnchors
} from "./lib/docsRouting";`;

  const anchor = 'import { noctraDocsComponents } from "./generated/noctra-professional-docs.generated";';

  if (text.includes(anchor)) {
    text = text.replace(anchor, `${anchor}\n${importBlock}`);
  } else {
    const lines = text.split(/\r?\n/g);
    const lastImportIndex = lines.findLastIndex((line) => line.startsWith("import "));

    if (lastImportIndex === -1) {
      lines.unshift(importBlock);
    } else {
      lines.splice(lastImportIndex + 1, 0, importBlock);
    }

    text = lines.join("\n");
  }

  writeText(file, text);
}

ensureMainRoutingImport();

for (const file of walk("apps/docs/src")) {
  normalizeDocsRoutingImports(file);
}

const main = readText("apps/docs/src/main.tsx");
const docsHrefImportCount = Array.from(main.matchAll(/\bdocsHref\b/g)).length;

if (Array.from(main.matchAll(/from\s+["']\.\/lib\/docsRouting["']/g)).length !== 1) {
  throw new Error("main.tsx must contain exactly one docsRouting import.");
}

if (!main.includes("docsHref")) {
  throw new Error("main.tsx must keep docsHref import for index.html canonicalization.");
}

console.log(`Docs routing duplicate imports fixed. main.tsx docsHref references: ${docsHrefImportCount}`);
