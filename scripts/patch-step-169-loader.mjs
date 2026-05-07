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

patchText("packages/react/src/components/index.ts", 'export * from "./Loader";', 'export * from "./Progress";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/loader";', 'export * from "./components/progress";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('loader.css')) {
  if (css.includes('@import "./components/progress.css";')) {
    css = css.replace('@import "./components/progress.css";', '@import "./components/progress.css";@import "./components/loader.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/loader.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./loader", {
  types: "./dist/components/Loader/index.d.ts",
  import: "./dist/components/Loader/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/loader.css", "./src/components/loader.css");