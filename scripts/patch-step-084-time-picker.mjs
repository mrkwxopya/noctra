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

patchText("packages/react/src/components/index.ts", 'export * from "./TimePicker";', 'export * from "./DatePicker";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/time-picker";', 'export * from "./components/date-picker";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('time-picker.css')) {
  css = css.replace('@import "./components/date-picker.css";', '@import "./components/date-picker.css";@import "./components/time-picker.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./time-picker", {
  types: "./dist/components/TimePicker/index.d.ts",
  import: "./dist/components/TimePicker/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/time-picker.css", "./src/components/time-picker.css");