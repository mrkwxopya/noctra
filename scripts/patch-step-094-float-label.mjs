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

patchText("packages/react/src/components/index.ts", 'export * from "./FloatLabel";', 'export * from "./PinCode";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/float-label";', 'export * from "./components/pin-code";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('float-label.css')) {
  css = css.replace('@import "./components/pin-code.css";', '@import "./components/pin-code.css";@import "./components/float-label.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./float-label", {
  types: "./dist/components/FloatLabel/index.d.ts",
  import: "./dist/components/FloatLabel/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/float-label.css", "./src/components/float-label.css");