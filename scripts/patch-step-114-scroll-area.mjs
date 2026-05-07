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

patchText("packages/react/src/components/index.ts", 'export * from "./ScrollArea";', 'export * from "./AspectRatio";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/scroll-area";', 'export * from "./components/aspect-ratio";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('scroll-area.css')) {
  css = css.replace('@import "./components/aspect-ratio.css";', '@import "./components/aspect-ratio.css";@import "./components/scroll-area.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./scroll-area", {
  types: "./dist/components/ScrollArea/index.d.ts",
  import: "./dist/components/ScrollArea/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/scroll-area.css", "./src/components/scroll-area.css");