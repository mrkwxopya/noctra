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

patchText("packages/react/src/components/index.ts", 'export * from "./DatePicker";', 'export * from "./Calendar";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/date-picker";', 'export * from "./components/calendar";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('date-picker.css')) {
  css = css.replace('@import "./components/calendar.css";', '@import "./components/calendar.css";@import "./components/date-picker.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./date-picker", {
  types: "./dist/components/DatePicker/index.d.ts",
  import: "./dist/components/DatePicker/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/date-picker.css", "./src/components/date-picker.css");