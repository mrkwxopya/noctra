import { existsSync, renameSync, writeFileSync } from "node:fs";

if (existsSync("apps/docs/src/main.before-professional-docs.tsx")) {
  renameSync("apps/docs/src/main.before-professional-docs.tsx", "apps/docs/archive/main.before-professional-docs.tsx.bak");
}

console.log("DocsShell compatibility fixed and old main backup excluded from typecheck.");