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

patchText("packages/react/src/components/index.ts", 'export * from "./PinInput";', 'export * from "./PasswordInput";');
patchText("packages/tokens/src/index.ts", 'export * from "./components/pin-input";', 'export * from "./components/password-input";');

let css = readText("packages/styles/src/components.css");
if (!css.includes('pin-input.css')) {
  if (css.includes('@import "./components/password-input.css";')) {
    css = css.replace('@import "./components/password-input.css";', '@import "./components/password-input.css";@import "./components/pin-input.css";');
  } else {
    css = `${css.trimEnd()}@import "./components/pin-input.css";\n`;
  }
  writeText("packages/styles/src/components.css", css);
}

patchJsonExport("packages/react/package.json", "./pin-input", {
  types: "./dist/components/PinInput/index.d.ts",
  import: "./dist/components/PinInput/index.js"
});

patchJsonExport("packages/styles/package.json", "./components/pin-input.css", "./src/components/pin-input.css");