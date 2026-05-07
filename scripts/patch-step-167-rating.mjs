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

patchText("packages/react/src/components/index.ts", 'export * from "./Rating";', 'export * from "./Stepper";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/rating";', 'export * from "./components/stepper";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('rating.css')) {
  if (css.includes('@import "./components/stepper.css";')) {
    css = css.replace('@import "./components/stepper.css";', '@import "./components/stepper.css";@import "./components/rating.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/rating.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./rating", {
  types: "./dist/components/Rating/index.d.ts",
  import: "./dist/components/Rating/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/rating.css", "./src/components/rating.css");