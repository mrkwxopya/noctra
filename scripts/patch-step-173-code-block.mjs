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

patchText("packages/react/src/components/index.ts", 'export * from "./CodeBlock";', 'export * from "./Kbd";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/code-block";', 'export * from "./components/kbd";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('code-block.css')) {
  if (css.includes('@import "./components/kbd.css";')) {
    css = css.replace('@import "./components/kbd.css";', '@import "./components/kbd.css";@import "./components/code-block.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/code-block.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./code-block", {
  types: "./dist/components/CodeBlock/index.d.ts",
  import: "./dist/components/CodeBlock/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/code-block.css", "./src/components/code-block.css");