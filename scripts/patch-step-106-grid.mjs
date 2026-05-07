import { readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return readFileSync(path, "utf8").replace(/^\uFEFF/, "");
}

function writeText(path, content) {
  writeFileSync(path, content, "utf8");
}

function patchText(path, marker, insertAfter) {
  let content = readText(path);
  if (!content.includes(marker)) {
    content = content.replace(insertAfter, `${insertAfter}\n${marker}`);
    writeText(path, content);
  }
}

function patchJsonExport(path, key, value) {
  const json = JSON.parse(readText(path));
  json.exports ??= {};
  json.exports[key] ??= value;
  writeText(path, `${JSON.stringify(json, null, 2)}\n`);
}

patchText("packages/react/src/components/index.ts", 'export * from "./Grid";', 'export * from "./Container";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/grid";', 'export * from "./components/container";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('grid.css')) {
  css = css.replace('@import "./components/container.css";', '@import "./components/container.css";@import "./components/grid.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./grid", {
  types: "./dist/components/Grid/index.d.ts",
  import: "./dist/components/Grid/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/grid.css", "./src/components/grid.css");