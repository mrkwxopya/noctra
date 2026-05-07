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

patchText("packages/react/src/components/index.ts", 'export * from "./Switch";', 'export * from "./Radio";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/switch";', 'export * from "./components/radio";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('switch.css')) {
  if (css.includes('@import "./components/radio.css";')) {
    css = css.replace('@import "./components/radio.css";', '@import "./components/radio.css";@import "./components/switch.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/switch.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./switch", {
  types: "./dist/components/Switch/index.d.ts",
  import: "./dist/components/Switch/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/switch.css", "./src/components/switch.css");