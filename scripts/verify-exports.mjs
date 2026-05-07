import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());

const packages = [
  "packages/react",
  "packages/styles",
  "packages/tokens",
  "packages/utils"
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function checkFile(path, label) {
  const fullPath = join(root, path);

  if (!existsSync(fullPath)) {
    throw new Error(`${label} is missing: ${path}`);
  }
}

for (const packageDir of packages) {
  const packageJsonPath = join(root, packageDir, "package.json");
  const pkg = readJson(packageJsonPath);

  if (!pkg.exports) {
    checkFile(join(packageDir, pkg.types), `${pkg.name} types`);
    checkFile(join(packageDir, pkg.main), `${pkg.name} main`);
    continue;
  }

  for (const [exportName, exportValue] of Object.entries(pkg.exports)) {
    if (typeof exportValue === "string") {
      checkFile(join(packageDir, exportValue), `${pkg.name} ${exportName}`);
      continue;
    }

    if (exportValue.types) {
      checkFile(join(packageDir, exportValue.types), `${pkg.name} ${exportName} types`);
    }

    if (exportValue.import) {
      checkFile(join(packageDir, exportValue.import), `${pkg.name} ${exportName} import`);
    }
  }
}

console.log("Noctra export verification passed.");