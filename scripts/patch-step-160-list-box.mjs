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

patchText("packages/react/src/components/index.ts", 'export * from "./ListBox";', 'export * from "./CreditCard";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/list-box";', 'export * from "./components/credit-card";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('list-box.css')) {
  if (css.includes('@import "./components/credit-card.css";')) {
    css = css.replace('@import "./components/credit-card.css";', '@import "./components/credit-card.css";@import "./components/list-box.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/list-box.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./list-box", {
  types: "./dist/components/ListBox/index.d.ts",
  import: "./dist/components/ListBox/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/list-box.css", "./src/components/list-box.css");