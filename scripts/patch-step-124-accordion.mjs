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

patchText("packages/react/src/components/index.ts", 'export * from "./Accordion";', 'export * from "./Tabs";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/accordion";', 'export * from "./components/tabs";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('accordion.css')) {
  if (css.includes('@import "./components/tabs.css";')) {
    css = css.replace('@import "./components/tabs.css";', '@import "./components/tabs.css";@import "./components/accordion.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/accordion.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./accordion", {
  types: "./dist/components/Accordion/index.d.ts",
  import: "./dist/components/Accordion/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/accordion.css", "./src/components/accordion.css");