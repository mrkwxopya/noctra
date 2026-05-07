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

patchText("packages/react/src/components/index.ts", 'export * from "./Tabs";', 'export * from "./Pagination";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/tabs";', 'export * from "./components/pagination";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('tabs.css')) {
  if (css.includes('@import "./components/pagination.css";')) {
    css = css.replace('@import "./components/pagination.css";', '@import "./components/pagination.css";@import "./components/tabs.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/tabs.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./tabs", {
  types: "./dist/components/Tabs/index.d.ts",
  import: "./dist/components/Tabs/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/tabs.css", "./src/components/tabs.css");