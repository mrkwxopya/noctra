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
  /^\s*export\s+\*\s+from\s+["']\.\/ClickOutside["'];\s*\r?\n?/gm,
  /^\s*export\s+\{[^}]*ClickOutside[^}]*\}\s+from\s+["']\.\/ClickOutside["'];\s*\r?\n?/gm,
  /^\s*export\s+type\s+\{[^}]*ClickOutside[^}]*\}\s+from\s+["']\.\/ClickOutside["'];\s*\r?\n?/gm
]);

appendOnce("packages/react/src/components/index.ts", 'export { ClickOutside } from "./ClickOutside";');
appendOnce("packages/react/src/components/index.ts", 'export type { ClickOutsideEventType, ClickOutsideProps, ClickOutsideStyle, NcClickOutsideVariant } from "./ClickOutside";');

removeLines("packages/tokens/src/index.ts", [
  /^\s*export\s+\*\s+from\s+["']\.\/components\/click-outside["'];\s*\r?\n?/gm
]);

appendOnce("packages/tokens/src/index.ts", 'export * from "./components/click-outside";');

let css = readText("packages/styles/src/components.css");
css = css.replace(/@import "\.\/components\/click-outside\.css";/g, "");
css = `${css.trimEnd()}@import "./components/click-outside.css";\n`;
writeText("packages/styles/src/components.css", css);

patchJsonExport("packages/react/package.json", "./click-outside", {
  types: "./dist/components/ClickOutside/index.d.ts",
  import: "./dist/components/ClickOutside/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/click-outside.css", "./src/components/click-outside.css");