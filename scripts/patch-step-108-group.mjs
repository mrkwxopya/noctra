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

patchText("packages/react/src/components/index.ts", 'export * from "./Group";', 'export * from "./Stack";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/group";', 'export * from "./components/stack";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('group.css')) {
  css = css.replace('@import "./components/stack.css";', '@import "./components/stack.css";@import "./components/group.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./group", {
  types: "./dist/components/Group/index.d.ts",
  import: "./dist/components/Group/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/group.css", "./src/components/group.css");