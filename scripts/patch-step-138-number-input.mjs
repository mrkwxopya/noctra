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

patchText("packages/react/src/components/index.ts", 'export * from "./NumberInput";', 'export * from "./Textarea";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/number-input";', 'export * from "./components/textarea";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('number-input.css')) {
  if (css.includes('@import "./components/textarea.css";')) {
    css = css.replace('@import "./components/textarea.css";', '@import "./components/textarea.css";@import "./components/number-input.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/number-input.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./number-input", {
  types: "./dist/components/NumberInput/index.d.ts",
  import: "./dist/components/NumberInput/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/number-input.css", "./src/components/number-input.css");