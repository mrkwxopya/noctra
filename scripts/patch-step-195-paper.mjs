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
  /^\s*export\s+\*\s+from\s+["']\.\/Paper["'];\s*\r?\n?/gm,
  /^\s*export\s+\{[^}]*Paper[^}]*\}\s+from\s+["']\.\/Paper["'];\s*\r?\n?/gm,
  /^\s*export\s+type\s+\{[^}]*Paper[^}]*\}\s+from\s+["']\.\/Paper["'];\s*\r?\n?/gm
]);

appendOnce("packages/react/src/components/index.ts", 'export { Paper } from "./Paper";');
appendOnce("packages/react/src/components/index.ts", 'export type { NcPaperPadding, NcPaperShadow, NcPaperVariant, PaperProps, PaperStyle } from "./Paper";');

removeLines("packages/tokens/src/index.ts", [
  /^\s*export\s+\*\s+from\s+["']\.\/components\/paper["'];\s*\r?\n?/gm
]);

appendOnce("packages/tokens/src/index.ts", 'export * from "./components/paper";');

let css = readText("packages/styles/src/components.css");
css = css.replace(/@import "\.\/components\/paper\.css";/g, "");
css = `${css.trimEnd()}\n@import "./components/paper.css";\n`;
writeText("packages/styles/src/components.css", css);

patchJsonExport("packages/react/package.json", "./paper", {
  types: "./dist/components/Paper/index.d.ts",
  import: "./dist/components/Paper/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/paper.css", "./src/components/paper.css");