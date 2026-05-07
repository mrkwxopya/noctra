import { existsSync, readFileSync, writeFileSync } from "node:fs";

const detailPath = "apps/docs/src/pages/ComponentDetailPage.tsx";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

let text = readText(detailPath);

if (!text) {
  throw new Error(`Missing or empty ${detailPath}`);
}

if (!text.includes('from "./ButtonReferencePage"')) {
  const importLine = 'import { docsHref } from "../lib/docsRouting";';

  if (!text.includes(importLine)) {
    throw new Error("Could not find docsHref import line in ComponentDetailPage.tsx");
  }

  text = text.replace(importLine, `${importLine}\nimport { ButtonReferencePage } from "./ButtonReferencePage";`);
}

if (!text.includes('component.name === "Button"')) {
  const fnLine = "export function ComponentDetailPage({ component }: { component: NoctraDocsComponent }) {";

  if (!text.includes(fnLine)) {
    throw new Error("Could not find ComponentDetailPage function signature.");
  }

  text = text.replace(
    fnLine,
    `${fnLine}
  if (component.name === "Button") {
    return <ButtonReferencePage component={component} />;
  }
`
  );
}

writeText(detailPath, text);

console.log("Button reference docs route patched.");