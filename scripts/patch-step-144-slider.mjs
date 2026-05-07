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

patchText("packages/react/src/components/index.ts", 'export * from "./Slider";', 'export * from "./Switch";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/slider";', 'export * from "./components/switch";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('slider.css')) {
  if (css.includes('@import "./components/switch.css";')) {
    css = css.replace('@import "./components/switch.css";', '@import "./components/switch.css";@import "./components/slider.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/slider.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./slider", {
  types: "./dist/components/Slider/index.d.ts",
  import: "./dist/components/Slider/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/slider.css", "./src/components/slider.css");