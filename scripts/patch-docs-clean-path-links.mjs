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

    if (/\.(tsx|ts)$/.test(entry)) {
      output.push(fullPath.replace(/\\/g, "/"));
    }
  }

  return output;
}

function shouldPatchFile(file) {
  if (file.includes("/data/")) return false;
  if (file.includes("/generated/")) return false;
  if (file.endsWith("docsRouting.ts")) return false;

  return file.includes("/components/") || file.includes("/pages/") || file.endsWith("apps/docs/src/main.tsx");
}

function ensureDocsHrefImport(path, text) {
  if (!text.includes("docsHref(")) return text;
  if (text.includes("../lib/docsRouting") || text.includes("./lib/docsRouting")) return text;

  const importPath = path.endsWith("apps/docs/src/main.tsx") ? "./lib/docsRouting" : "../lib/docsRouting";
  const lines = text.split(/\r?\n/g);
  const lastImportIndex = lines.findLastIndex((line) => line.startsWith("import "));

  if (lastImportIndex === -1) return text;

  lines.splice(lastImportIndex + 1, 0, `import { docsHref } from "${importPath}";`);

  return lines.join("\n");
}

for (const file of walk("apps/docs/src")) {
  if (!shouldPatchFile(file)) continue;

  let text = readText(file);
  const before = text;

  text = text
    .replace(/href="#\/"/g, 'href={docsHref("/")}')
    .replace(/href="#\/components"/g, 'href={docsHref("/components")}')
    .replace(/href="#\/architecture"/g, 'href={docsHref("/architecture")}')
    .replace(/href="#\/theming"/g, 'href={docsHref("/theming")}')
    .replace(/href="#\/quality"/g, 'href={docsHref("/quality")}')
    .replace(/href="#\/release"/g, 'href={docsHref("/release")}')
    .replace(/href={`#\/components\/\$\{component\.kebab\}`}/g, 'href={docsHref(`/components/${component.kebab}`)}')
    .replace(/href={`#\/components\/\$\{item\.kebab\}`}/g, 'href={docsHref(`/components/${item.kebab}`)}')
    .replace(/href={`#\/components\?group=\$\{encodeURIComponent\(group\.group\)\}`}/g, 'href={docsHref("/components")}')
    .replace(/https:\/\/mrkwxopya\.github\.io\/noctra\/#\//g, "https://mrkwxopya.github.io/noctra/")
    .replace(/https:\/\/mrkwxopya\.github\.io\/noctra#/g, "https://mrkwxopya.github.io/noctra");

  text = ensureDocsHrefImport(file, text);

  if (text !== before) {
    writeText(file, text);
  }
}

console.log("Docs clean path links patched safely.");