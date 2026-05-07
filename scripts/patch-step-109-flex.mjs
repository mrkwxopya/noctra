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

patchText("packages/react/src/components/index.ts", 'export * from "./Flex";', 'export * from "./Group";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/flex";', 'export * from "./components/group";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('flex.css')) {
  css = css.replace('@import "./components/group.css";', '@import "./components/group.css";@import "./components/flex.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./flex", {
  types: "./dist/components/Flex/index.d.ts",
  import: "./dist/components/Flex/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/flex.css", "./src/components/flex.css");