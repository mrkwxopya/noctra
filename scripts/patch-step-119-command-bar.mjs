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

patchText("packages/react/src/components/index.ts", 'export * from "./CommandBar";', 'export * from "./Toolbar";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/command-bar";', 'export * from "./components/toolbar";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('command-bar.css')) {
  css = css.replace('@import "./components/toolbar.css";', '@import "./components/toolbar.css";@import "./components/command-bar.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./command-bar", {
  types: "./dist/components/CommandBar/index.d.ts",
  import: "./dist/components/CommandBar/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/command-bar.css", "./src/components/command-bar.css");