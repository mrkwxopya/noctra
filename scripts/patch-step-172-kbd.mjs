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

patchText("packages/react/src/components/index.ts", 'export * from "./Kbd";', 'export * from "./EmptyState";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/kbd";', 'export * from "./components/empty-state";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('kbd.css')) {
  if (css.includes('@import "./components/empty-state.css";')) {
    css = css.replace('@import "./components/empty-state.css";', '@import "./components/empty-state.css";@import "./components/kbd.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/kbd.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./kbd", {
  types: "./dist/components/Kbd/index.d.ts",
  import: "./dist/components/Kbd/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/kbd.css", "./src/components/kbd.css");