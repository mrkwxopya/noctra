import { readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return readFileSync(path, "utf8").replace(/^\uFEFF/, "");
}

function writeText(path, content) {
  writeFileSync(path, content, "utf8");
}

function removeLines(path, patterns) {
  let content = readText(path);
  for (const pattern of patterns) {
    content = content.replace(pattern, "");
  }
  writeText(path, `${content.trimEnd()}\n`);
}

function appendOnce(path, marker) {
  let content = readText(path);
  if (!content.includes(marker)) {
    content = `${content.trimEnd()}\n${marker}\n`;
    writeText(path, content);
  }
}

function patchJsonExport(path, key, value) {
  const json = JSON.parse(readText(path));
  json.exports ??= {};
  json.exports[key] ??= value;
  writeText(path, `${JSON.stringify(json, null, 2)}\n`);
}

removeLines("packages/react/src/components/index.ts", [
  /^\s*export\s+\*\s+from\s+["']\.\/Highlight["'];\s*\r?\n?/gm,
  /^\s*export\s+\{[^}]*Highlight[^}]*\}\s+from\s+["']\.\/Highlight["'];\s*\r?\n?/gm,
  /^\s*export\s+type\s+\{[^}]*Highlight[^}]*\}\s+from\s+["']\.\/Highlight["'];\s*\r?\n?/gm
]);

appendOnce("packages/react/src/components/index.ts", 'export { Highlight } from "./Highlight";');
appendOnce("packages/react/src/components/index.ts", 'export type { HighlightProps, HighlightStyle, NcHighlightVariant } from "./Highlight";');

removeLines("packages/tokens/src/index.ts", [
  /^\s*export\s+\*\s+from\s+["']\.\/components\/highlight["'];\s*\r?\n?/gm
]);

appendOnce("packages/tokens/src/index.ts", 'export * from "./components/highlight";');

let css = readText("packages/styles/src/components.css");
css = css.replace(/@import "\.\/components\/highlight\.css";/g, "");
css = `${css.trimEnd()}@import "./components/highlight.css";\n`;
writeText("packages/styles/src/components.css", css);

patchJsonExport("packages/react/package.json", "./highlight", {
  types: "./dist/components/Highlight/index.d.ts",
  import: "./dist/components/Highlight/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/highlight.css", "./src/components/highlight.css");