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

patchText("packages/react/src/components/index.ts", 'export * from "./RangeSlider";', 'export * from "./Slider";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/range-slider";', 'export * from "./components/slider";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('range-slider.css')) {
  if (css.includes('@import "./components/slider.css";')) {
    css = css.replace('@import "./components/slider.css";', '@import "./components/slider.css";@import "./components/range-slider.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/range-slider.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./range-slider", {
  types: "./dist/components/RangeSlider/index.d.ts",
  import: "./dist/components/RangeSlider/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/range-slider.css", "./src/components/range-slider.css");