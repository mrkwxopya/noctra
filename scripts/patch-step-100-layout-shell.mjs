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

patchText("packages/react/src/components/index.ts", 'export * from "./LayoutShell";', 'export * from "./Spotlight";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/layout-shell";', 'export * from "./components/spotlight";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('layout-shell.css')) {
  css = css.replace('@import "./components/spotlight.css";', '@import "./components/spotlight.css";@import "./components/layout-shell.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./layout-shell", {
  types: "./dist/components/LayoutShell/index.d.ts",
  import: "./dist/components/LayoutShell/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/layout-shell.css", "./src/components/layout-shell.css");