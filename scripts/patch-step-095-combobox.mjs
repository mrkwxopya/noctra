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

patchText("packages/react/src/components/index.ts", 'export * from "./Combobox";', 'export * from "./FloatLabel";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/combobox";', 'export * from "./components/float-label";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('combobox.css')) {
  css = css.replace('@import "./components/float-label.css";', '@import "./components/float-label.css";@import "./components/combobox.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./combobox", {
  types: "./dist/components/Combobox/index.d.ts",
  import: "./dist/components/Combobox/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/combobox.css", "./src/components/combobox.css");