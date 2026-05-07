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

patchText("packages/react/src/components/index.ts", 'export * from "./ContextMenu";', 'export * from "./Menu";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/context-menu";', 'export * from "./components/menu";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('context-menu.css')) {
  if (css.includes('@import "./components/menu.css";')) {
    css = css.replace('@import "./components/menu.css";', '@import "./components/menu.css";@import "./components/context-menu.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/context-menu.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./context-menu", {
  types: "./dist/components/ContextMenu/index.d.ts",
  import: "./dist/components/ContextMenu/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/context-menu.css", "./src/components/context-menu.css");