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

patchText("packages/react/src/components/index.ts", 'export * from "./MultiSelect";', 'export * from "./Select";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/multi-select";', 'export * from "./components/select";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('multi-select.css')) {
  if (css.includes('@import "./components/select.css";')) {
    css = css.replace('@import "./components/select.css";', '@import "./components/select.css";@import "./components/multi-select.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/multi-select.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./multi-select", {
  types: "./dist/components/MultiSelect/index.d.ts",
  import: "./dist/components/MultiSelect/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/multi-select.css", "./src/components/multi-select.css");