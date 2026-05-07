import { readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return readFileSync(path, "utf8").replace(/^\uFEFF/, "");
}

function writeText(path, content) {
  writeFileSync(path, content, "utf8");
}

function removeLines(path, patterns) {
  let content = readText(path);
  for (const pattern of patterns) {
    content = content.replace(pattern, "");
  }
  writeText(path, `${content.trimEnd()}\n`);
}

function appendOnce(path, marker) {
  let content = readText(path);
  if (!content.includes(marker)) {
    content = `${content.trimEnd()}\n${marker}\n`;
    writeText(path, content);
  }
}

function patchJsonExport(path, key, value) {
  const json = JSON.parse(readText(path));
  json.exports ??= {};
  json.exports[key] ??= value;
  writeText(path, `${JSON.stringify(json, null, 2)}\n`);
}

removeLines("packages/react/src/components/index.ts", [
  /^\s*export\s+\*\s+from\s+["']\.\/AspectRatio["'];\s*\r?\n?/gm,
  /^\s*export\s+\{[^}]*AspectRatio[^}]*\}\s+from\s+["']\.\/AspectRatio["'];\s*\r?\n?/gm,
  /^\s*export\s+type\s+\{[^}]*AspectRatio[^}]*\}\s+from\s+["']\.\/AspectRatio["'];\s*\r?\n?/gm
]);

appendOnce("packages/react/src/components/index.ts", 'export { AspectRatio } from "./AspectRatio";');
appendOnce("packages/react/src/components/index.ts", 'export type { AspectRatioProps, AspectRatioStyle, NcAspectRatioFit, NcAspectRatioPreset, NcAspectRatioVariant } from "./AspectRatio";');

removeLines("packages/tokens/src/index.ts", [
  /^\s*export\s+\*\s+from\s+["']\.\/components\/aspect-ratio["'];\s*\r?\n?/gm
]);

appendOnce("packages/tokens/src/index.ts", 'export * from "./components/aspect-ratio";');

let css = readText("packages/styles/src/components.css");
css = css.replace(/@import "\.\/components\/aspect-ratio\.css";/g, "");
css = `${css.trimEnd()}@import "./components/aspect-ratio.css";\n`;
writeText("packages/styles/src/components.css", css);

patchJsonExport("packages/react/package.json", "./aspect-ratio", {
  types: "./dist/components/AspectRatio/index.d.ts",
  import: "./dist/components/AspectRatio/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/aspect-ratio.css", "./src/components/aspect-ratio.css");