import { existsSync, readFileSync, writeFileSync } from "node:fs";

const generatedFile = "apps/docs/src/generated/noctra-professional-docs.generated.ts";
const presetsFile = "apps/docs/src/data/interactiveDemoPresets.ts";

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

const placeholderPattern = /Component content|Component preview|preview text|No steps available|Code preview|Container preview|Flex preview|Grid preview|ClickOutside preview/;

function readText(path) {
  return existsSync(path) ? readFileSync(path, "utf8").replace(/^\uFEFF/, "") : "";
}

function writeText(path, content) {
  writeFileSync(path, `${content.trimEnd()}\n`, "utf8");
}

function titleize(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .trim();
}

function getGeneratedComponents() {
  const text = readText(generatedFile);
  const names = new Set();

  for (const match of text.matchAll(/name:\s*"([A-Z][A-Za-z0-9]*)"/g)) {
    if (match[1] && !removedComponents.has(match[1])) {
      names.add(match[1]);
    }
  }

  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

function hasPreset(source, name) {
  return new RegExp(`(^|\\n)\\s*${name}\\s*:`, "m").test(source);
}

function getPresetBlock(source, name) {
  const match = new RegExp(`(^|\\n)(\\s*)${name}\\s*:\\s*\\{`, "m").exec(source);

  if (!match || match.index === undefined) return "";

  const start = match.index + match[1].length;
  const openBrace = source.indexOf("{", start);

  if (openBrace === -1) return "";

  let depth = 0;
  let end = openBrace;

  for (; end < source.length; end += 1) {
    const char = source[end];

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) {
      end += 1;
      break;
    }
  }

  return source.slice(start, end);
}

function replacePresetBlock(source, name, newBlock) {
  const match = new RegExp(`(^|\\n)(\\s*)${name}\\s*:\\s*\\{`, "m").exec(source);

  if (!match || match.index === undefined) return source;

  const start = match.index + match[1].length;
  const openBrace = source.indexOf("{", start);

  if (openBrace === -1) return source;

  let depth = 0;
  let end = openBrace;

  for (; end < source.length; end += 1) {
    const char = source[end];

    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;

    if (depth === 0) {
      end += 1;
      break;
    }
  }

  if (source[end] === ",") {
    end += 1;
  }

  return `${source.slice(0, start)}${newBlock},${source.slice(end)}`;
}

function objectLiteral(value, indent = 4) {
  return JSON.stringify(value, null, 2)
    .replace(/"([A-Za-z_$][A-Za-z0-9_$]*)":/g, "$1:")
    .split("\n")
    .map((line, index) => (index === 0 ? line : `${" ".repeat(indent)}${line}`))
    .join("\n");
}

function makePreset(name) {
  const readable = titleize(name);
  const lower = name.toLowerCase();

  const base = {
    title: readable,
    description: `${readable} documentation preview with realistic Noctra content.`,
    props: {
      children: `${readable} content`
    },
    controls: ["children"]
  };

  if (lower.includes("button")) {
    return {
      title: readable,
      description: `${readable} with action text, variant, tone, size, and radius controls.`,
      props: {
        children: readable.includes("Icon") ? "★" : "Continue",
        variant: "default",
        tone: "primary",
        size: "md",
        radius: "md"
      },
      controls: ["variant", "tone", "size", "radius", "disabled", "loading", "children"]
    };
  }

  if (lower.includes("badge") || lower.includes("pill") || lower.includes("chip")) {
    return {
      title: readable,
      description: `${readable} compact inline status example.`,
      props: {
        children: "Ready",
        tone: "success",
        variant: "default",
        size: "md",
        radius: "full"
      },
      controls: ["children", "tone", "variant", "size", "radius", "disabled"]
    };
  }

  if (lower.includes("alert") || lower.includes("callout") || lower.includes("notification") || lower.includes("toast")) {
    return {
      title: readable,
      description: `${readable} with title and supporting message.`,
      previewWidth: 420,
      props: {
        title: "Release ready",
        description: "Noctra package checks passed successfully.",
        tone: "success",
        variant: "default"
      },
      controls: ["title", "description", "tone", "variant"]
    };
  }

  if (lower.includes("result") || lower.includes("empty")) {
    return {
      title: readable,
      description: `${readable} with clear title, message, and action copy.`,
      previewWidth: 420,
      props: {
        title: "No results found",
        description: "Try changing filters or searching another component.",
        actionLabel: "Reset filters"
      },
      controls: ["title", "description", "actionLabel"]
    };
  }

  if (lower.includes("breadcrumb")) {
    return {
      title: readable,
      description: `${readable} with /noctra docs navigation items.`,
      props: {
        items: [
          { label: "Docs", href: "/noctra/" },
          { label: "Components", href: "/noctra/components" },
          { label: readable }
        ]
      },
      controls: []
    };
  }

  if (lower.includes("progress") || lower.includes("meter")) {
    return {
      title: readable,
      description: `${readable} with controlled numeric value.`,
      previewWidth: 320,
      props: {
        value: 64,
        max: 100,
        label: "Build progress"
      },
      controls: ["value", "max", "label", "tone", "size"]
    };
  }

  if (lower.includes("stepper")) {
    return {
      title: readable,
      description: `${readable} with three clear steps.`,
      previewWidth: 520,
      props: {
        active: 1,
        items: [
          { value: "install", label: "Install", description: "Add package" },
          { value: "theme", label: "Theme", description: "Configure tokens" },
          { value: "ship", label: "Ship", description: "Publish app" }
        ]
      },
      controls: ["active", "orientation"]
    };
  }

  if (lower.includes("image")) {
    return {
      title: readable,
      description: `${readable} with safe inline SVG source.`,
      previewWidth: 260,
      props: {
        src: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22280%22%20height%3D%22160%22%3E%3Crect%20width%3D%22280%22%20height%3D%22160%22%20rx%3D%2224%22%20fill%3D%22%237c3aed%22/%3E%3Ctext%20x%3D%22140%22%20y%3D%2288%22%20font-size%3D%2224%22%20font-family%3D%22Arial%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3ENoctra%3C/text%3E%3C/svg%3E",
        alt: "Noctra preview"
      },
      controls: ["src", "alt", "radius"]
    };
  }

  if (lower.includes("kbd")) {
    return {
      title: readable,
      description: `${readable} keyboard shortcut example.`,
      props: {
        children: "⌘ K"
      },
      controls: ["children", "size"]
    };
  }

  if (lower.includes("divider")) {
    return {
      title: readable,
      description: `${readable} with label and orientation controls.`,
      previewWidth: 360,
      props: {
        label: "Section",
        orientation: "horizontal",
        variant: "default"
      },
      controls: ["label", "orientation", "variant"]
    };
  }

  if (lower.includes("card") || lower.includes("surface") || lower.includes("paper")) {
    return {
      title: readable,
      description: `${readable} with nested documentation content.`,
      previewWidth: 420,
      props: {
        title: "Noctra surface",
        description: "Layered card content with premium spacing.",
        children: "Card body content"
      },
      controls: ["title", "description", "children", "radius"]
    };
  }

  if (lower.includes("list")) {
    return {
      title: readable,
      description: `${readable} with meaningful list items.`,
      previewWidth: 360,
      props: {
        items: [
          { value: "tokens", label: "Tokens" },
          { value: "components", label: "Components" },
          { value: "docs", label: "Docs" }
        ]
      },
      controls: ["disabled"]
    };
  }

  if (lower.includes("loader") || lower.includes("spinner")) {
    return {
      title: readable,
      description: `${readable} loading indicator.`,
      props: {
        label: "Loading Noctra",
        size: "md"
      },
      controls: ["label", "size", "tone"]
    };
  }

  if (lower.includes("close") || lower.includes("action")) {
    return {
      title: readable,
      description: `${readable} compact action example.`,
      props: {
        label: readable,
        "aria-label": readable,
        size: "md"
      },
      controls: ["label", "size", "disabled"]
    };
  }

  if (lower.includes("group") || lower.includes("stack")) {
    return {
      title: readable,
      description: `${readable} layout with three child items.`,
      previewWidth: 420,
      props: {
        children: ["Alpha", "Beta", "Gamma"],
        gap: "md"
      },
      controls: ["gap", "align", "justify"]
    };
  }

  return base;
}

function presetToBlock(name, preset) {
  return `${name}: ${objectLiteral(preset, 4)}`;
}

function isWeakPreset(block) {
  if (!block) return true;
  if (placeholderPattern.test(block)) return true;
  if (!/\btitle\s*:/.test(block)) return true;
  if (!/\bdescription\s*:/.test(block)) return true;
  if (!/\bprops\s*:/.test(block)) return true;
  if (!/\bcontrols\s*:/.test(block)) return true;
  if (/\bcontrols\s*:\s*\[\s*["']Canvas["']/.test(block)) return true;

  return false;
}

let presets = readText(presetsFile);

if (!presets) {
  throw new Error(`Missing or empty ${presetsFile}`);
}

const marker = "\n};\n\nexport const componentInteractiveDemoPresets";

if (!presets.includes(marker)) {
  throw new Error("Could not find interactiveDemoPresets closing marker.");
}

const generated = getGeneratedComponents();
const added = [];
const replaced = [];

for (const name of generated) {
  const block = getPresetBlock(presets, name);
  const generatedBlock = presetToBlock(name, makePreset(name));

  if (!hasPreset(presets, name)) {
    presets = presets.replace(marker, `,\n\n  ${generatedBlock}${marker}`);
    added.push(name);
    continue;
  }

  if (isWeakPreset(block)) {
    presets = replacePresetBlock(presets, name, `  ${generatedBlock}`);
    replaced.push(name);
  }
}

writeText(presetsFile, presets);

const report = [
  "# Docs Safe Preset Autofill Report",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  `Generated components scanned: ${generated.length}`,
  `Added presets: ${added.length}`,
  `Replaced weak presets: ${replaced.length}`,
  "",
  "## Added presets",
  "",
  ...(added.length > 0 ? added.map((name) => `- ${name}`) : ["- None"]),
  "",
  "## Replaced weak presets",
  "",
  ...(replaced.length > 0 ? replaced.map((name) => `- ${name}`) : ["- None"])
].join("\n");

writeFileSync("docs-safe-preset-autofill-report.md", `${report}\n`, "utf8");

console.log(`Docs safe preset autofill completed. Scanned: ${generated.length}. Added: ${added.length}. Replaced: ${replaced.length}. Report: docs-safe-preset-autofill-report.md`);