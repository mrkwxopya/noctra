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

patchText("packages/react/src/components/index.ts", 'export * from "./DateTimeInput";', 'export * from "./TimeInput";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/date-time-input";', 'export * from "./components/time-input";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('date-time-input.css')) {
  if (css.includes('@import "./components/time-input.css";')) {
    css = css.replace('@import "./components/time-input.css";', '@import "./components/time-input.css";@import "./components/date-time-input.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/date-time-input.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./date-time-input", {
  types: "./dist/components/DateTimeInput/index.d.ts",
  import: "./dist/components/DateTimeInput/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/date-time-input.css", "./src/components/date-time-input.css");