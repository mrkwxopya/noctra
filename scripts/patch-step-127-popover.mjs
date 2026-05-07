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

patchText("packages/react/src/components/index.ts", 'export * from "./Popover";', 'export * from "./Drawer";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/popover";', 'export * from "./components/drawer";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('popover.css')) {
  if (css.includes('@import "./components/drawer.css";')) {
    css = css.replace('@import "./components/drawer.css";', '@import "./components/drawer.css";@import "./components/popover.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/popover.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./popover", {
  types: "./dist/components/Popover/index.d.ts",
  import: "./dist/components/Popover/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/popover.css", "./src/components/popover.css");