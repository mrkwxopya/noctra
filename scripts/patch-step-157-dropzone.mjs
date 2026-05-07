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

patchText("packages/react/src/components/index.ts", 'export * from "./Dropzone";', 'export * from "./FileInput";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/dropzone";', 'export * from "./components/file-input";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('dropzone.css')) {
  if (css.includes('@import "./components/file-input.css";')) {
    css = css.replace('@import "./components/file-input.css";', '@import "./components/file-input.css";@import "./components/dropzone.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/dropzone.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./dropzone", {
  types: "./dist/components/Dropzone/index.d.ts",
  import: "./dist/components/Dropzone/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/dropzone.css", "./src/components/dropzone.css");