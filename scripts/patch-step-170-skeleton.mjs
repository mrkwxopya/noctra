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

patchText("packages/react/src/components/index.ts", 'export * from "./Skeleton";', 'export * from "./Loader";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/skeleton";', 'export * from "./components/loader";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('skeleton.css')) {
  if (css.includes('@import "./components/loader.css";')) {
    css = css.replace('@import "./components/loader.css";', '@import "./components/loader.css";@import "./components/skeleton.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/skeleton.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./skeleton", {
  types: "./dist/components/Skeleton/index.d.ts",
  import: "./dist/components/Skeleton/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/skeleton.css", "./src/components/skeleton.css");