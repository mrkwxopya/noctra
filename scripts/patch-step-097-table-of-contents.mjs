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

patchText("packages/react/src/components/index.ts", 'export * from "./TableOfContents";', 'export * from "./TreeSelect";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/table-of-contents";', 'export * from "./components/tree-select";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('table-of-contents.css')) {
  css = css.replace('@import "./components/tree-select.css";', '@import "./components/tree-select.css";@import "./components/table-of-contents.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./table-of-contents", {
  types: "./dist/components/TableOfContents/index.d.ts",
  import: "./dist/components/TableOfContents/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/table-of-contents.css", "./src/components/table-of-contents.css");