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

patchText("packages/react/src/components/index.ts", 'export * from "./PinCode";', 'export * from "./CreditCard";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/pin-code";', 'export * from "./components/credit-card";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('pin-code.css')) {
  css = css.replace('@import "./components/credit-card.css";', '@import "./components/credit-card.css";@import "./components/pin-code.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./pin-code", {
  types: "./dist/components/PinCode/index.d.ts",
  import: "./dist/components/PinCode/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/pin-code.css", "./src/components/pin-code.css");