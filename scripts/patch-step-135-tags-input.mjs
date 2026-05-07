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

patchText("packages/react/src/components/index.ts", 'export * from "./TagsInput";', 'export * from "./Autocomplete";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/tags-input";', 'export * from "./components/autocomplete";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('tags-input.css')) {
  if (css.includes('@import "./components/autocomplete.css";')) {
    css = css.replace('@import "./components/autocomplete.css";', '@import "./components/autocomplete.css";@import "./components/tags-input.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/tags-input.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./tags-input", {
  types: "./dist/components/TagsInput/index.d.ts",
  import: "./dist/components/TagsInput/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/tags-input.css", "./src/components/tags-input.css");