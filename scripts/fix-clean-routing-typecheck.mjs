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

function removeDocsHrefImports(text) {
  return text
    .replace(/^import\s+\{\s*docsHref\s*\}\s+from\s+["'][^"']*docsRouting["'];\r?\n/gm, "")
    .replace(/^import\s+\{([^}]*),\s*docsHref\s*,?([^}]*)\}\s+from\s+["'][^"']*docsRouting["'];\r?\n/gm, (_match, before, after) => {
      const names = `${before},${after}`
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      return names.length > 0 ? `import { ${names.join(", ")} } from "../lib/docsRouting";\n` : "";
    });
}

const dataFiles = walk("apps/docs/src/data");

for (const file of dataFiles) {
  let text = readText(file);

  text = removeDocsHrefImports(text);

  text = text
    .replace(/href:\s*docsHref\("([^"]*)"\)/g, 'href: "$1"')
    .replace(/href=\{docsHref\("([^"]*)"\)\}/g, 'href="$1"')
    .replace(/from "\.\/lib\/docsRouting";/g, 'from "../lib/docsRouting";');

  writeText(file, text);
}

const docsCatalogPath = "apps/docs/src/data/docsCatalog.ts";

if (existsSync(docsCatalogPath)) {
  let text = readText(docsCatalogPath);

  text = removeDocsHrefImports(text);

  text = text
    .replace(/href:\s*docsHref\("([^"]*)"\)/g, 'href: "$1"')
    .replace(/href:\s*docsHref\('([^']*)'\)/g, 'href: "$1"');

  writeText(docsCatalogPath, text);
}

const allSourceFiles = walk("apps/docs/src");

for (const file of allSourceFiles) {
  let text = readText(file);
  const before = text;

  text = text
    .replace(/from "\.\/lib\/docsRouting";/g, 'from "../lib/docsRouting";')
    .replace(/from "\.\.\/\.\.\/lib\/docsRouting";/g, 'from "../lib/docsRouting";');

  if (file.includes("/components/") || file.includes("/pages/")) {
    text = text.replace(/from "\.\/lib\/docsRouting";/g, 'from "../lib/docsRouting";');
  }

  if (file === "apps/docs/src/main.tsx") {
    text = text.replace(/from "\.\.\/lib\/docsRouting";/g, 'from "./lib/docsRouting";');
  }

  if (text !== before) {
    writeText(file, text);
  }
}

console.log("Clean routing typecheck fixes applied.");