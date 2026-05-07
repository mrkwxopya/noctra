import { readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return readFileSync(path, "utf8").replace(/^\uFEFF/, "");
}

function writeText(path, content) {
  writeFileSync(path, content, "utf8");
}

function patchText(path, marker, fallback) {
  let content = readText(path);
  if (!content.includes(marker)) {
    content = content.includes(fallback) ? content.replace(fallback, `${fallback}\n${marker}`) : `${content.trimEnd()}\n${marker}\n`;
    writeText(path, content);
  }
}

function patchJsonExport(path, key, value) {
  const json = JSON.parse(readText(path));
  json.exports ??= {};
  json.exports[key] ??= value;
  writeText(path, `${JSON.stringify(json, null, 2)}\n`);
}

patchText("packages/react/src/components/index.ts", 'export * from "./TransferList";', 'export * from "./FloatLabel";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/transfer-list";', 'export * from "./components/float-label";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('transfer-list.css')) {
  if (css.includes('@import "./components/float-label.css";')) {
    css = css.replace('@import "./components/float-label.css";', '@import "./components/float-label.css";@import "./components/transfer-list.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/transfer-list.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./transfer-list", {
  types: "./dist/components/TransferList/index.d.ts",
  import: "./dist/components/TransferList/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/transfer-list.css", "./src/components/transfer-list.css");