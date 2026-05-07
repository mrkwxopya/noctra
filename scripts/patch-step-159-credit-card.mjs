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

patchText("packages/react/src/components/index.ts", 'export * from "./CreditCard";', 'export * from "./Clipboard";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/credit-card";', 'export * from "./components/clipboard";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('credit-card.css')) {
  if (css.includes('@import "./components/clipboard.css";')) {
    css = css.replace('@import "./components/clipboard.css";', '@import "./components/clipboard.css";@import "./components/credit-card.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/credit-card.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./credit-card", {
  types: "./dist/components/CreditCard/index.d.ts",
  import: "./dist/components/CreditCard/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/credit-card.css", "./src/components/credit-card.css");