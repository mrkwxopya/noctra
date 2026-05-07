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

patchText("packages/react/src/components/index.ts", 'export * from "./Select";', 'export * from "./ContextMenu";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/select";', 'export * from "./components/context-menu";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('select.css')) {
  if (css.includes('@import "./components/context-menu.css";')) {
    css = css.replace('@import "./components/context-menu.css";', '@import "./components/context-menu.css";@import "./components/select.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/select.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./select", {
  types: "./dist/components/Select/index.d.ts",
  import: "./dist/components/Select/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/select.css", "./src/components/select.css");