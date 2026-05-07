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

patchText("packages/react/src/components/index.ts", 'export * from "./ColorPicker";', 'export * from "./ColorInput";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/color-picker";', 'export * from "./components/color-input";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('color-picker.css')) {
  if (css.includes('@import "./components/color-input.css";')) {
    css = css.replace('@import "./components/color-input.css";', '@import "./components/color-input.css";@import "./components/color-picker.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/color-picker.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./color-picker", {
  types: "./dist/components/ColorPicker/index.d.ts",
  import: "./dist/components/ColorPicker/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/color-picker.css", "./src/components/color-picker.css");