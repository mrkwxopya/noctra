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

patchText("packages/react/src/components/index.ts", 'export * from "./DataGrid";', 'export * from "./Table";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/data-grid";', 'export * from "./components/table";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('data-grid.css')) {
  css = css.replace('@import "./components/table.css";', '@import "./components/table.css";@import "./components/data-grid.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./data-grid", {
  types: "./dist/components/DataGrid/index.d.ts",
  import: "./dist/components/DataGrid/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/data-grid.css", "./src/components/data-grid.css");