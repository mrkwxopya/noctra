import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function readJson(path) {
  return JSON.parse(readText(path));
}

function writeJson(path, json) {
  writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`, "utf8");
}

function listPackageJsonFiles() {
  const roots = ["packages", "apps"];
  const output = [];

  for (const root of roots) {
    if (!existsSync(root)) continue;

    for (const entry of readdirSync(root)) {
      const fullPath = join(root, entry);
      if (!statSync(fullPath).isDirectory()) continue;

      const packageJsonPath = join(fullPath, "package.json");
      if (existsSync(packageJsonPath)) {
        output.push(packageJsonPath.replace(/\\/g, "/"));
      }
    }
  }

  if (existsSync("package.json")) {
    output.unshift("package.json");
  }

  return output.sort((a, b) => a.localeCompare(b));
}

function isPublishablePackage(path, json) {
  return path.startsWith("packages/") && !json.private;
}

function hasFile(path) {
  return existsSync(path);
}

function inferDotExport(packageDir) {
  if (hasFile(`${packageDir}/src/index.ts`) || hasFile(`${packageDir}/src/index.tsx`)) {
    return {
      types: "./dist/index.d.ts",
      import: "./dist/index.js"
    };
  }

  if (hasFile(`${packageDir}/src/index.css`)) {
    return "./src/index.css";
  }

  if (hasFile(`${packageDir}/src/components.css`)) {
    return "./src/components.css";
  }

  return null;
}

function ensureScript(json, name, command) {
  json.scripts ??= {};

  if (typeof json.scripts[name] === "string" && json.scripts[name].trim()) {
    return false;
  }

  json.scripts[name] = command;
  return true;
}

function ensureFiles(json, packageDir) {
  if (Array.isArray(json.files) && json.files.length > 0) {
    return false;
  }

  const files = [];

  if (hasFile(`${packageDir}/dist`) || hasFile(`${packageDir}/src/index.ts`) || hasFile(`${packageDir}/src/index.tsx`)) {
    files.push("dist");
  }

  if (hasFile(`${packageDir}/src`)) {
    files.push("src");
  }

  if (hasFile(`${packageDir}/README.md`)) {
    files.push("README.md");
  }

  if (hasFile("LICENSE")) {
    files.push("../../LICENSE");
  }

  json.files = files.length > 0 ? Array.from(new Set(files)) : ["dist", "src"];
  return true;
}

function sortPackageJson(json) {
  const preferredOrder = [
    "name",
    "version",
    "private",
    "description",
    "type",
    "license",
    "repository",
    "keywords",
    "sideEffects",
    "main",
    "module",
    "types",
    "style",
    "files",
    "exports",
    "publishConfig",
    "scripts",
    "dependencies",
    "peerDependencies",
    "optionalDependencies",
    "devDependencies"
  ];

  const sorted = {};

  for (const key of preferredOrder) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      sorted[key] = json[key];
    }
  }

  for (const key of Object.keys(json).sort((a, b) => a.localeCompare(b))) {
    if (!Object.prototype.hasOwnProperty.call(sorted, key)) {
      sorted[key] = json[key];
    }
  }

  return sorted;
}

const packageJsonFiles = listPackageJsonFiles();
const rootJson = existsSync("package.json") ? readJson("package.json") : {};
const fallbackVersion = typeof rootJson.version === "string" && rootJson.version.trim()
  ? rootJson.version
  : "0.0.0-alpha.0";

const changes = [];
const warnings = [];

for (const packageJsonPath of packageJsonFiles) {
  const packageDir = packageJsonPath.replace(/\/package\.json$/, "");
  const json = readJson(packageJsonPath);
  const packageName = json.name ?? packageJsonPath;
  const publishable = isPublishablePackage(packageJsonPath, json);
  let changed = false;

  if (packageJsonPath !== "package.json" && typeof json.version !== "string") {
    json.version = fallbackVersion;
    changed = true;
    changes.push(`${packageName}: added version ${fallbackVersion}`);
  }

  if (packageJsonPath !== "package.json" && json.type !== "module") {
    json.type = "module";
    changed = true;
    changes.push(`${packageName}: set type=module`);
  }

  if (publishable) {
    if (typeof json.sideEffects === "undefined") {
      json.sideEffects = [
        "**/*.css"
      ];
      changed = true;
      changes.push(`${packageName}: added sideEffects CSS allowlist`);
    }

    if (!json.publishConfig || typeof json.publishConfig !== "object") {
      json.publishConfig = {};
      changed = true;
      changes.push(`${packageName}: added publishConfig`);
    }

    if (json.publishConfig.access !== "public") {
      json.publishConfig.access = "public";
      changed = true;
      changes.push(`${packageName}: set publishConfig.access=public`);
    }

    if (!Array.isArray(json.files) || json.files.length === 0) {
      if (ensureFiles(json, packageDir)) {
        changed = true;
        changes.push(`${packageName}: added files array`);
      }
    }

    json.exports ??= {};

    if (!Object.prototype.hasOwnProperty.call(json.exports, ".")) {
      const inferredDotExport = inferDotExport(packageDir);

      if (inferredDotExport) {
        json.exports["."] = inferredDotExport;
        changed = true;
        changes.push(`${packageName}: added exports['.']`);
      } else {
        warnings.push(`${packageName}: could not infer exports['.'] safely`);
      }
    }
  }

  if (packageJsonPath.startsWith("packages/")) {
    if (ensureScript(json, "build", "tsc -p tsconfig.json")) {
      changed = true;
      changes.push(`${packageName}: added build script`);
    }

    if (ensureScript(json, "typecheck", "tsc --noEmit -p tsconfig.json")) {
      changed = true;
      changes.push(`${packageName}: added typecheck script`);
    }
  }

  if (changed) {
    writeJson(packageJsonPath, sortPackageJson(json));
  }
}

const report = [
  "# Noctra Release Metadata Auto-Heal Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Package files scanned: ${packageJsonFiles.length}`,
  `Changes applied: ${changes.length}`,
  `Warnings: ${warnings.length}`,
  "",
  "## Changes",
  "",
  ...(changes.length > 0 ? changes.map((change) => `- ${change}`) : ["- None"]),
  "",
  "## Warnings",
  "",
  ...(warnings.length > 0 ? warnings.map((warning) => `- ${warning}`) : ["- None"]),
  "",
  "## Note",
  "",
  "- This auto-heal only applies safe package metadata defaults.",
  "- It does not publish, tag, commit, or change external dependency versions.",
  "- Build, typecheck, verify-exports, package-entry audit, and final-quality-gate remain the source of truth."
].join("\n");

writeFileSync("release-metadata-auto-heal-report.md", `${report}\n`, "utf8");

console.log(`Release metadata auto-heal completed. Packages: ${packageJsonFiles.length}. Changes: ${changes.length}. Warnings: ${warnings.length}. Report: release-metadata-auto-heal-report.md`);