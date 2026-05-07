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
  /^\s*export\s+\*\s+from\s+["']\.\/ScrollLock["'];\s*\r?\n?/gm,
  /^\s*export\s+\{[^}]*ScrollLock[^}]*\}\s+from\s+["']\.\/ScrollLock["'];\s*\r?\n?/gm,
  /^\s*export\s+type\s+\{[^}]*ScrollLock[^}]*\}\s+from\s+["']\.\/ScrollLock["'];\s*\r?\n?/gm
]);

appendOnce("packages/react/src/components/index.ts", 'export { ScrollLock } from "./ScrollLock";');
appendOnce("packages/react/src/components/index.ts", 'export type { NcScrollLockTarget, NcScrollLockVariant, ScrollLockProps, ScrollLockStyle } from "./ScrollLock";');

removeLines("packages/tokens/src/index.ts", [
  /^\s*export\s+\*\s+from\s+["']\.\/components\/scroll-lock["'];\s*\r?\n?/gm
]);

appendOnce("packages/tokens/src/index.ts", 'export * from "./components/scroll-lock";');

let css = readText("packages/styles/src/components.css");
css = css.replace(/@import "\.\/components\/scroll-lock\.css";/g, "");
css = `${css.trimEnd()}@import "./components/scroll-lock.css";\n`;
writeText("packages/styles/src/components.css", css);

patchJsonExport("packages/react/package.json", "./scroll-lock", {
  types: "./dist/components/ScrollLock/index.d.ts",
  import: "./dist/components/ScrollLock/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/scroll-lock.css", "./src/components/scroll-lock.css");