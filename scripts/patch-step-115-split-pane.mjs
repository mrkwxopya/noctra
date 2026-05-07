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

patchText("packages/react/src/components/index.ts", 'export * from "./SplitPane";', 'export * from "./ScrollArea";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/split-pane";', 'export * from "./components/scroll-area";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('split-pane.css')) {
  css = css.replace('@import "./components/scroll-area.css";', '@import "./components/scroll-area.css";@import "./components/split-pane.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./split-pane", {
  types: "./dist/components/SplitPane/index.d.ts",
  import: "./dist/components/SplitPane/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/split-pane.css", "./src/components/split-pane.css");