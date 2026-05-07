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

patchText("packages/react/src/components/index.ts", 'export * from "./DateInput";', 'export * from "./ColorPicker";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/date-input";', 'export * from "./components/color-picker";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('date-input.css')) {
  if (css.includes('@import "./components/color-picker.css";')) {
    css = css.replace('@import "./components/color-picker.css";', '@import "./components/color-picker.css";@import "./components/date-input.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/date-input.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./date-input", {
  types: "./dist/components/DateInput/index.d.ts",
  import: "./dist/components/DateInput/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/date-input.css", "./src/components/date-input.css");