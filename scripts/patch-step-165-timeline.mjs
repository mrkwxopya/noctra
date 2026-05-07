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

patchText("packages/react/src/components/index.ts", 'export * from "./Timeline";', 'export * from "./TreeView";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/timeline";', 'export * from "./components/tree-view";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('timeline.css')) {
  if (css.includes('@import "./components/tree-view.css";')) {
    css = css.replace('@import "./components/tree-view.css";', '@import "./components/tree-view.css";@import "./components/timeline.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/timeline.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./timeline", {
  types: "./dist/components/Timeline/index.d.ts",
  import: "./dist/components/Timeline/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/timeline.css", "./src/components/timeline.css");