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

patchText("packages/react/src/components/index.ts", 'export * from "./HoverCard";', 'export * from "./Tooltip";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/hover-card";', 'export * from "./components/tooltip";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('hover-card.css')) {
  if (css.includes('@import "./components/tooltip.css";')) {
    css = css.replace('@import "./components/tooltip.css";', '@import "./components/tooltip.css";@import "./components/hover-card.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/hover-card.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./hover-card", {
  types: "./dist/components/HoverCard/index.d.ts",
  import: "./dist/components/HoverCard/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/hover-card.css", "./src/components/hover-card.css");