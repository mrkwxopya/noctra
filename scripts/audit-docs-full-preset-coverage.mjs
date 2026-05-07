import { existsSync, readFileSync, writeFileSync } from "node:fs";

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function getGeneratedComponents() {
  const generated = readText("apps/docs/src/generated/noctra-professional-docs.generated.ts");
  const components = [];

  const regex = /\{\s*name:\s*"([A-Z][A-Za-z0-9]*)"[\s\S]*?kebab:\s*"([^"]+)"[\s\S]*?group:\s*"([^"]+)"/g;

  for (const match of generated.matchAll(regex)) {
    components.push({
      name: match[1],
      kebab: match[2],
      group: match[3]
    });
  }

  return components.sort((a, b) => a.name.localeCompare(b.name));
}

function hasPreset(presets, name) {
  return new RegExp(`(^|\\n)\\s*${name}\\s*:`, "m").test(presets);
}

function getPresetBlock(presets, name) {
  const match = new RegExp(`(^|\\n)(\\s*)${name}\\s*:\\s*\\{`, "m").exec(presets);

  if (!match || match.index === undefined) return "";

  const start = match.index + match[1].length;
  const openBrace = presets.indexOf("{", start);

  if (openBrace === -1) return "";

  let depth = 0;
  let end = openBrace;

  for (; end < presets.length; end += 1) {
    const char = presets[end];

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) {
      end += 1;
      break;
    }
  }

  return presets.slice(start, end);
}

const presets = readText("apps/docs/src/data/interactiveDemoPresets.ts");
const components = getGeneratedComponents();

const removedComponents = new Set([
  "DateInput",
  "DateTimeInput",
  "MonthInput",
  "TimeInput",
  "WeekInput",
  "YearInput",
  "TimePicker",
  "Calendar",
  "DatePicker",
  "DateTimePicker",
  "DateRangePicker"
]);

const problems = [];
const warnings = [];
const missingPresets = [];
const weakPresets = [];

for (const component of components) {
  if (removedComponents.has(component.name)) {
    problems.push(`Removed component still generated: ${component.name}`);
    continue;
  }

  if (!hasPreset(presets, component.name)) {
    missingPresets.push(component);
    continue;
  }

  const block = getPresetBlock(presets, component.name);

  const hasTitle = /\btitle\s*:/.test(block);
  const hasDescription = /\bdescription\s*:/.test(block);
  const hasProps = /\bprops\s*:/.test(block);
  const hasControls = /\bcontrols\s*:/.test(block);

  const weakReasons = [];

  if (!hasTitle) weakReasons.push("missing title");
  if (!hasDescription) weakReasons.push("missing description");
  if (!hasProps) weakReasons.push("missing props");
  if (!hasControls) weakReasons.push("missing controls");

  if (/Component content|Component preview|preview text|No steps available|Code preview|Container preview|Flex preview|Grid preview|ClickOutside preview/.test(block)) {
    weakReasons.push("contains placeholder text");
  }

  if (/\bcontrols\s*:\s*\[\s*["']Canvas["']/.test(block)) {
    weakReasons.push("contains generic canvas controls");
  }

  if (weakReasons.length > 0) {
    weakPresets.push({
      ...component,
      reasons: weakReasons
    });
  }
}

if (missingPresets.length > 0) {
  warnings.push(`${missingPresets.length} generated components do not have component-specific safe presets yet.`);
}

if (weakPresets.length > 0) {
  warnings.push(`${weakPresets.length} generated components have weak or placeholder presets.`);
}

const coveragePercent = components.length === 0
  ? 0
  : Math.round(((components.length - missingPresets.length) / components.length) * 100);

const report = [
  "# Docs Full Preset Coverage Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Generated components: ${components.length}`,
  `Preset coverage: ${coveragePercent}%`,
  `Missing presets: ${missingPresets.length}`,
  `Weak presets: ${weakPresets.length}`,
  `Problems found: ${problems.length}`,
  `Warnings found: ${warnings.length}`,
  "",
  "## Problems",
  "",
  ...(problems.length > 0 ? problems.map((problem) => `- ${problem}`) : ["- None"]),
  "",
  "## Warnings",
  "",
  ...(warnings.length > 0 ? warnings.map((warning) => `- ${warning}`) : ["- None"]),
  "",
  "## Missing presets",
  "",
  ...(missingPresets.length > 0
    ? missingPresets.map((component) => `- ${component.name} (${component.group})`)
    : ["- None"]),
  "",
  "## Weak presets",
  "",
  ...(weakPresets.length > 0
    ? weakPresets.map((component) => `- ${component.name} (${component.group}): ${component.reasons.join(", ")}`)
    : ["- None"]),
  "",
  "## Next step",
  "",
  "- Add safe presets for missing components.",
  "- Replace weak placeholder presets with component-specific realistic examples.",
  "- Keep preview/code state synchronized.",
  "- Do not reintroduce date/time removed components."
].join("\n");

writeFileSync("docs-full-preset-coverage-report.md", `${report}\n`, "utf8");

console.log(`Docs full preset coverage audit completed. Components: ${components.length}. Coverage: ${coveragePercent}%. Missing: ${missingPresets.length}. Weak: ${weakPresets.length}. Problems: ${problems.length}. Report: docs-full-preset-coverage-report.md`);

if (problems.length > 0) {
  console.error(report);
  throw new Error("Docs full preset coverage audit failed with blockers.");
}