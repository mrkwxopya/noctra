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

patchText("packages/react/src/components/index.ts", 'export * from "./ListBox";', 'export * from "./TransferList";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/list-box";', 'export * from "./components/transfer-list";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('list-box.css')) {
  css = css.replace('@import "./components/transfer-list.css";', '@import "./components/transfer-list.css";@import "./components/list-box.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./list-box", {
  types: "./dist/components/ListBox/index.d.ts",
  import: "./dist/components/ListBox/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/list-box.css", "./src/components/list-box.css");