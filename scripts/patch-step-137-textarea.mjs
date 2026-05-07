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

patchText("packages/react/src/components/index.ts", 'export * from "./Textarea";', 'export * from "./TextInput";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/textarea";', 'export * from "./components/text-input";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('textarea.css')) {
  if (css.includes('@import "./components/text-input.css";')) {
    css = css.replace('@import "./components/text-input.css";', '@import "./components/text-input.css";@import "./components/textarea.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/textarea.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./textarea", {
  types: "./dist/components/Textarea/index.d.ts",
  import: "./dist/components/Textarea/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/textarea.css", "./src/components/textarea.css");