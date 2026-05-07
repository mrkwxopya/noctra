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

patchText("packages/react/src/components/index.ts", 'export * from "./ResizablePanel";', 'export * from "./SplitPane";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/resizable-panel";', 'export * from "./components/split-pane";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('resizable-panel.css')) {
  css = css.replace('@import "./components/split-pane.css";', '@import "./components/split-pane.css";@import "./components/resizable-panel.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./resizable-panel", {
  types: "./dist/components/ResizablePanel/index.d.ts",
  import: "./dist/components/ResizablePanel/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/resizable-panel.css", "./src/components/resizable-panel.css");