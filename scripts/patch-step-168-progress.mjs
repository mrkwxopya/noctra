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

patchText("packages/react/src/components/index.ts", 'export * from "./Progress";', 'export * from "./Rating";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/progress";', 'export * from "./components/rating";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('progress.css')) {
  if (css.includes('@import "./components/rating.css";')) {
    css = css.replace('@import "./components/rating.css";', '@import "./components/rating.css";@import "./components/progress.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/progress.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./progress", {
  types: "./dist/components/Progress/index.d.ts",
  import: "./dist/components/Progress/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/progress.css", "./src/components/progress.css");