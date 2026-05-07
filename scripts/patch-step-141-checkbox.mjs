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

patchText("packages/react/src/components/index.ts", 'export * from "./Checkbox";', 'export * from "./PinInput";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/checkbox";', 'export * from "./components/pin-input";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('checkbox.css')) {
  if (css.includes('@import "./components/pin-input.css";')) {
    css = css.replace('@import "./components/pin-input.css";', '@import "./components/pin-input.css";@import "./components/checkbox.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/checkbox.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./checkbox", {
  types: "./dist/components/Checkbox/index.d.ts",
  import: "./dist/components/Checkbox/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/checkbox.css", "./src/components/checkbox.css");