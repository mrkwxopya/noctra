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

patchText("packages/react/src/components/index.ts", 'export * from "./Tooltip";', 'export * from "./Popover";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/tooltip";', 'export * from "./components/popover";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('tooltip.css')) {
  if (css.includes('@import "./components/popover.css";')) {
    css = css.replace('@import "./components/popover.css";', '@import "./components/popover.css";@import "./components/tooltip.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/tooltip.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./tooltip", {
  types: "./dist/components/Tooltip/index.d.ts",
  import: "./dist/components/Tooltip/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/tooltip.css", "./src/components/tooltip.css");