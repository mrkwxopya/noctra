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

    if (/\.(ts|tsx|md|json)$/.test(entry)) {
      output.push(fullPath.replace(/\\/g, "/"));
    }
  }

  return output;
}

for (const file of walk("apps/docs/src")) {
  let text = readText(file);
  const before = text;

  text = text
    .replace(/href="\/components/g, 'href="/noctra/components')
    .replace(/href: "\/components/g, 'href: "/noctra/components')
    .replace(/href='\/components/g, "href='/noctra/components")
    .replace(/href=\{`\/components\/\$\{([^}]+)\}`\}/g, "href={docsHref(`/components/${$1}`)}")
    .replace(/https:\/\/mrkwxopya\.github\.io\/components/g, "https://mrkwxopya.github.io/noctra/components")
    .replace(/"\/components\/\$\{/g, '"/noctra/components/${')
    .replace(/'\/components\/\$\{/g, "'/noctra/components/${");

  if (text.includes("docsHref(") && !text.includes("../lib/docsRouting") && !file.endsWith("docsRouting.ts") && !file.includes("/generated/")) {
    const importPath = file.includes("/components/") || file.includes("/pages/") || file.includes("/data/")
      ? "../lib/docsRouting"
      : "./lib/docsRouting";

    const lines = text.split(/\r?\n/g);
    const lastImportIndex = lines.findLastIndex((line) => line.startsWith("import "));

    if (lastImportIndex >= 0) {
      lines.splice(lastImportIndex + 1, 0, `import { docsHref } from "${importPath}";`);
      text = lines.join("\n");
    }
  }

  if (text !== before) {
    writeText(file, text);
  }
}

console.log("Hard fixed docs base links.");
