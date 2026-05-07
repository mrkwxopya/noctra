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

patchText("packages/react/src/components/index.ts", 'export * from "./Modal";', 'export * from "./Accordion";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/modal";', 'export * from "./components/accordion";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('modal.css')) {
  if (css.includes('@import "./components/accordion.css";')) {
    css = css.replace('@import "./components/accordion.css";', '@import "./components/accordion.css";@import "./components/modal.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/modal.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./modal", {
  types: "./dist/components/Modal/index.d.ts",
  import: "./dist/components/Modal/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/modal.css", "./src/components/modal.css");