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

patchText("packages/react/src/components/index.ts", 'export * from "./Center";', 'export * from "./Flex";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/center";', 'export * from "./components/flex";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('center.css')) {
  css = css.replace('@import "./components/flex.css";', '@import "./components/flex.css";@import "./components/center.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./center", {
  types: "./dist/components/Center/index.d.ts",
  import: "./dist/components/Center/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/center.css", "./src/components/center.css");