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

patchText("packages/react/src/components/index.ts", 'export * from "./AppShell";', 'export * from "./LayoutShell";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/app-shell";', 'export * from "./components/layout-shell";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('app-shell.css')) {
  css = css.replace('@import "./components/layout-shell.css";', '@import "./components/layout-shell.css";@import "./components/app-shell.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./app-shell", {
  types: "./dist/components/AppShell/index.d.ts",
  import: "./dist/components/AppShell/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/app-shell.css", "./src/components/app-shell.css");