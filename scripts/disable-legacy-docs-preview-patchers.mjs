import { existsSync, writeFileSync } from "node:fs";

const disabledPatchers = [
  "scripts/patch-docs-example-runtime.mjs",
  "scripts/patch-real-interactive-demos.mjs"
];

for (const file of disabledPatchers) {
  if (existsSync(file)) {
    writeFileSync(
      file,
      `console.log("${file} disabled: legacy generated/mock preview system was removed in favor of the real isolated playground.");\n`,
      "utf8"
    );
  }
}

console.log("Legacy docs preview patchers disabled.");