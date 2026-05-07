import { readFileSync } from "node:fs";

const files = [
  "package.json",
  "apps/docs/package.json",
  "packages/react/package.json",
  "packages/styles/package.json",
  "packages/tokens/package.json",
  "packages/utils/package.json"
];

for (const file of files) {
  const raw = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  JSON.parse(raw);
}

console.log("Noctra JSON verification passed.");