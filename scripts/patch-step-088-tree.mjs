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

patchText("packages/react/src/components/index.ts", 'export * from "./Tree";', 'export * from "./Stepper";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/tree";', 'export * from "./components/stepper";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('tree.css')) {
  css = css.replace('@import "./components/stepper.css";', '@import "./components/stepper.css";@import "./components/tree.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./tree", {
  types: "./dist/components/Tree/index.d.ts",
  import: "./dist/components/Tree/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/tree.css", "./src/components/tree.css");