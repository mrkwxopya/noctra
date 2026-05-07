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

patchText("packages/react/src/components/index.ts", 'export * from "./TreeSelect";', 'export * from "./Combobox";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/tree-select";', 'export * from "./components/combobox";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('tree-select.css')) {
  css = css.replace('@import "./components/combobox.css";', '@import "./components/combobox.css";@import "./components/tree-select.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./tree-select", {
  types: "./dist/components/TreeSelect/index.d.ts",
  import: "./dist/components/TreeSelect/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/tree-select.css", "./src/components/tree-select.css");