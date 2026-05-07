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

patchText("packages/react/src/components/index.ts", 'export * from "./Anchor";', 'export * from "./TableOfContents";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/anchor";', 'export * from "./components/table-of-contents";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('anchor.css')) {
  css = css.replace('@import "./components/table-of-contents.css";', '@import "./components/table-of-contents.css";@import "./components/anchor.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./anchor", {
  types: "./dist/components/Anchor/index.d.ts",
  import: "./dist/components/Anchor/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/anchor.css", "./src/components/anchor.css");