import { existsSync, readFileSync, writeFileSync } from "node:fs";

const file = "apps/docs/src/components/InteractiveComponentDemo.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let text = readText(file);

if (!text) {
  throw new Error(`Missing or empty ${file}`);
}

const before = text;

text = text.replace(
  /function getControls\(component: NoctraDocsComponent\) \{/,
  "function getControls(component: NoctraDocsComponent): string[] {"
);

text = text.replace(
  /const controls = Array\.isArray\(preset\?\.controls\) \? preset\.controls : \[\];/,
  "const controls: unknown[] = Array.isArray(preset?.controls) ? preset.controls : [];"
);

text = text.replace(
  /const controls = useMemo\(\(\) => getControls\(component\), \[component\]\);/,
  "const controls = useMemo<string[]>(() => getControls(component), [component]);"
);

text = text.replace(
  /controls\.map\(\(control\) =>/g,
  "controls.map((control: string) =>"
);

if (text === before) {
  throw new Error("InteractiveComponentDemo.tsx was not changed. Expected control typing patterns were not found.");
}

writeText(file, text);

console.log("Interactive demo control type patched.");