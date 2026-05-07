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

patchText("packages/react/src/components/index.ts", 'export * from "./InlineCode";', 'export { CodeBlock } from "./CodeBlock";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/inline-code";', 'export * from "./components/code-block";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('inline-code.css')) {
  if (css.includes('@import "./components/code-block.css";')) {
    css = css.replace('@import "./components/code-block.css";', '@import "./components/code-block.css";@import "./components/inline-code.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/inline-code.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./inline-code", {
  types: "./dist/components/InlineCode/index.d.ts",
  import: "./dist/components/InlineCode/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/inline-code.css", "./src/components/inline-code.css");