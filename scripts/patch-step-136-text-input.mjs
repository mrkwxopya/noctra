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

patchText("packages/react/src/components/index.ts", 'export * from "./TextInput";', 'export * from "./TagsInput";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/text-input";', 'export * from "./components/tags-input";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('text-input.css')) {
  if (css.includes('@import "./components/tags-input.css";')) {
    css = css.replace('@import "./components/tags-input.css";', '@import "./components/tags-input.css";@import "./components/text-input.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/text-input.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./text-input", {
  types: "./dist/components/TextInput/index.d.ts",
  import: "./dist/components/TextInput/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/text-input.css", "./src/components/text-input.css");