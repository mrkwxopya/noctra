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

patchText("packages/react/src/components/index.ts", 'export * from "./MonthInput";', 'export * from "./DateTimeInput";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/month-input";', 'export * from "./components/date-time-input";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('month-input.css')) {
  if (css.includes('@import "./components/date-time-input.css";')) {
    css = css.replace('@import "./components/date-time-input.css";', '@import "./components/date-time-input.css";@import "./components/month-input.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/month-input.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./month-input", {
  types: "./dist/components/MonthInput/index.d.ts",
  import: "./dist/components/MonthInput/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/month-input.css", "./src/components/month-input.css");