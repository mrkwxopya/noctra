import { readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return readFileSync(path, "utf8").replace(/^\uFEFF/, "");
}

function writeText(path, content) {
  writeFileSync(path, content, "utf8");
}

function patchText(path, marker, insertAfter) {
  let content = readText(path);
  if (!content.includes(marker)) {
    content = content.replace(insertAfter, `${insertAfter}\n${marker}`);
    writeText(path, content);
  }
}

function patchJsonExport(path, key, value) {
  const json = JSON.parse(readText(path));
  json.exports ??= {};
  json.exports[key] ??= value;
  writeText(path, `${JSON.stringify(json, null, 2)}\n`);
}

patchText("packages/react/src/components/index.ts", 'export * from "./Footer";', 'export * from "./Sidebar";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/footer";', 'export * from "./components/sidebar";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('footer.css')) {
  css = css.replace('@import "./components/sidebar.css";', '@import "./components/sidebar.css";@import "./components/footer.css";');
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./footer", {
  types: "./dist/components/Footer/index.d.ts",
  import: "./dist/components/Footer/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/footer.css", "./src/components/footer.css");