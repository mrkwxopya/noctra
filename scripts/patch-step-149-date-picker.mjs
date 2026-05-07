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

patchText("packages/react/src/components/index.ts", 'export * from "./DatePicker";', 'export * from "./DateInput";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/date-picker";', 'export * from "./components/date-input";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('date-picker.css')) {
  if (css.includes('@import "./components/date-input.css";')) {
    css = css.replace('@import "./components/date-input.css";', '@import "./components/date-input.css";@import "./components/date-picker.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/date-picker.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./date-picker", {
  types: "./dist/components/DatePicker/index.d.ts",
  import: "./dist/components/DatePicker/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/date-picker.css", "./src/components/date-picker.css");