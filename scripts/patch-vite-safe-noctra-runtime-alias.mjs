import { existsSync, readFileSync, writeFileSync } from "node:fs";

const viteCandidates = [
  "apps/docs/vite.config.ts",
  "apps/docs/vite.config.mts",
  "apps/docs/vite.config.js",
  "apps/docs/vite.config.mjs"
];

const vitePath = viteCandidates.find((file) => existsSync(file));
const reportPath = "vite-safe-noctra-runtime-alias-report.md";
const problems = [];

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

if (!vitePath) {
  throw new Error("No Vite config found for apps/docs.");
}

let text = readText(vitePath);

if (!text) {
  throw new Error(`${vitePath} is empty.`);
}

const before = text;

const isTs = vitePath.endsWith(".ts") || vitePath.endsWith(".mts");

if (!text.includes("fileURLToPath")) {
  text = `import { fileURLToPath, URL } from "node:url";\n${text}`;
}

if (!text.includes("noctraDocsSafeRuntimePath")) {
  const helper = `
const noctraDocsSafeRuntimePath = fileURLToPath(new URL("./src/components/docs-system/NoctraRuntimeMock.tsx", import.meta.url));

function noctraDocsSafeRuntimeAlias() {
  return {
    name: "noctra-docs-safe-runtime-alias",
    enforce: "pre",
    resolveId(id${isTs ? ": string" : ""}) {
      if (/^@noctra\\/react(?:\\/.*)?$/.test(id)) {
        return noctraDocsSafeRuntimePath;
      }

      return null;
    }
  };
}

`;

  const importBlockMatch = text.match(/^(?:import[\s\S]*?;\s*)+/);

  if (importBlockMatch) {
    text = `${importBlockMatch[0]}${helper}${text.slice(importBlockMatch[0].length)}`;
  } else {
    text = `${helper}${text}`;
  }
}

if (!text.includes("noctraDocsSafeRuntimeAlias(),")) {
  if (/plugins\s*:\s*\[/.test(text)) {
    text = text.replace(/plugins\s*:\s*\[/, "plugins: [noctraDocsSafeRuntimeAlias(), ");
  } else {
    text = text.replace(/defineConfig\s*\(\s*\{/, "defineConfig({\n  plugins: [noctraDocsSafeRuntimeAlias()],");
  }
}

writeText(vitePath, text);

const after = readText(vitePath);

if (!after.includes("noctraDocsSafeRuntimeAlias")) {
  problems.push("Vite config missing noctraDocsSafeRuntimeAlias helper.");
}

if (!after.includes("/^@noctra\\\\/react(?:\\\\/.*)?$/")) {
  problems.push("Vite config missing @noctra/react subpath regex.");
}

if (!after.includes("NoctraRuntimeMock.tsx")) {
  problems.push("Vite config missing NoctraRuntimeMock target.");
}

if (!after.includes("plugins: [noctraDocsSafeRuntimeAlias()")) {
  problems.push("Vite plugins array does not include noctraDocsSafeRuntimeAlias().");
}

const report = [
  "# Vite Safe Noctra Runtime Alias Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Vite config: ${vitePath}`,
  `Changed: ${before === after ? "no" : "yes"}`,
  `Problems found: ${problems.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Applied",
  "",
  "- Added Vite pre-resolve plugin.",
  "- Forced @noctra/react to NoctraRuntimeMock.tsx.",
  "- Forced @noctra/react/* subpaths to NoctraRuntimeMock.tsx.",
  "- This catches static imports, subpath imports, and dynamic import resolution in docs."
].join("\n");

writeText(reportPath, report);

console.log(`Vite safe Noctra runtime alias patch completed. Problems: ${problems.length}. Report: ${reportPath}`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Vite safe Noctra runtime alias patch failed.");
}
