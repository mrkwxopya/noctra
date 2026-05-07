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

patchText("packages/react/src/components/index.ts", 'export * from "./PinCode";', 'export * from "./ListBox";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/pin-code";', 'export * from "./components/list-box";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('pin-code.css')) {
  if (css.includes('@import "./components/list-box.css";')) {
    css = css.replace('@import "./components/list-box.css";', '@import "./components/list-box.css";@import "./components/pin-code.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/pin-code.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./pin-code", {
  types: "./dist/components/PinCode/index.d.ts",
  import: "./dist/components/PinCode/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/pin-code.css", "./src/components/pin-code.css");