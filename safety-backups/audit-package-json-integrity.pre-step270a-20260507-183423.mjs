import { existsSync, readFileSync, writeFileSync } from "node:fs";

const expectedFiles = [
  ["package.json", null],
  ["packages/utils/package.json", "@noctra/utils"],
  ["packages/tokens/package.json", "@noctra/tokens"],
  ["packages/react/package.json", "@noctra/react"],
  ["packages/styles/package.json", "@noctra/styles"],
  ["apps/docs/package.json", "@noctra/docs"]
];

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

const problems = [];
const checked = [];

for (const [file, expectedName] of expectedFiles) {
  checked.push(file);

  if (!existsSync(file)) {
    problems.push(`${file}: missing`);
    continue;
  }

  const text = readText(file);

  try {
    const data = JSON.parse(text);

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      problems.push(`${file}: root must be object`);
      continue;
    }

    if (expectedName && data.name !== expectedName) {
      problems.push(`${file}: expected name ${expectedName}, found ${String(data.name)}`);
    }

    if (data.exports !== undefined && (typeof data.exports !== "object" || data.exports === null || Array.isArray(data.exports))) {
      problems.push(`${file}: exports must be object`);
    }
  } catch (error) {
    problems.push(`${file}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const report = [
  "# Package JSON Integrity Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Files checked: ${checked.length}`,
  `Problems found: ${problems.length}`,
  "",
  "## Checked files",
  "",
  ...checked.map((file) => `- ${file}`),
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"])
].join("\n");

writeFileSync("package-json-integrity-report.md", `${report}\n`, "utf8");

console.log(`Package JSON integrity audit completed. Files: ${checked.length}. Problems: ${problems.length}. Report: package-json-integrity-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Package JSON integrity audit failed.");
}