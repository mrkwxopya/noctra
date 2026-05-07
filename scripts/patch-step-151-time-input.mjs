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

patchText("packages/react/src/components/index.ts", 'export * from "./TimeInput";', 'export * from "./DateRangePicker";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/time-input";', 'export * from "./components/date-range-picker";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('time-input.css')) {
  if (css.includes('@import "./components/date-range-picker.css";')) {
    css = css.replace('@import "./components/date-range-picker.css";', '@import "./components/date-range-picker.css";@import "./components/time-input.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/time-input.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./time-input", {
  types: "./dist/components/TimeInput/index.d.ts",
  import: "./dist/components/TimeInput/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/time-input.css", "./src/components/time-input.css");