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

patchText("packages/react/src/components/index.ts", 'export * from "./Drawer";', 'export * from "./Modal";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/drawer";', 'export * from "./components/modal";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('drawer.css')) {
  if (css.includes('@import "./components/modal.css";')) {
    css = css.replace('@import "./components/modal.css";', '@import "./components/modal.css";@import "./components/drawer.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/drawer.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./drawer", {
  types: "./dist/components/Drawer/index.d.ts",
  import: "./dist/components/Drawer/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/drawer.css", "./src/components/drawer.css");