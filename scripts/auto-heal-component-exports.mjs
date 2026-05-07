import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function listComponentDirs() {
  const root = "packages/react/src/components";

  if (!existsSync(root)) return [];

  return readdirSync(root)
    .filter((entry) => {
      const fullPath = join(root, entry);
      return statSync(fullPath).isDirectory();
    })
    .filter((entry) => !entry.startsWith("."))
    .sort((a, b) => a.localeCompare(b));
}

function appendLineOnce(path, line) {
  const content = readText(path);

  if (content.split(/\r?\n/g).map((item) => item.trim()).includes(line.trim())) {
    return false;
  }

  writeText(path, `${content.trimEnd()}\n${line}`);
  return true;
}

function removeDuplicateLines(path) {
  const content = readText(path);
  const lines = content.split(/\r?\n/g);
  const seen = new Set();
  const output = [];
  let changed = false;

  for (const line of lines) {
    const normalized = line.trim();

    if (normalized && seen.has(normalized)) {
      changed = true;
      continue;
    }

    if (normalized) {
      seen.add(normalized);
    }

    output.push(line);
  }

  if (changed) {
    writeText(path, output.join("\n"));
  }

  return changed;
}

function patchJsonExport(path, exportKey, value) {
  const json = JSON.parse(readText(path));
  json.exports ??= {};

  if (json.exports[exportKey] !== undefined) {
    return false;
  }

  json.exports[exportKey] = value;
  writeText(path, JSON.stringify(json, null, 2));
  return true;
}

function componentHasPublicIndex(componentName) {
  return existsSync(`packages/react/src/components/${componentName}/index.ts`) ||
    existsSync(`packages/react/src/components/${componentName}/index.tsx`);
}

function componentHasCss(kebabName) {
  return existsSync(`packages/styles/src/components/${kebabName}.css`);
}

function componentHasToken(kebabName) {
  return existsSync(`packages/tokens/src/components/${kebabName}.ts`);
}

const changes = [];
const componentNames = listComponentDirs();

for (const componentName of componentNames) {
  const kebabName = toKebabCase(componentName);

  if (componentHasPublicIndex(componentName)) {
    if (appendLineOnce("packages/react/src/components/index.ts", `export * from "./${componentName}";`)) {
      changes.push(`react barrel export added: ${componentName}`);
    }

    if (patchJsonExport("packages/react/package.json", `./${kebabName}`, {
      types: `./dist/components/${componentName}/index.d.ts`,
      import: `./dist/components/${componentName}/index.js`
    })) {
      changes.push(`react package export added: ${kebabName}`);
    }
  }

  if (componentHasCss(kebabName)) {
    if (appendLineOnce("packages/styles/src/components.css", `@import "./components/${kebabName}.css";`)) {
      changes.push(`style import added: ${kebabName}`);
    }

    if (patchJsonExport("packages/styles/package.json", `./components/${kebabName}.css`, `./src/components/${kebabName}.css`)) {
      changes.push(`style package export added: ${kebabName}`);
    }
  }

  if (componentHasToken(kebabName)) {
    if (appendLineOnce("packages/tokens/src/index.ts", `export * from "./components/${kebabName}";`)) {
      changes.push(`token export added: ${kebabName}`);
    }
  }
}

for (const path of [
  "packages/react/src/components/index.ts",
  "packages/tokens/src/index.ts",
  "packages/styles/src/components.css"
]) {
  if (removeDuplicateLines(path)) {
    changes.push(`duplicate lines removed: ${path}`);
  }
}

const report = [
  "# Noctra Component Export Auto-Heal Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Component directories scanned: ${componentNames.length}`,
  `Changes applied: ${changes.length}`,
  "",
  "## Changes",
  "",
  ...(changes.length > 0 ? changes.map((change) => `- ${change}`) : ["- None"])
].join("\n");

writeFileSync("component-export-auto-heal-report.md", `${report}\n`, "utf8");

console.log(`Component export auto-heal completed. Components: ${componentNames.length}. Changes: ${changes.length}. Report: component-export-auto-heal-report.md`);