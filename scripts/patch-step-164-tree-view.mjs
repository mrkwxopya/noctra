import { readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return readFileSync(path, "utf8").replace(/^\uFEFF/, "");
}

function writeText(path, content) {
  writeFileSync(path, content, "utf8");
}

function patchText(path, marker, fallback) {
  let content = readText(path);
  if (!content.includes(marker)) {
    content = content.includes(fallback) ? content.replace(fallback, `${fallback}\n${marker}`) : `${content.trimEnd()}\n${marker}\n`;
    writeText(path, content);
  }
}

function patchJsonExport(path, key, value) {
  const json = JSON.parse(readText(path));
  json.exports ??= {};
  json.exports[key] ??= value;
  writeText(path, `${JSON.stringify(json, null, 2)}\n`);
}

patchText("packages/react/src/components/index.ts", 'export * from "./TreeView";', 'export * from "./TransferList";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/tree-view";', 'export * from "./components/transfer-list";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('tree-view.css')) {
  if (css.includes('@import "./components/transfer-list.css";')) {
    css = css.replace('@import "./components/transfer-list.css";', '@import "./components/transfer-list.css";@import "./components/tree-view.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/tree-view.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./tree-view", {
  types: "./dist/components/TreeView/index.d.ts",
  import: "./dist/components/TreeView/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/tree-view.css", "./src/components/tree-view.css");