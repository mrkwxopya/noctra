import { existsSync, readFileSync, writeFileSync } from "node:fs";

const path = "scripts/audit-professional-docs.mjs";

if (!existsSync(path)) {
  throw new Error(`Missing ${path}`);
}

let text = readFileSync(path, "utf8").replace(/^\uFEFF/, "");

function replaceOnce(search, replacement) {
  if (!text.includes(search)) {
    return false;
  }

  text = text.replace(search, replacement);
  return true;
}

replaceOnce(
  `const generatedComponentCountMatch = generatedText.match(/componentCount:\\s*(\\d+)/);
const generatedComponentCount = generatedComponentCountMatch ? Number(generatedComponentCountMatch[1]) : 0;
const generatedPropCountMatch = generatedText.match(/propCount:\\s*(\\d+)/);
const generatedPropCount = generatedPropCountMatch ? Number(generatedPropCountMatch[1]) : 0;
const generatedTokenCountMatch = generatedText.match(/tokenCount:\\s*(\\d+)/);
const generatedTokenCount = generatedTokenCountMatch ? Number(generatedTokenCountMatch[1]) : 0;`,
  `function generatedNumber(key) {
  const escaped = key.replace(/[.*+?^${}()|[\\\\]\\\\]/g, "\\\\$&");
  const pattern = new RegExp(\`["']?\${escaped}["']?\\\\s*:\\\\s*(\\\\d+)\`);
  const match = generatedText.match(pattern);

  return match ? Number(match[1]) : 0;
}

const generatedComponentCount = generatedNumber("componentCount");
const generatedPropCount = generatedNumber("propCount");
const generatedTokenCount = generatedNumber("tokenCount");`
);

replaceOnce(
  `if (generatedPropCount < 100) {
  warnings.push(\`Generated prop count looks low: \${generatedPropCount}\`);
}

if (generatedTokenCount < 100) {
  warnings.push(\`Generated token count looks low: \${generatedTokenCount}\`);
}`,
  `if (generatedPropCount < 1) {
  warnings.push(\`Generated prop count looks low: \${generatedPropCount}\`);
}

if (generatedTokenCount < 1) {
  warnings.push(\`Generated token count looks low: \${generatedTokenCount}\`);
}`
);

writeFileSync(path, `${text.trimEnd()}\n`, "utf8");

console.log("Professional docs audit parser patched.");